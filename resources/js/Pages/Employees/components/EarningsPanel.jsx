// resources/js/Pages/Employees/components/EarningsPanel.jsx

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import Pill from "./Pill";
import { emptyEarning } from "../bulkUploadUtils";

const FREQUENCIES = [
    { value: "one-time",     label: "One-time"     },
    { value: "daily",        label: "Daily"        },
    { value: "weekly",       label: "Weekly"       },
    { value: "bi-weekly",    label: "Bi-weekly"    },
    { value: "semi-monthly", label: "Semi-monthly" },
    { value: "monthly",      label: "Monthly"      },
];

function SelectInput({ value, options, onChange, placeholder = "Select", className = "" }) {
    return (
        <div className="relative">
            <select
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                className={[
                    "w-full h-9 pl-3 pr-8 text-[13px] border border-slate-200 rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent",
                    "appearance-none bg-white text-slate-700 transition-shadow",
                    className,
                ].join(" ")}
            >
                <option value="">{placeholder}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <ChevronDown
                size={13}
                strokeWidth={2}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
        </div>
    );
}

/**
 * Accordion panel for editing earnings entries per employee row.
 * Props:
 *   rows     — full rows array (each row has an `employee_earnings` array)
 *   onUpdate — (nextRows) => void
 *   earnings — [{ id, name, default_amount }] — available earning types
 */
export default function EarningsPanel({ rows, onUpdate, earnings = [] }) {
    const [expanded, setExpanded] = useState({});

    const toggle = (ri) => setExpanded(prev => ({ ...prev, [ri]: !prev[ri] }));

    const updateEarning = (ri, ei, field, value) => {
        const next     = [...rows];
        const earns    = [...(next[ri].employee_earnings || [])];
        let updated    = { ...earns[ei], [field]: value };

        // Auto-fill default_amount when earning type is selected
        if (field === "earning_id") {
            const found = earnings.find(e => String(e.id) === String(value));
            if (found && !earns[ei].amount) {
                updated.amount = found.default_amount ?? "";
            }
        }

        // Clear end_date when switching to continuous
        if (field === "is_continuous" && value === true) {
            updated.end_date = "";
        }

        earns[ei]  = updated;
        next[ri]   = { ...next[ri], employee_earnings: earns };
        onUpdate(next);
    };

    const addEarning = (ri) => {
        const hiredDate = rows[ri]?.hired_date ?? "";
        const next = [...rows];
        next[ri]   = {
            ...next[ri],
            employee_earnings: [...(next[ri].employee_earnings || []), emptyEarning(hiredDate)],
        };
        onUpdate(next);
        setExpanded(prev => ({ ...prev, [ri]: true }));
    };

    const removeEarning = (ri, ei) => {
        const next  = [...rows];
        const earns = (next[ri].employee_earnings || []).filter((_, i) => i !== ei);
        next[ri]    = { ...next[ri], employee_earnings: earns };
        onUpdate(next);
    };

    return (
        <div className="divide-y divide-slate-100">
            {rows.map((row, ri) => {
                const earns  = row.employee_earnings || [];
                const isOpen = expanded[ri];

                // Earning IDs already used in this row (for de-duplication)
                const usedIds = earns.map(e => String(e.earning_id)).filter(Boolean);

                return (
                    <div key={ri}>
                        {/* Row header */}
                        <button
                            type="button"
                            onClick={() => toggle(ri)}
                            className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            {isOpen
                                ? <ChevronDown  size={15} strokeWidth={2} className="text-slate-400 shrink-0" />
                                : <ChevronRight size={15} strokeWidth={2} className="text-slate-400 shrink-0" />
                            }
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 shrink-0">
                                {ri + 1}
                            </span>
                            <span className="text-[13px] font-medium text-slate-800 flex-1 truncate min-w-0">
                                {[row.first_name, row.last_name].filter(Boolean).join(" ") || (
                                    <span className="text-slate-400">Unnamed employee</span>
                                )}
                            </span>
                            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                                {row.employee_number || "—"}
                            </span>
                            <Pill count={earns.length} color={earns.length > 0 ? "blue" : "slate"} />
                            <span className="text-xs text-slate-400 hidden md:inline">
                                {earns.length === 1 ? "earning" : "earnings"}
                            </span>
                        </button>

                        {/* Expanded earning entries */}
                        {isOpen && (
                            <div className="px-4 sm:px-6 pb-4 space-y-3 bg-slate-50/60">
                                {earns.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-2">No earnings added yet.</p>
                                ) : (
                                    earns.map((earn, ei) => {
                                        const selectedEarning = earnings.find(
                                            e => String(e.id) === String(earn.earning_id)
                                        );

                                        return (
                                            <div key={ei} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
                                                {/* Entry header */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                                                        Earning {ei + 1}
                                                        {selectedEarning && (
                                                            <span className="ml-1.5 font-normal normal-case text-slate-400">
                                                                — {selectedEarning.name}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEarning(ri, ei)}
                                                        className="text-slate-300 hover:text-rose-500 transition-colors p-1 -m-1"
                                                        aria-label="Remove earning"
                                                    >
                                                        <Trash2 size={14} strokeWidth={2} />
                                                    </button>
                                                </div>

                                                {/* Row 1: Earning type + Amount + Frequency */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                                                            Earning type <span className="text-rose-400 font-bold">*</span>
                                                        </label>
                                                        <SelectInput
                                                            value={String(earn.earning_id)}
                                                            options={earnings
                                                                .filter(e =>
                                                                    String(e.id) === String(earn.earning_id) ||
                                                                    !usedIds.includes(String(e.id))
                                                                )
                                                                .map(e => ({ value: String(e.id), label: e.name }))
                                                            }
                                                            onChange={v => updateEarning(ri, ei, "earning_id", v)}
                                                            placeholder="Select type…"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                                                            Amount <span className="text-rose-400 font-bold">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">₱</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={earn.amount ?? ""}
                                                                onChange={e => updateEarning(ri, ei, "amount", e.target.value)}
                                                                className="w-full h-9 pl-7 pr-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow font-mono tabular-nums"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Frequency</label>
                                                        <SelectInput
                                                            value={earn.frequency}
                                                            options={FREQUENCIES}
                                                            onChange={v => updateEarning(ri, ei, "frequency", v)}
                                                            placeholder="Select…"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Row 2: Effective date + Continuous toggle + End date */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Effective date</label>
                                                        <input
                                                            type="date"
                                                            value={earn.effective_date ?? ""}
                                                            onChange={e => updateEarning(ri, ei, "effective_date", e.target.value)}
                                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">End date</label>
                                                        <input
                                                            type="date"
                                                            value={earn.end_date ?? ""}
                                                            disabled={earn.is_continuous}
                                                            onChange={e => updateEarning(ri, ei, "end_date", e.target.value)}
                                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                                                        />
                                                    </div>

                                                    {/* Continuous toggle */}
                                                    <div className="flex items-center gap-2 h-9">
                                                        <button
                                                            type="button"
                                                            role="switch"
                                                            aria-checked={earn.is_continuous}
                                                            onClick={() => updateEarning(ri, ei, "is_continuous", !earn.is_continuous)}
                                                            className={[
                                                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                                                                earn.is_continuous ? "bg-indigo-500" : "bg-slate-200",
                                                            ].join(" ")}
                                                        >
                                                            <span
                                                                className={[
                                                                    "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                                                    earn.is_continuous ? "translate-x-4" : "translate-x-0",
                                                                ].join(" ")}
                                                            />
                                                        </button>
                                                        <span className="text-[12px] text-slate-600 select-none">
                                                            {earn.is_continuous ? "Continuous" : "Fixed period"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                <button
                                    type="button"
                                    onClick={() => addEarning(ri)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <Plus size={14} strokeWidth={2} /> Add earning
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}