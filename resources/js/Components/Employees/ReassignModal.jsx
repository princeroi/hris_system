import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getFullName } from "@/utils/employeeUtils";
import { toUpperCase } from "@/utils/textUtils";

// Matches migration enum exactly
const EMPLOYMENT_TYPES = [
    { value: "probationary",  label: "Probationary"  },
    { value: "regular",       label: "Regular"        },
    { value: "project_based", label: "Project Based"  },
    { value: "contractual",   label: "Contractual"    },
    { value: "reliever",      label: "Reliever"       },
    { value: "part_time",     label: "Part Time"      },
    { value: "intern",        label: "Intern"         },
];

// Matches migration enum exactly: 'no_contract', 'valid', 'expired'
const CONTRACT_STATUSES = [
    { value: "no_contract", label: "No Contract" },
    { value: "valid",       label: "Valid"        },
    { value: "expired",     label: "Expired"      },
];

// Types that show regularization / probationary fields (no contract date range)
const REGULAR_LIKE = ["regular", "probationary"];

const isRegularLike = (type) => REGULAR_LIKE.includes(type);

// ── Small reusable components ─────────────────────────────────────────────────

function SectionTitle({ children }) {
    return (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {children}
        </p>
    );
}

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function FormSelect({ label, value, onValueChange, placeholder, options, error }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">
                        <span className="text-slate-400">— None —</span>
                    </SelectItem>
                    {options.map(({ value: v, label: l }) => (
                        <SelectItem key={v} value={v}>
                            {l}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FieldError message={error} />
        </div>
    );
}

function DateField({ label, value, onChange, error, required = false }) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label}{required && <span className="ml-0.5 text-red-500">*</span>}
            </Label>
            <Input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <FieldError message={error} />
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReassignModal({
    employee,
    companies   = [],
    branches    = [],
    departments = [],
    positions   = [],
    onClose,
}) {
    const ed = employee?.employment_details ?? {};

    // Original employment type — used to detect if it actually changed
    const originalType = ed.employment_type ?? "none";

    const [form, setForm] = useState({
        // ── Placement
        company_id:    ed.company_id    ? String(ed.company_id)    : "none",
        branch_id:     ed.branch_id     ? String(ed.branch_id)     : "none",
        department_id: ed.department_id ? String(ed.department_id) : "none",
        position_id:   ed.position_id   ? String(ed.position_id)   : "none",

        // ── Employment type
        employment_type: originalType,

        // ── Contract status (shared — all types)
        contract_status: ed.contract_status ?? "none",

        // ── Regular / Probationary fields
        regularization_date:          ed.regularization_date          ?? "",
        probationary_period_months:   ed.probationary_period_months   ?? "",
        probationary_evaluation_date: ed.probationary_evaluation_date ?? "",

        // ── Non-regular / non-probationary fields
        contract_date_from: ed.contract_date_from ?? "",
        contract_date_to:   ed.contract_date_to   ?? "",

        // ── Reassignment meta
        effective_date: "",
        reason:         "",
    });

    const [errors, setErrors]         = useState({});
    const [processing, setProcessing] = useState(false);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    // Derived display flags — conditional sections only appear when type changes
    const typeChanged        = form.employment_type !== "none" && form.employment_type !== originalType;
    const showRegularFields  = typeChanged && isRegularLike(form.employment_type);
    const showProbationary   = typeChanged && form.employment_type === "probationary";
    const showContractFields = typeChanged && !isRegularLike(form.employment_type);

    const handleSubmit = () => {
        if (!form.effective_date) {
            setErrors({ effective_date: "Effective date is required." });
            return;
        }

        setProcessing(true);

        // Normalise "none" / "" → null
        const payload = Object.fromEntries(
            Object.entries(form).map(([k, v]) => [k, v === "none" || v === "" ? null : v])
        );

        // Strip fields that are irrelevant to the chosen type so the backend
        // doesn't receive stale defaults.
        if (!typeChanged) {
            // Type didn't change: don't send any employment-type-specific fields
            delete payload.regularization_date;
            delete payload.probationary_period_months;
            delete payload.probationary_evaluation_date;
            delete payload.contract_date_from;
            delete payload.contract_date_to;
            delete payload.contract_status;
        } else if (showRegularFields) {
            // Regular / Probationary: no contract date range
            delete payload.contract_date_from;
            delete payload.contract_date_to;
            if (!showProbationary) {
                delete payload.probationary_period_months;
                delete payload.probationary_evaluation_date;
            }
        } else if (showContractFields) {
            // Other types: no regularization / probationary fields
            delete payload.regularization_date;
            delete payload.probationary_period_months;
            delete payload.probationary_evaluation_date;
        }

        router.post(`/employees/${employee.id}/reassign`, payload, {
            onSuccess: () => { setProcessing(false); onClose(); },
            onError:   (e) => { setErrors(e); setProcessing(false); },
        });
    };

    const fullName = toUpperCase(getFullName(employee));

    const companyOptions    = companies.map((c)  => ({ value: String(c.id), label: c.company_name    }));
    const branchOptions     = branches.map((b)   => ({ value: String(b.id), label: b.branch_name     }));
    const departmentOptions = departments.map((d) => ({ value: String(d.id), label: d.department_name }));
    const positionOptions   = positions.map((p)  => ({ value: String(p.id), label: p.position_name   }));

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle>Reassign Employee</DialogTitle>
                    <DialogDescription className="sr-only">
                        Reassign employee to a different company, branch, department, or position.
                    </DialogDescription>
                    <p className="text-sm text-slate-500">
                        Updating assignment for{" "}
                        <span className="font-medium text-slate-700">{fullName}</span>.
                        Only changed fields will be saved.
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-2">

                    {/* ── Company & Branch ── */}
                    <div>
                        <SectionTitle>Company & Branch</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                label="Company"
                                value={form.company_id}
                                onValueChange={(v) => set("company_id", v)}
                                placeholder="Select company"
                                options={companyOptions}
                                error={errors.company_id}
                            />
                            <FormSelect
                                label="Branch"
                                value={form.branch_id}
                                onValueChange={(v) => set("branch_id", v)}
                                placeholder="Select branch"
                                options={branchOptions}
                                error={errors.branch_id}
                            />
                        </div>
                    </div>

                    {/* ── Department & Position ── */}
                    <div>
                        <SectionTitle>Department & Position</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                label="Department"
                                value={form.department_id}
                                onValueChange={(v) => set("department_id", v)}
                                placeholder="Select department"
                                options={departmentOptions}
                                error={errors.department_id}
                            />
                            <FormSelect
                                label="Position"
                                value={form.position_id}
                                onValueChange={(v) => set("position_id", v)}
                                placeholder="Select position"
                                options={positionOptions}
                                error={errors.position_id}
                            />
                        </div>
                    </div>

                    {/* ── Employment Type ── */}
                    <div>
                        <SectionTitle>Employment Type</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormSelect
                                    label="Employment Type"
                                    value={form.employment_type}
                                    onValueChange={(v) => set("employment_type", v)}
                                    placeholder="Select type"
                                    options={EMPLOYMENT_TYPES}
                                    error={errors.employment_type}
                                />
                                {originalType !== "none" && (
                                    <p className="mt-1 text-xs text-slate-400">
                                        Current:{" "}
                                        <span className="font-medium capitalize text-slate-500">
                                            {originalType.replace(/_/g, " ")}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Hint when type is unchanged */}
                        {!typeChanged && form.employment_type !== "none" && (
                            <p className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-600">
                                Employment type is unchanged — contract / regularization fields will
                                appear only when you select a different type.
                            </p>
                        )}
                    </div>

                    {/* ── Regular OR Probationary fields ── */}
                    {showRegularFields && (
                        <div>
                            <SectionTitle>
                                {form.employment_type === "probationary"
                                    ? "Probationary Details"
                                    : "Regularization Details"}
                            </SectionTitle>
                            <div className="grid grid-cols-2 gap-4">

                                {/* Contract Status — shared */}
                                <FormSelect
                                    label="Contract Status"
                                    value={form.contract_status}
                                    onValueChange={(v) => set("contract_status", v)}
                                    placeholder="Select status"
                                    options={CONTRACT_STATUSES}
                                    error={errors.contract_status}
                                />

                                {/* Regularization Date — Regular & Probationary */}
                                <DateField
                                    label="Regularization Date"
                                    value={form.regularization_date}
                                    onChange={(v) => set("regularization_date", v)}
                                    error={errors.regularization_date}
                                />

                                {/* Probationary-only fields */}
                                {showProbationary && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label>Probationary Period (months)</Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={24}
                                                placeholder={
                                                    ed.probationary_period_months
                                                        ? String(ed.probationary_period_months)
                                                        : "e.g. 6"
                                                }
                                                value={form.probationary_period_months}
                                                onChange={(e) =>
                                                    set("probationary_period_months", e.target.value)
                                                }
                                            />
                                            <FieldError message={errors.probationary_period_months} />
                                        </div>

                                        <DateField
                                            label="Probationary Evaluation Date"
                                            value={form.probationary_evaluation_date}
                                            onChange={(v) =>
                                                set("probationary_evaluation_date", v)
                                            }
                                            error={errors.probationary_evaluation_date}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Other types (contractual, project-based, etc.) ── */}
                    {showContractFields && (
                        <div>
                            <SectionTitle>Contract Details</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">

                                {/* Contract Status */}
                                <FormSelect
                                    label="Contract Status"
                                    value={form.contract_status}
                                    onValueChange={(v) => set("contract_status", v)}
                                    placeholder="Select status"
                                    options={CONTRACT_STATUSES}
                                    error={errors.contract_status}
                                />

                                {/* Spacer */}
                                <div />

                                <DateField
                                    label="Contract Date From"
                                    value={form.contract_date_from}
                                    onChange={(v) => set("contract_date_from", v)}
                                    error={errors.contract_date_from}
                                />

                                <DateField
                                    label="Contract Date To"
                                    value={form.contract_date_to}
                                    onChange={(v) => set("contract_date_to", v)}
                                    error={errors.contract_date_to}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Reassignment Details ── */}
                    <div>
                        <SectionTitle>Reassignment Details</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <DateField
                                label="Effective Date"
                                value={form.effective_date}
                                onChange={(v) => set("effective_date", v)}
                                error={errors.effective_date}
                                required
                            />
                            <div className="space-y-1.5">
                                <Label>Reason</Label>
                                <Input
                                    type="text"
                                    placeholder="Optional reason..."
                                    value={form.reason}
                                    onChange={(e) => set("reason", e.target.value)}
                                />
                                <FieldError message={errors.reason} />
                            </div>
                        </div>
                    </div>

                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="bg-[#3B5BA5] hover:bg-[#33508f]"
                    >
                        {processing ? "Saving..." : "Save Reassignment"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}