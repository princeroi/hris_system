// resources/js/Pages/Employees/components/EditableCell.jsx

import { useState } from "react";

/**
 * Props:
 *   value    — current value
 *   onChange — (value: string) => void
 *   type     — "text" | "date" | "number"
 *   error    — string | undefined
 */
export default function EditableCell({ value, onChange, type = "text", error }) {
    const [editing, setEditing] = useState(false);
    const [draft,   setDraft  ] = useState(value ?? "");

    const commit = (val) => { setEditing(false); onChange(val); };

    if (editing) {
        return (
            <div className="relative h-11">
                <input
                    type={type}
                    value={draft}
                    autoFocus
                    onChange={e => setDraft(e.target.value)}
                    onBlur={() => commit(draft)}
                    onKeyDown={e => {
                        if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); commit(draft); }
                        if (e.key === "Escape") { setDraft(value ?? ""); setEditing(false); }
                    }}
                    className={`block w-full h-11 px-3 text-[13px] text-slate-800 border-0 outline-none ring-2 ring-inset rounded-none bg-white transition-shadow ${
                        error ? "ring-rose-400" : "ring-indigo-400"
                    }`}
                />
            </div>
        );
    }

    return (
        <div className="relative h-11 group">
            <div
                onClick={() => { setDraft(value ?? ""); setEditing(true); }}
                className={`px-3 h-11 flex items-center text-[13px] cursor-pointer transition-colors ${
                    error
                        ? "hover:bg-rose-50/70 text-slate-800"
                        : value
                            ? "hover:bg-slate-50 text-slate-700"
                            : "hover:bg-slate-50 text-slate-300"
                }`}
                title={error || value || ""}
            >
                <span className="truncate">{value || "—"}</span>
                {error && (
                    <span className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
            </div>

            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex
                                items-center gap-1 px-2 py-1
                                bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg
                                whitespace-nowrap pointer-events-none">
                    {error}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}