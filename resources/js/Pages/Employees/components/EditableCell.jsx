// resources/js/Pages/Employees/components/EditableCell.jsx

import { useState } from "react";

/**
 * Props:
 *   value    — current value
 *   onChange — (value: string) => void
 *   type     — "text" | "date" | "number"
 *   error    — string | undefined  ← NEW
 */
export default function EditableCell({ value, onChange, type = "text", error }) {
    const [editing, setEditing] = useState(false);
    const [draft,   setDraft  ] = useState(value ?? "");

    const commit = (val) => { setEditing(false); onChange(val); };

    if (editing) {
        return (
            <div className="relative h-12">
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
                    className={`block w-full h-12 px-3 text-sm border-0 border-b-2 outline-none focus:ring-0 rounded-none ${
                        error
                            ? "bg-red-50 border-red-500"
                            : "bg-blue-50 border-blue-500"
                    }`}
                />
            </div>
        );
    }

    return (
        <div className="relative h-12 group">
            <div
                onClick={() => { setDraft(value ?? ""); setEditing(true); }}
                className={`px-3 h-12 flex items-center text-sm cursor-pointer transition-colors ${
                    error
                        ? "hover:bg-red-50/60 text-slate-800"
                        : value
                            ? "hover:bg-blue-50/80 text-slate-800"
                            : "hover:bg-blue-50/80 text-slate-400 italic"
                }`}
                title={error || value || ""}
            >
                <span className="truncate">{value || "click to edit"}</span>

                {/* Error indicator dot */}
                {error && (
                    <span className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
            </div>

            {/* Tooltip on hover */}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex
                                items-center gap-1 px-2 py-1
                                bg-red-600 text-white text-[10px] font-medium rounded shadow-lg
                                whitespace-nowrap pointer-events-none">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M4.5 1L8 8H1L4.5 1Z" fill="currentColor" />
                    </svg>
                    {error}
                    {/* Caret */}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                </div>
            )}
        </div>
    );
}