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
            <div className="relative h-11">
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
                    className={`block w-full h-11 px-3 text-[13px] text-slate-800 border-0 outline-none rounded-none bg-white ring-2 ring-inset transition-shadow ${
                        error ? "ring-rose-400" :
                        warn  ? "ring-amber-400" :
                                "ring-indigo-400"
                    }`}
                />
                {age !== null && (
                    <span className={`absolute right-2.5 top-1/2 -translate-y-1/2
                                      px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums pointer-events-none
                                      ${warn
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-indigo-50 text-indigo-700"
                                      }`}>
                        {age}y
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="relative h-11 group">
            <div
                onClick={() => { setDraft(value ?? ""); setEditing(true); }}
                className={`px-3 h-11 flex items-center gap-2 text-[13px] cursor-pointer transition-colors ${
                    error ? "hover:bg-rose-50/70 text-slate-700"   :
                    warn  ? "hover:bg-amber-50/60 text-slate-700" :
                    value ? "hover:bg-slate-50 text-slate-700"  :
                            "hover:bg-slate-50 text-slate-300"
                }`}
            >
                <span className="truncate">{value || "—"}</span>
                {age !== null && (
                    <span className={`ml-auto shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums
                                      ${warn
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-slate-100 text-slate-500"
                                      }`}>
                        {age}y
                    </span>
                )}
                {error && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </div>

            {warn && !error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex items-center gap-1 px-2 py-1
                                bg-amber-500 text-white text-[11px] font-medium rounded-md shadow-lg
                                whitespace-nowrap pointer-events-none">
                    Employee is under 18
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-500" />
                </div>
            )}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex items-center gap-1 px-2 py-1
                                bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg
                                whitespace-nowrap pointer-events-none">
                    {error}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}

// ── Main SmartCell ────────────────────────────────────────────────────────────
export default function SmartCell({ col, value, onChange, fkOptions, cellOptions = {}, error }) {
    if (GOV_ID_COLS.includes(col)) {
        return <GovIdCell col={col} value={value} onChange={onChange} error={error} />;
    }

    if (FK_COLS.includes(col)) {
        return <SelectCell value={value} options={fkOptions?.[col] ?? []} onChange={onChange} error={error} />;
    }

    // ← Use the passed-in cellOptions instead of the imported CELL_OPTIONS
    if (cellOptions[col]) {
        const options = cellOptions[col].map(v => ({ value: v, label: v.replace(/_/g, " ") }));
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