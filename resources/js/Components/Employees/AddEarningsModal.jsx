import { useState } from "react";
import { router } from "@inertiajs/react";
import { X, Plus, Trash2, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const FREQUENCIES = [
    { value: "one-time",     label: "One-time" },
    { value: "daily",        label: "Daily" },
    { value: "weekly",       label: "Weekly" },
    { value: "bi-weekly",    label: "Bi-weekly" },
    { value: "semi-monthly", label: "Semi-monthly" },
    { value: "monthly",      label: "Monthly" },
];

const emptyRow = () => ({
    earning_id:     "",
    amount:         "",
    frequency:      "semi-monthly",
    is_continuous:  true,
    effective_date: "",
    end_date:       "",
});

function Field({ label, required, error, children }) {
    return (
        <div>
            <Label className="text-sm text-slate-700">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function AddEarningsModal({ employee, earnings = [], onClose }) {
    const existing = (employee.employee_earnings ?? []).map((ee) => ({
        earning_id:     String(ee.earning_id ?? ""),
        amount:         ee.amount ?? "",
        frequency:      ee.frequency ?? "semi-monthly",
        is_continuous:  ee.is_continuous ?? true,
        effective_date: ee.effective_date ? ee.effective_date.slice(0, 10) : "",
        end_date:       ee.end_date ? ee.end_date.slice(0, 10) : "",
    }));

    const [rows, setRows]             = useState(existing.length > 0 ? existing : []);
    const [errors, setErrors]         = useState({});
    const [processing, setProcessing] = useState(false);

    const usedIds = rows.map((r) => String(r.earning_id)).filter(Boolean);

    const updateRow = (index, field, value) => {
        setRows((prev) => {
            const next = prev.map((r, i) =>
                i === index ? { ...r, [field]: value } : r
            );
            if (field === "is_continuous" && value === true) {
                next[index].end_date = "";
            }
            if (field === "earning_id") {
                const found = earnings.find((e) => String(e.id) === String(value));
                if (found && !next[index].amount) {
                    next[index].amount = found.default_amount ?? "";
                }
            }
            return next;
        });
    };

    const addRow    = () => setRows((prev) => [...prev, emptyRow()]);
    const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));
    const rowError  = (index, field) => errors[`employee_earnings.${index}.${field}`];

    const handleSubmit = () => {
        setProcessing(true);
        router.post(
            `/employees/${employee.id}/earnings`,
            { employee_earnings: rows },
            {
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B5BA5]/10">
                            <Coins className="h-4 w-4 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Manage Earnings
                            </h2>
                            <p className="text-xs text-slate-500">
                                {employee.first_name} {employee.last_name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {rows.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                            No earnings added yet. Click "Add Earning" below.
                        </div>
                    )}

                    {rows.map((row, index) => {
                        const selectedEarning = earnings.find(
                            (e) => String(e.id) === String(row.earning_id)
                        );

                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                            >
                                {/* Row header */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        #{index + 1}
                                        {selectedEarning && (
                                            <span className="ml-2 font-normal normal-case text-slate-400">
                                                — {selectedEarning.name}
                                            </span>
                                        )}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Toggle
                                                checked={row.is_continuous}
                                                onCheckedChange={(v) =>
                                                    updateRow(index, "is_continuous", v)
                                                }
                                            />
                                            <Label className="cursor-pointer text-sm text-slate-600">
                                                {row.is_continuous ? "Continuous" : "Fixed Period"}
                                            </Label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                                        </button>
                                    </div>
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    {/* Earning type */}
                                    <Field
                                        label="Earning Type"
                                        required
                                        error={rowError(index, "earning_id")}
                                    >
                                        <Select
                                            value={String(row.earning_id)}
                                            onValueChange={(v) =>
                                                updateRow(index, "earning_id", v)
                                            }
                                        >
                                            <SelectTrigger className="!bg-white mt-1">
                                                <SelectValue placeholder="Select earning…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {earnings
                                                    .filter(
                                                        (e) =>
                                                            String(e.id) === String(row.earning_id) ||
                                                            !usedIds.includes(String(e.id))
                                                    )
                                                    .map((e) => (
                                                        <SelectItem key={e.id} value={String(e.id)}>
                                                            {e.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    {/* Amount */}
                                    <Field
                                        label="Amount"
                                        required
                                        error={rowError(index, "amount")}
                                    >
                                        <div className="relative mt-1">
                                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                                                ₱
                                            </span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="pl-7 !bg-white"
                                                value={row.amount}
                                                onChange={(e) =>
                                                    updateRow(index, "amount", e.target.value)
                                                }
                                            />
                                        </div>
                                    </Field>

                                    {/* Frequency */}
                                    <Field
                                        label="Frequency"
                                        error={rowError(index, "frequency")}
                                    >
                                        <Select
                                            value={row.frequency}
                                            onValueChange={(v) =>
                                                updateRow(index, "frequency", v)
                                            }
                                        >
                                            <SelectTrigger className="!bg-white mt-1">
                                                <SelectValue placeholder="Select…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FREQUENCIES.map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    {/* Effective date — per row */}
                                    <Field
                                        label="Effective Date"
                                        required
                                        error={rowError(index, "effective_date")}
                                    >
                                        <Input
                                            type="date"
                                            className="!bg-white mt-1"
                                            value={row.effective_date}
                                            onChange={(e) =>
                                                updateRow(index, "effective_date", e.target.value)
                                            }
                                        />
                                    </Field>

                                    {/* End date — only when not continuous */}
                                    {!row.is_continuous && (
                                        <Field
                                            label="End Date"
                                            error={rowError(index, "end_date")}
                                        >
                                            <Input
                                                type="date"
                                                className="!bg-white mt-1"
                                                value={row.end_date}
                                                onChange={(e) =>
                                                    updateRow(index, "end_date", e.target.value)
                                                }
                                            />
                                        </Field>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-center pt-1">
                        <Button
                            type="button"
                            variant="info-outline"
                            size="sm"
                            onClick={addRow}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                            Add Earning
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="bg-[#3B5BA5] hover:bg-[#33508f] text-white"
                    >
                        {processing ? "Saving…" : "Save Earnings"}
                    </Button>
                </div>
            </div>
        </div>
    );
}