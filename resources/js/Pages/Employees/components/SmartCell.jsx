// resources/js/Pages/Employees/components/SmartCell.jsx

import { useState, useEffect } from "react";
import { CELL_OPTIONS, FK_COLS, DATE_KEYS, NUM_KEYS } from "../bulkUploadConfig";
import SelectCell   from "./SelectCell";
import EditableCell from "./EditableCell";
import GovIdCell    from "./GovIdCell";

const GOV_ID_COLS = ["sss_number", "pagibig_number", "philhealth_number", "tin_number"];

// ── Birth Date Cell ───────────────────────────────────────────────────────────
function BirthDateCell({ value, onChange, error }) {
    const [editing, setEditing] = useState(false);
    const [draft,   setDraft  ] = useState(value ?? "");

    useEffect(() => {
        if (!editing) setDraft(value ?? "");
    }, [value, editing]);

    const computeAge = (dateStr) => {
        if (!dateStr) return null;
        const birth = new Date(dateStr);
        if (isNaN(birth)) return null;
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setDraft(val);
        onChange(val);
    };

    const commit = () => { setEditing(false); onChange(draft); };

    const age  = computeAge(draft || value);
    const warn = age !== null && age < 18;

    if (editing) {
        return (
            <div className="relative h-12">
                <input
                    type="date"
                    value={draft}
                    autoFocus
                    onChange={handleChange}
                    onBlur={commit}
                    onKeyDown={e => {
                        if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); commit(); }
                        if (e.key === "Escape") { setDraft(value ?? ""); setEditing(false); }
                    }}
                    className={`block w-full h-12 px-3 text-sm border-0 border-b-2 outline-none focus:ring-0 rounded-none ${
                        error ? "bg-red-50 border-red-500"     :
                        warn  ? "bg-amber-50 border-amber-400" :
                                "bg-blue-50 border-blue-500"
                    }`}
                />
                {age !== null && (
                    <span className={`absolute right-2 top-1/2 -translate-y-1/2
                                      px-1.5 py-px rounded-full text-[9px] font-bold pointer-events-none
                                      ${warn
                                          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                                          : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                                      }`}>
                        {age}y {warn ? "⚠" : ""}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="relative h-12 group">
            <div
                onClick={() => { setDraft(value ?? ""); setEditing(true); }}
                className={`px-3 h-12 flex items-center text-sm cursor-pointer transition-colors ${
                    error ? "hover:bg-red-50/60 text-slate-800"   :
                    warn  ? "hover:bg-amber-50/60 text-slate-800" :
                    value ? "hover:bg-blue-50/80 text-slate-800"  :
                            "hover:bg-blue-50/80 text-slate-400 italic"
                }`}
            >
                <span className="truncate">{value || "click to edit"}</span>
                {age !== null && (
                    <span className={`ml-auto shrink-0 px-1.5 py-px rounded-full text-[9px] font-bold
                                      ${warn
                                          ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                                          : "bg-slate-100 text-slate-500"
                                      }`}>
                        {age}y {warn ? "⚠" : ""}
                    </span>
                )}
                {error && <span className="ml-1 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />}
            </div>

            {warn && !error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex items-center gap-1 px-2 py-1
                                bg-amber-500 text-white text-[10px] font-medium rounded shadow-lg
                                whitespace-nowrap pointer-events-none">
                    Employee is under 18 years old
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-500" />
                </div>
            )}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex items-center gap-1 px-2 py-1
                                bg-red-600 text-white text-[10px] font-medium rounded shadow-lg
                                whitespace-nowrap pointer-events-none">
                    {error}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                </div>
            )}
        </div>
    );
}

// ── Main SmartCell ────────────────────────────────────────────────────────────
export default function SmartCell({ col, value, onChange, fkOptions, error }) {
    if (GOV_ID_COLS.includes(col)) {
        return <GovIdCell col={col} value={value} onChange={onChange} error={error} />;
    }

    if (FK_COLS.includes(col)) {
        return <SelectCell value={value} options={fkOptions?.[col] ?? []} onChange={onChange} error={error} />;
    }

    if (CELL_OPTIONS[col]) {
        const options = CELL_OPTIONS[col].map(v => ({ value: v, label: v.replace(/_/g, " ") }));
        return <SelectCell value={value} options={options} onChange={onChange} error={error} />;
    }

    if (col === "birth_date") {
        return <BirthDateCell value={value} onChange={onChange} error={error} />;
    }

    if (col === "age") {
        return <EditableCell value={value} onChange={onChange} type="number" error={error} />;
    }

    if (DATE_KEYS.includes(col)) return <EditableCell value={value} onChange={onChange} type="date"   error={error} />;
    if (NUM_KEYS.includes(col))  return <EditableCell value={value} onChange={onChange} type="number" error={error} />;

    return <EditableCell value={value} onChange={onChange} error={error} />;
}