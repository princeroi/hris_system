// resources/js/Pages/Employees/components/CompensationPanel.jsx

import { ChevronDown } from "lucide-react";
import { computeRates } from "@/utils/rateCompute";

const RATE_COLS = [
    { key: "monthly_rate",  label: "Monthly rate"  },
    { key: "daily_rate",    label: "Daily rate"    },
    { key: "hourly_rate",   label: "Hourly rate"   },
];

const PAYROLL_TYPES = ["monthly", "semi_monthly", "weekly", "daily", "hourly"];
const SALARY_TYPES  = ["monthly_rate", "semi_monthly_rate", "weekly_rate", "daily_rate", "hourly_rate"];

function SelectField({ value, options, onChange, placeholder = "Select" }) {
    return (
        <div className="relative">
            <select
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-[13px] border border-slate-200 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                           appearance-none bg-white text-slate-700 capitalize transition-shadow"
            >
                <option value="">{placeholder}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value} className="capitalize">{o.label}</option>
                ))}
            </select>
            <ChevronDown size={13} strokeWidth={2} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

/**
 * Responsive compensation panel — grid of cards on small screens,
 * aligned table-style rows on larger screens.
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
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="divide-y divide-slate-100">
                {rows.map((row, ri) => {
                    const factor = workTimeFactors.find(f => String(f.id) === String(row.work_time_factor_id)) ?? null;

                    return (
                        <div key={ri} className={`px-4 sm:px-6 py-4 ${ri % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>

                            {/* Row label + factor badge */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                                        {ri + 1}
                                    </span>
                                    <span className="text-[13px] font-medium text-slate-800 truncate">
                                        {[row.first_name, row.last_name].filter(Boolean).join(" ") || (
                                            <span className="text-slate-400">Unnamed employee</span>
                                        )}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">{row.employee_number || "—"}</span>
                                </div>

                                {factor ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-600 whitespace-nowrap shrink-0">
                                        {factor.working_days_per_month}d/mo · {factor.working_hours_per_day}h/d
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-600 whitespace-nowrap shrink-0">
                                        Select a work time factor
                                    </span>
                                )}
                            </div>

                            {/* Fields grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Work time factor</label>
                                    <SelectField
                                        value={row.work_time_factor_id}
                                        options={workTimeFactors.map(f => ({ value: String(f.id), label: f.factor_name }))}
                                        onChange={v => {
                                            const newFactor = workTimeFactors.find(f => String(f.id) === String(v)) ?? null;

                                            const RATE_KEYS = ["monthly_rate", "daily_rate", "hourly_rate"];
                                            const filledKey = RATE_KEYS.find(k => row[k] !== "" && row[k] !== undefined && row[k] !== null);

                                            if (newFactor && filledKey) {
                                                const computed = computeRates(filledKey, row[filledKey], newFactor);
                                                updateField(ri, { work_time_factor_id: v, [filledKey]: row[filledKey], ...computed });
                                            } else {
                                                updateField(ri, { work_time_factor_id: v });
                                            }
                                        }}
                                        placeholder="Select factor"
                                    />
                                </div>

                                {RATE_COLS.map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                                            {label} <span className="text-slate-400 font-normal">(auto)</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={row[key] ?? ""}
                                            onChange={e => handleRateChange(ri, key, e.target.value)}
                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md
                                                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                                       text-slate-700 font-mono tabular-nums transition-shadow"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Payroll type</label>
                                    <SelectField
                                        value={row.payroll_type}
                                        options={PAYROLL_TYPES.map(v => ({ value: v, label: v.replace(/_/g, " ") }))}
                                        onChange={v => updateField(ri, { payroll_type: v })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Salary type</label>
                                    <SelectField
                                        value={row.salary_type}
                                        options={SALARY_TYPES.map(v => ({ value: v, label: v.replace(/_/g, " ") }))}
                                        onChange={v => updateField(ri, { salary_type: v })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Effective date</label>
                                    <input
                                        type="date"
                                        value={row.effective_date ?? ""}
                                        onChange={e => updateField(ri, { effective_date: e.target.value })}
                                        className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md
                                                   focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                                   text-slate-700 transition-shadow"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}