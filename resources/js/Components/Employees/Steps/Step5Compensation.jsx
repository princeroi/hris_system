import { Plus, Trash2 } from "lucide-react";
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
import { computeRates } from "@/utils/rateCompute";

const FREQUENCIES = [
    { value: "one-time",     label: "One-time" },
    { value: "daily",        label: "Daily" },
    { value: "weekly",       label: "Weekly" },
    { value: "bi-weekly",    label: "Bi-weekly" },
    { value: "semi-monthly", label: "Semi-monthly" },
    { value: "monthly",      label: "Monthly" },
];

const emptyEarningRow = (hiredDate = "") => ({
    earning_id:     "",
    amount:         "",
    frequency:      "semi-monthly",
    is_continuous:  true,
    effective_date: hiredDate,
    end_date:       "",
});

function SectionHeading({ title, description }) {
    return (
        <div className="pb-3 border-b border-[#BFDBFE]">
            <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
            {description && (
                <p className="text-sm text-[#3B5BA5] mt-1">{description}</p>
            )}
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div>
            <Label>
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

const rateFields = [
    { name: "monthly_rate", label: "Monthly Rate", placeholder: "0.00" },
    { name: "daily_rate",   label: "Daily Rate",   placeholder: "0.00" },
    { name: "hourly_rate",  label: "Hourly Rate",  placeholder: "0.00" },
];


export default function Step5Compensation({
    form,
    onChange,
    onBulkChange,
    errors = {},
    workTimeFactors = [],
    cellOptions = {},
    earnings = [],
}) {
    const opts = (key) => cellOptions[key] ?? [];
    const sel  = (name) => (v) => onChange({ target: { name, value: v } });

    const hiredDate = form.hired_date ?? "";  // ← pull hired_date from form

    const selectedFactor = workTimeFactors.find(
        (f) => String(f.id) === String(form.work_time_factor_id)
    ) ?? null;

    const handleRateChange = (e) => {
        const { name, value } = e.target;
        if (selectedFactor && value !== "") {
            const computed = computeRates(name, value, selectedFactor);
            onBulkChange({ [name]: value, ...computed });
        } else {
            onChange(e);
        }
    };

    const earningRows = form.employee_earnings ?? [];

    const updateEarningRow = (index, field, value) => {
        const next = earningRows.map((r, i) =>
            i === index ? { ...r, [field]: value } : r
        );

        if (field === "is_continuous" && value === true) {
            next[index].end_date = "";
        }

        if (field === "earning_id") {
            const found = earnings.find((e) => String(e.id) === String(value));
            if (found && !earningRows[index].amount) {
                next[index].amount = found.default_amount ?? "";
            }
        }

        onBulkChange({ employee_earnings: next });
    };

    const addEarningRow = () => {
        onBulkChange({ employee_earnings: [...earningRows, emptyEarningRow(hiredDate)] }); // ← pass hiredDate
    };

    const removeEarningRow = (index) => {
        onBulkChange({
            employee_earnings: earningRows.filter((_, i) => i !== index),
        });
    };

    const earningError = (index, field) =>
        errors[`employee_earnings.${index}.${field}`];

    const usedEarningIds = earningRows
        .map((r) => String(r.earning_id))
        .filter(Boolean);

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-8">

            {/* ── Work Time Factor ───────────────────────────────── */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Work Time Factor" error={errors.work_time_factor_id}>
                        <Select
                            value={form.work_time_factor_id ? String(form.work_time_factor_id) : ""}
                            onValueChange={(v) =>
                                onChange({ target: { name: "work_time_factor_id", value: v } })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select factor" />
                            </SelectTrigger>
                            <SelectContent>
                                {workTimeFactors.map((f) => (
                                    <SelectItem key={f.id} value={String(f.id)}>
                                        {f.factor_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Effective Date" error={errors.effective_date}>
                        <Input
                            name="effective_date"
                            type="date"
                            value={form.effective_date ?? ""}
                            onChange={onChange}
                            className="!bg-white"
                        />
                    </Field>
                </div>

                {selectedFactor && (
                    <p className="text-xs text-[#3B5BA5]">
                        {selectedFactor.working_days_per_month} working days/month
                        &nbsp;·&nbsp;
                        {selectedFactor.working_hours_per_day} hours/day
                    </p>
                )}
            </div>

            {/* ── Rates ──────────────────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading
                    title="Compensation"
                    description="Enter any one rate — the others will be computed automatically."
                />

                {!selectedFactor && (
                    <p className="text-xs text-amber-600">
                        ⚠ Select a work time factor above to enable auto-computation.
                    </p>
                )}

                <div className="grid grid-cols-3 gap-4">
                    {rateFields.map(({ name, label, placeholder }) => (
                        <Field key={name} label={label} error={errors[name]}>
                            <Input
                                name={name}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={placeholder}
                                value={form[name] ?? ""}
                                onChange={handleRateChange}
                                className="!bg-white"
                            />
                        </Field>
                    ))}
                </div>
            </div>

            {/* ── Payroll Schedule ───────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading title="Payroll Schedule" />
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Payroll Type" error={errors.payroll_type}>
                        <Select
                            value={form.payroll_type ?? ""}
                            onValueChange={sel("payroll_type")}
                        >
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {opts("payroll_type").length > 0
                                    ? opts("payroll_type").map((v) => (
                                        <SelectItem key={v} value={v}>
                                            {v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </SelectItem>
                                    ))
                                    : (
                                        <>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="semi_monthly">Semi-monthly</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                        </>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Salary Type" error={errors.salary_type}>
                        <Select
                            value={form.salary_type ?? ""}
                            onValueChange={sel("salary_type")}
                        >
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {opts("salary_type").length > 0
                                    ? opts("salary_type").map((v) => (
                                        <SelectItem key={v} value={v}>
                                            {v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </SelectItem>
                                    ))
                                    : (
                                        <>
                                            <SelectItem value="hourly_rate">Hourly Rate</SelectItem>
                                            <SelectItem value="daily_rate">Daily Rate</SelectItem>
                                            <SelectItem value="weekly_rate">Weekly Rate</SelectItem>
                                            <SelectItem value="semi_monthly_rate">Semi-monthly Rate</SelectItem>
                                            <SelectItem value="monthly_rate">Monthly Rate</SelectItem>
                                        </>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </div>

            {/* ── Earnings ───────────────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading
                    title="Earnings"
                    description="Assign additional earnings to this employee. Amount defaults to the earning type's default."
                />

                {earningRows.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
                        No earnings added yet.
                    </div>
                )}

                <div className="space-y-3">
                    {earningRows.map((row, index) => {
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
                                        {/* Continuous toggle in header */}
                                        <div className="flex items-center gap-2">
                                            <Toggle
                                                checked={row.is_continuous}
                                                onCheckedChange={(v) =>
                                                    updateEarningRow(index, "is_continuous", v)
                                                }
                                            />
                                            <Label className="cursor-pointer text-sm">
                                                {row.is_continuous ? "Continuous" : "Fixed Period"}
                                            </Label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeEarningRow(index)}
                                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                                        </button>
                                    </div>
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                    {/* Earning type */}
                                    <Field
                                        label="Earning Type"
                                        required
                                        error={earningError(index, "earning_id")}
                                    >
                                        <Select
                                            value={String(row.earning_id)}
                                            onValueChange={(v) =>
                                                updateEarningRow(index, "earning_id", v)
                                            }
                                        >
                                            <SelectTrigger className="!bg-white">
                                                <SelectValue placeholder="Select earning…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {earnings
                                                    .filter(
                                                        (e) =>
                                                            String(e.id) === String(row.earning_id) ||
                                                            !usedEarningIds.includes(String(e.id))
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
                                        error={earningError(index, "amount")}
                                    >
                                        <div className="relative">
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
                                                    updateEarningRow(index, "amount", e.target.value)
                                                }
                                            />
                                        </div>
                                    </Field>

                                    {/* Frequency */}
                                    <Field label="Frequency" error={earningError(index, "frequency")}>
                                        <Select
                                            value={row.frequency}
                                            onValueChange={(v) =>
                                                updateEarningRow(index, "frequency", v)
                                            }
                                        >
                                            <SelectTrigger className="!bg-white">
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

                                    {/* Effective date */}
                                    <Field
                                        label="Effective Date"
                                        error={earningError(index, "effective_date")}
                                    >
                                        <Input
                                            type="date"
                                            className="!bg-white"
                                            value={row.effective_date}
                                            onChange={(e) =>
                                                updateEarningRow(index, "effective_date", e.target.value)
                                            }
                                        />
                                    </Field>

                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="info-outline"
                        size="sm"
                        onClick={addEarningRow}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" strokeWidth={1.75} />
                        Add Earning
                    </Button>
                </div>
                
            </div>

        </div>
    );
}