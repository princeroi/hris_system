// resources/js/Pages/Employees/components/WorkExperiencePanel.jsx

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import Pill from "./Pill";
import { emptyWorkExp, autoComputeYears } from "../bulkUploadUtils";

/**
 * Accordion panel for editing work-experience entries per employee row.
 * Props:
 *   rows     — full rows array (each row has a `work_experiences` array)
 *   onUpdate — (nextRows) => void
 */
export default function WorkExperiencePanel({ rows, onUpdate }) {
    const [expanded, setExpanded] = useState({});

    const toggle = (ri) => setExpanded(prev => ({ ...prev, [ri]: !prev[ri] }));

    const updateEntry = (ri, ei, field, value) => {
        const next = [...rows];
        const exps = [...(next[ri].work_experiences || [])];

        let updated = { ...exps[ei], [field]: value };

        if (field === "start_date" || field === "end_date") {
            updated = autoComputeYears(updated);
        }

        exps[ei]   = updated;
        next[ri]   = { ...next[ri], work_experiences: exps };
        onUpdate(next);
    };

    const addEntry = (ri) => {
        const next = [...rows];
        next[ri]   = { ...next[ri], work_experiences: [...(next[ri].work_experiences || []), emptyWorkExp()] };
        onUpdate(next);
        setExpanded(prev => ({ ...prev, [ri]: true }));
    };

    const removeEntry = (ri, ei) => {
        const next = [...rows];
        const exps = (next[ri].work_experiences || []).filter((_, i) => i !== ei);
        next[ri]   = { ...next[ri], work_experiences: exps };
        onUpdate(next);
    };

    return (
        <div className="divide-y divide-slate-100">
            {rows.map((row, ri) => {
                const exps   = row.work_experiences || [];
                const isOpen = expanded[ri];

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
                            <span className="text-xs text-slate-400 font-mono hidden sm:inline">{row.employee_number || "—"}</span>
                            <Pill count={exps.length} color={exps.length > 0 ? "blue" : "slate"} />
                            <span className="text-xs text-slate-400 hidden md:inline">{exps.length === 1 ? "entry" : "entries"}</span>
                        </button>

                        {/* Expanded entries */}
                        {isOpen && (
                            <div className="px-4 sm:px-6 pb-4 space-y-3 bg-slate-50/60">
                                {exps.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-2">No work experience added yet.</p>
                                ) : (
                                    exps.map((exp, ei) => (
                                        <div key={ei} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px} font-semibold uppercase tracking-wide text-indigo-600">Entry {ei + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntry(ri, ei)}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors p-1 -m-1"
                                                    aria-label="Remove entry"
                                                >
                                                    <Trash2 size={14} strokeWidth={2} />
                                                </button>
                                            </div>

                                            {/* Company / Position / Department */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {[
                                                    { key: "company_name",  label: "Company",    placeholder: "Acme Corporation"  },
                                                    { key: "position",      label: "Position",   placeholder: "Software Engineer" },
                                                    { key: "department",    label: "Department", placeholder: "Engineering"       },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">{label}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={exp[key] ?? ""}
                                                            onChange={e => updateEntry(ri, ei, key, e.target.value)}
                                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Dates + auto-computed years */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Start date</label>
                                                    <input
                                                        type="date"
                                                        value={exp.start_date ?? ""}
                                                        onChange={e => updateEntry(ri, ei, "start_date", e.target.value)}
                                                        className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">End date</label>
                                                    <input
                                                        type="date"
                                                        value={exp.end_date ?? ""}
                                                        onChange={e => updateEntry(ri, ei, "end_date", e.target.value)}
                                                        className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                                                        Years of service <span className="text-slate-400 font-normal">(auto)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        readOnly
                                                        tabIndex={-1}
                                                        value={exp.years_of_service ?? ""}
                                                        placeholder="—"
                                                        className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            {/* Remarks */}
                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Remarks</label>
                                                <input
                                                    type="text"
                                                    placeholder="Optional notes"
                                                    value={exp.remarks ?? ""}
                                                    onChange={e => updateEntry(ri, ei, "remarks", e.target.value)}
                                                    className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button
                                    type="button"
                                    onClick={() => addEntry(ri)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <Plus size={14} strokeWidth={2} /> Add entry
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}