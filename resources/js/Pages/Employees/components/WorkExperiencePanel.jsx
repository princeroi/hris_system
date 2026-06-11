// resources/js/Pages/Employees/components/WorkExperiencePanel.jsx

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, PlusCircle } from "lucide-react";
import Pill from "./Pill";
import { emptyWorkExp } from "../bulkUploadUtils";

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
        exps[ei]   = { ...exps[ei], [field]: value };
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
                    <div key={ri} className="p-0">
                        {/* Row header */}
                        <button
                            type="button"
                            onClick={() => toggle(ri)}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            {isOpen
                                ? <ChevronDown  size={14} className="text-slate-400 shrink-0" />
                                : <ChevronRight size={14} className="text-slate-400 shrink-0" />
                            }
                            <span className="text-xs font-semibold text-slate-600 w-5 shrink-0">{ri + 1}</span>
                            <span className="text-xs font-medium text-slate-800 flex-1 truncate">
                                {[row.first_name, row.last_name].filter(Boolean).join(" ") || (
                                    <span className="text-slate-400 italic">Unnamed employee</span>
                                )}
                            </span>
                            <span className="text-xs text-slate-400">{row.employee_number || "—"}</span>
                            <Pill count={exps.length} color={exps.length > 0 ? "blue" : "slate"} />
                            <span className="text-xs text-slate-400 ml-1">{exps.length === 1 ? "entry" : "entries"}</span>
                        </button>

                        {/* Expanded entries */}
                        {isOpen && (
                            <div className="px-6 pb-4 space-y-3 bg-slate-50/50">
                                {exps.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic py-2">No work experience added yet.</p>
                                ) : (
                                    exps.map((exp, ei) => (
                                        <div key={ei} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-blue-700">Entry #{ei + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntry(ri, ei)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { key: "company_name",  label: "Company",    placeholder: "Acme Corporation"  },
                                                    { key: "position",      label: "Position",   placeholder: "Software Engineer" },
                                                    { key: "department",    label: "Department", placeholder: "Engineering"       },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={exp[key] ?? ""}
                                                            onChange={e => updateEntry(ri, ei, key, e.target.value)}
                                                            className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { key: "start_date",        label: "Start Date",       type: "date"   },
                                                    { key: "end_date",          label: "End Date",         type: "date"   },
                                                    { key: "years_of_service",  label: "Years of Service", type: "number", placeholder: "2.5" },
                                                ].map(({ key, label, type, placeholder }) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                                                        <input
                                                            type={type}
                                                            placeholder={placeholder}
                                                            min={type === "number" ? 0 : undefined}
                                                            step={type === "number" ? 0.01 : undefined}
                                                            value={exp[key] ?? ""}
                                                            onChange={e => updateEntry(ri, ei, key, e.target.value)}
                                                            className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Remarks</p>
                                                <input
                                                    type="text"
                                                    placeholder="Optional notes"
                                                    value={exp.remarks ?? ""}
                                                    onChange={e => updateEntry(ri, ei, "remarks", e.target.value)}
                                                    className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button
                                    type="button"
                                    onClick={() => addEntry(ri)}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 transition-colors"
                                >
                                    <PlusCircle size={13} /> Add entry
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}