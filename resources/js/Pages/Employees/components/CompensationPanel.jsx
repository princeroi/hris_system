// resources/js/Pages/Employees/components/CompensationPanel.jsx

import { ChevronDown } from "lucide-react";
import { computeRates } from "@/utils/rateCompute";

const RATE_COLS = [
    { key: "monthly_rate",  label: "Monthly Rate"  },
    { key: "daily_rate",    label: "Daily Rate"     },
    { key: "hourly_rate",   label: "Hourly Rate"    },
];

const PAYROLL_TYPES = ["monthly", "semi_monthly", "weekly", "daily", "hourly"];
const SALARY_TYPES  = ["monthly_rate", "semi_monthly_rate", "weekly_rate", "daily_rate", "hourly_rate"];

function SelectField({ value, options, onChange, placeholder = "Select…" }) {
    return (
        <div className="relative">
            <select
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                className="w-full h-8 pl-2.5 pr-7 text-xs border border-slate-200 rounded-md
                           focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                           appearance-none bg-white text-slate-700"
            >
                <option value="">{placeholder}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

/**
 * Full-width compensation panel with horizontal scroll.
 * Props:
 *   rows           — full rows array
 *   onUpdate       — (nextRows) => void
 *   workTimeFactors — [{ id, factor_name, working_days_per_month, working_hours_per_day }]
 */
export default function CompensationPanel({ rows, onUpdate, workTimeFactors = [] }) {

    const updateField = (ri, fields) => {
        const next = [...rows];
        next[ri]   = { ...next[ri], ...fields };
        onUpdate(next);
    };

    const handleRateChange = (ri, rateKey, rawValue) => {
        const row    = rows[ri];
        const factor = workTimeFactors.find(f => String(f.id) === String(row.work_time_factor_id)) ?? null;

        if (factor && rawValue !== "") {
            const computed = computeRates(rateKey, rawValue, factor);
            updateField(ri, { [rateKey]: rawValue, ...computed });
        } else {
            updateField(ri, { [rateKey]: rawValue });
        }
    };

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-180px)] w-full">
            <div style={{ minWidth: "900px" }}>

                {/* Header row */}
                <div className="flex items-end gap-3 px-5 py-2 border-b-2 border-slate-200 bg-slate-50 sticky top-0 z-10">
                    <div className="w-8 shrink-0" />
                    <div className="w-44 shrink-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Work Time Factor</p>
                    </div>
                    {RATE_COLS.map(({ key, label }) => (
                        <div key={key} className="w-32 shrink-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                                {label}
                                <span className="text-[10px] text-slate-400 normal-case font-normal">(auto)</span>
                            </p>
                        </div>
                    ))}
                    <div className="w-36 shrink-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Payroll Type</p>
                    </div>
                    <div className="w-36 shrink-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Salary Type</p>
                    </div>
                    <div className="w-36 shrink-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Effective Date</p>
                    </div>
                </div>

                {/* Data rows */}
                <div className="divide-y divide-slate-100">
                    {rows.map((row, ri) => {
                        const factor = workTimeFactors.find(f => String(f.id) === String(row.work_time_factor_id)) ?? null;

                        return (
                            <div
                                key={ri}
                                className={`flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50/60 transition-colors ${
                                    ri % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                                }`}
                            >
                                {/* # */}
                                <div className="w-8 shrink-0">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                                        {ri + 1}
                                    </span>
                                </div>

                                {/* Work Time Factor */}
                                <div className="w-44 shrink-0">
                                    <SelectField
                                        value={row.work_time_factor_id}
                                        options={workTimeFactors.map(f => ({ value: String(f.id), label: f.factor_name }))}
                                        onChange={v => updateField(ri, { work_time_factor_id: v })}
                                        placeholder="Select factor…"
                                    />
                                    {factor ? (
                                        <p className="text-[10px] text-blue-600 mt-0.5">
                                            {factor.working_days_per_month}d/mo · {factor.working_hours_per_day}h/day
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-amber-500 mt-0.5">⚠ Select to auto-compute</p>
                                    )}
                                </div>

                                {/* Rate fields */}
                                {RATE_COLS.map(({ key }) => (
                                    <div key={key} className="w-32 shrink-0">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={row[key] ?? ""}
                                            onChange={e => handleRateChange(ri, key, e.target.value)}
                                            className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md
                                                       focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                                                       text-slate-700 font-mono"
                                        />
                                    </div>
                                ))}

                                {/* Payroll Type */}
                                <div className="w-36 shrink-0">
                                    <SelectField
                                        value={row.payroll_type}
                                        options={PAYROLL_TYPES.map(v => ({ value: v, label: v.replace(/_/g, " ") }))}
                                        onChange={v => updateField(ri, { payroll_type: v })}
                                    />
                                </div>

                                {/* Salary Type */}
                                <div className="w-36 shrink-0">
                                    <SelectField
                                        value={row.salary_type}
                                        options={SALARY_TYPES.map(v => ({ value: v, label: v.replace(/_/g, " ") }))}
                                        onChange={v => updateField(ri, { salary_type: v })}
                                    />
                                </div>

                                {/* Effective Date */}
                                <div className="w-36 shrink-0">
                                    <input
                                        type="date"
                                        value={row.effective_date ?? ""}
                                        onChange={e => updateField(ri, { effective_date: e.target.value })}
                                        className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md
                                                   focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                                                   text-slate-700"
                                    />
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}