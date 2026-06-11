import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { computeRates } from "@/utils/rateCompute";

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
}) {
    const sel = (name) => (v) => onChange({ target: { name, value: v } });

    const selectedFactor = workTimeFactors.find(
        (f) => String(f.id) === String(form.work_time_factor_id)
    ) ?? null;

    const handleRateChange = (e) => {
        const { name, value } = e.target;

        if (selectedFactor && value !== "") {
            const computed = computeRates(name, value, selectedFactor);
            onBulkChange({ [name]: value, ...computed });
        } else {
            // No factor selected or field cleared — just update the one field
            onChange(e);
        }
    };

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

                    {/* ── Effectivity ────────────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-4">
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
                </div>

                {/* Factor summary badge */}
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
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="semi_monthly">Semi-monthly</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Salary Type" error={errors.salary_type}>
                        <Select
                            value={form.salary_type ?? ""}
                            onValueChange={sel("salary_type")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hourly_rate">Hourly Rate</SelectItem>
                                <SelectItem value="daily_rate">Daily Rate</SelectItem>
                                <SelectItem value="weekly_rate">Weekly Rate</SelectItem>
                                <SelectItem value="semi_monthly_rate">Semi-monthly Rate</SelectItem>
                                <SelectItem value="monthly_rate">Monthly Rate</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </div>

        </div>
    );
}