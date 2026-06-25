// Components/Employees/ChangeCompensationModal.jsx
import { useState } from "react";
import { router } from "@inertiajs/react";
import { X, Coins, TrendingUp, Calculator } from "lucide-react";
import { computeRates } from "@/utils/rateCompute";

const PAYROLL_TYPES = [
    { value: "monthly",      label: "Monthly" },
    { value: "semi_monthly", label: "Semi-monthly" },
    { value: "weekly",       label: "Weekly" },
    { value: "daily",        label: "Daily" },
    { value: "hourly",       label: "Hourly" },
];

const SALARY_TYPES = [
    { value: "monthly_rate",      label: "Monthly Rate" },
    { value: "semi_monthly_rate", label: "Semi-monthly Rate" },
    { value: "weekly_rate",       label: "Weekly Rate" },
    { value: "daily_rate",        label: "Daily Rate" },
    { value: "hourly_rate",       label: "Hourly Rate" },
];

function fmtMoney(val) {
    if (val === null || val === undefined || val === "") return "—";
    return Number(val).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function CurrentValue({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-700">
                <span className="text-xs font-normal text-slate-400 mr-0.5">₱</span>
                {value}
            </p>
        </div>
    );
}

function FormField({ label, hint, error, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {label}
            </label>
            {children}
            {hint && !error && (
                <p className="mt-1 text-[10px] text-slate-400">{hint}</p>
            )}
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-300 shadow-sm transition-colors focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20";

const selectCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20";

export default function ChangeCompensationModal({ employee, workTimeFactors = [], onClose }) {
    const comp = employee.compensation ?? {};

    const [form, setForm] = useState({
        work_time_factor_id: comp.work_time_factor_id ? String(comp.work_time_factor_id) : "",
        monthly_rate:        comp.monthly_rate  ?? "",
        daily_rate:          comp.daily_rate    ?? "",
        hourly_rate:         comp.hourly_rate   ?? "",
        payroll_type:        comp.payroll_type  ?? "",
        salary_type:         comp.salary_type   ?? "",
        effective_date:      "",
        reason:              "",
    });

    const [errors, setErrors]       = useState({});
    const [processing, setProcessing] = useState(false);

    // Resolve the currently selected factor object
    const selectedFactor = workTimeFactors.find(
        (f) => String(f.id) === String(form.work_time_factor_id)
    ) ?? null;

    // When a rate field changes, auto-compute the other two if a factor is selected
    const handleRateChange = (e) => {
        const { name, value } = e.target;
        if (selectedFactor && value !== "") {
            const computed = computeRates(name, value, selectedFactor);
            setForm((prev) => ({ ...prev, [name]: value, ...computed }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // When the factor changes, re-compute based on whichever rate is filled in
    const handleFactorChange = (e) => {
        const factorId = e.target.value;
        const factor   = workTimeFactors.find((f) => String(f.id) === factorId) ?? null;

        setForm((prev) => {
            let next = { ...prev, work_time_factor_id: factorId };

            if (factor) {
                // Find whichever rate already has a value and recompute from it
                const pivot =
                    prev.monthly_rate !== "" ? "monthly_rate" :
                    prev.daily_rate   !== "" ? "daily_rate"   :
                    prev.hourly_rate  !== "" ? "hourly_rate"  : null;

                if (pivot) {
                    const computed = computeRates(pivot, prev[pivot], factor);
                    next = { ...next, ...computed };
                }
            }

            return next;
        });
    };

    const setField = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (!form.effective_date) errs.effective_date = "Effective date is required.";
        if (form.monthly_rate !== "" && isNaN(Number(form.monthly_rate)))
            errs.monthly_rate = "Must be a valid number.";
        if (form.daily_rate !== "" && isNaN(Number(form.daily_rate)))
            errs.daily_rate = "Must be a valid number.";
        if (form.hourly_rate !== "" && isNaN(Number(form.hourly_rate)))
            errs.hourly_rate = "Must be a valid number.";
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setProcessing(true);
        router.post(
            `/employees/${employee.id}/change-compensation`,
            {
                ...form,
                work_time_factor_id: form.work_time_factor_id || null,
                monthly_rate:        form.monthly_rate !== "" ? form.monthly_rate : null,
                daily_rate:          form.daily_rate   !== "" ? form.daily_rate   : null,
                hourly_rate:         form.hourly_rate  !== "" ? form.hourly_rate  : null,
                payroll_type:        form.payroll_type  || null,
                salary_type:         form.salary_type   || null,
            },
            {
                onSuccess: () => onClose(),
                onError:   (e) => { setErrors(e); setProcessing(false); },
                onFinish:  ()  => setProcessing(false),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B5BA5]/10">
                            <Coins className="h-4 w-4 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Change Compensation</p>
                            <p className="text-xs text-slate-400">
                                {employee.first_name} {employee.last_name}
                                {employee.employee_number && (
                                    <span className="ml-1.5 font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                        {employee.employee_number}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                    {/* ── Current snapshot ─────────────────────────────── */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Current values
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <CurrentValue label="Monthly"  value={fmtMoney(comp.monthly_rate)} />
                            <CurrentValue label="Daily"    value={fmtMoney(comp.daily_rate)} />
                            <CurrentValue label="Hourly"   value={fmtMoney(comp.hourly_rate)} />
                        </div>
                    </div>

                    {/* ── Divider ───────────────────────────────────────── */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            New values
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {/* ── Work time factor ──────────────────────────────── */}
                    <FormField label="Work time factor" error={errors.work_time_factor_id}>
                        <select
                            value={form.work_time_factor_id}
                            onChange={handleFactorChange}
                            className={selectCls}
                        >
                            <option value="">— No change —</option>
                            {workTimeFactors.map((f) => (
                                <option key={f.id} value={String(f.id)}>
                                    {f.factor_name}
                                    {f.working_days_per_month
                                        ? ` · ${f.working_days_per_month}d/mo`
                                        : ""}
                                    {f.working_hours_per_day
                                        ? `, ${f.working_hours_per_day}h/day`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {/* Factor info pill */}
                        {selectedFactor && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#3B5BA5]">
                                <Calculator className="h-3 w-3" strokeWidth={1.75} />
                                {selectedFactor.working_days_per_month} working days/month
                                &nbsp;·&nbsp;
                                {selectedFactor.working_hours_per_day} hours/day
                                &nbsp;·&nbsp;
                                auto-compute enabled
                            </div>
                        )}

                        {!selectedFactor && workTimeFactors.length > 0 && (
                            <p className="mt-1.5 text-[10px] text-amber-500">
                                ⚠ Select a factor to enable rate auto-computation.
                            </p>
                        )}
                    </FormField>

                    {/* ── Rates ─────────────────────────────────────────── */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { field: "monthly_rate", label: "Monthly rate" },
                            { field: "daily_rate",   label: "Daily rate" },
                            { field: "hourly_rate",  label: "Hourly rate" },
                        ].map(({ field, label }) => (
                            <FormField
                                key={field}
                                label={label}
                                error={errors[field]}
                                hint={selectedFactor ? "Auto-computed" : undefined}
                            >
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                        ₱
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name={field}
                                        value={form[field]}
                                        onChange={handleRateChange}
                                        placeholder="0.00"
                                        className={`${inputCls} pl-6`}
                                    />
                                </div>
                            </FormField>
                        ))}
                    </div>

                    {/* ── Payroll / Salary type ─────────────────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payroll type" error={errors.payroll_type}>
                            <select
                                value={form.payroll_type}
                                onChange={setField("payroll_type")}
                                className={selectCls}
                            >
                                <option value="">— No change —</option>
                                {PAYROLL_TYPES.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Salary type" error={errors.salary_type}>
                            <select
                                value={form.salary_type}
                                onChange={setField("salary_type")}
                                className={selectCls}
                            >
                                <option value="">— No change —</option>
                                {SALARY_TYPES.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    {/* ── Effective date ────────────────────────────────── */}
                    <FormField label="Effective date *" error={errors.effective_date}>
                        <input
                            type="date"
                            value={form.effective_date}
                            onChange={setField("effective_date")}
                            className={inputCls}
                        />
                    </FormField>

                    {/* ── Reason ───────────────────────────────────────── */}
                    <FormField label="Reason" error={errors.reason}>
                        <textarea
                            value={form.reason}
                            onChange={setField("reason")}
                            rows={3}
                            placeholder="Reason for compensation change (optional)"
                            className={`${inputCls} resize-none`}
                        />
                    </FormField>

                    {/* ── Footer ───────────────────────────────────────── */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#3B5BA5] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#33508f] transition-colors disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Coins className="h-4 w-4" strokeWidth={1.75} />
                                    Save changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}