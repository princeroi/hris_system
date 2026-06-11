// resources/js/Pages/Employees/components/SelectCell.jsx

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

/**
 * Props:
 *   value    — current value (string)
 *   options  — [{ value, label }]
 *   onChange — (value: string) => void
 *   error    — string | undefined  ← NEW
 */
export default function SelectCell({ value, options, onChange, error }) {
    const [open, setOpen]       = useState(false);
    const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef            = useRef(null);
    const dropRef               = useRef(null);

    const choose = (opt) => { onChange(opt.value); setOpen(false); };

    const handleToggle = () => {
        if (!open && triggerRef.current) {
            const rect       = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropHeight = Math.min(224, options.length * 34 + 44);
            const top        = spaceBelow < dropHeight
                ? rect.top + window.scrollY - dropHeight - 4
                : rect.bottom + window.scrollY + 2;
            setDropPos({ top, left: rect.left + window.scrollX, width: Math.max(rect.width, 180) });
        }
        setOpen(o => !o);
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!triggerRef.current?.contains(e.target) && !dropRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const display = options.find(o => String(o.value) === String(value))?.label ?? value;

    return (
        <div ref={triggerRef} className="relative h-12 group">
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full h-12 px-3 flex items-center justify-between text-sm cursor-pointer transition-colors gap-1 ${
                    error
                        ? "hover:bg-red-50/60"
                        : "hover:bg-blue-50/80"
                } ${value ? "text-slate-800" : "text-slate-400 italic"}`}
            >
                <span className="truncate">{display || "Select…"}</span>
                <div className="flex items-center gap-1 shrink-0">
                    {error && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    <ChevronDown
                        size={12}
                        className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {/* Error tooltip */}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex
                                items-center gap-1 px-2 py-1
                                bg-red-600 text-white text-[10px] font-medium rounded shadow-lg
                                whitespace-nowrap pointer-events-none">
                    {error}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                </div>
            )}

            {open && createPortal(
                <div
                    ref={dropRef}
                    style={{ position: "absolute", top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
                    className="bg-white border border-slate-200 rounded-lg shadow-xl py-1 max-h-56 overflow-y-auto"
                >
                    <button
                        type="button"
                        onClick={() => choose({ value: "", label: "" })}
                        className="w-full text-left px-3 py-2 text-xs text-slate-400 italic hover:bg-slate-50"
                    >
                        — clear —
                    </button>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => choose(opt)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                                String(opt.value) === String(value)
                                    ? "bg-blue-50 text-blue-700 font-semibold"
                                    : "text-slate-700"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}