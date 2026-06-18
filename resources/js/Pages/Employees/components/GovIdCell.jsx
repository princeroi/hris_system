// resources/js/Pages/Employees/components/GovIdCell.jsx

import { useRef, useState, useEffect } from "react";

const FORMATS = {
    sss_number:        { groups: [2, 7, 1],    maxDigits: 10 },
    pagibig_number:    { groups: [4, 4, 4],    maxDigits: 12 },
    philhealth_number: { groups: [2, 9, 1],    maxDigits: 12 },
    tin_number:        { groups: [3, 3, 3, 3], maxDigits: 12, minDigits: 9 },
};

const PLACEHOLDERS = {
    sss_number:        "XX-XXXXXXX-X",
    pagibig_number:    "XXXX-XXXX-XXXX",
    philhealth_number: "XX-XXXXXXXXX-X",
    tin_number:        "XXX-XXX-XXX",
};

// For TIN: use 3 groups when digits ≤ 9, 4 groups when > 9
function activeGroups(digits, fmt, col) {
    if (col === "tin_number" && digits.length <= 9)
        return fmt.groups.slice(0, 3);
    return fmt.groups;
}

function activeTotalSlots(digits, fmt, col) {
    return activeGroups(digits, fmt, col).reduce((a, b) => a + b, 0);
}

function applyMask(digits, fmt, col) {
    const groups = activeGroups(digits, fmt, col);
    const total  = groups.reduce((a, b) => a + b, 0);
    const padded = digits.padEnd(total, "_");
    let result   = "", pos = 0;
    groups.forEach((len, gi) => {
        if (gi > 0) result += "-";
        result += padded.slice(pos, pos + len);
        pos += len;
    });
    return result;
}

function formatClean(digits, fmt, col) {
    if (!digits) return "";
    const groups = activeGroups(digits, fmt, col);
    let result   = "", pos = 0;
    groups.forEach((len, gi) => {
        if (pos >= digits.length) return;
        if (gi > 0) result += "-";
        result += digits.slice(pos, pos + len);
        pos += len;
    });
    return result;
}

// Translate cursor position in masked string → digit index
function maskedPosToDigitIndex(maskedPos, digits, fmt, col) {
    const masked = applyMask(digits, fmt, col);
    let digitIdx = 0;
    for (let i = 0; i < maskedPos && i < masked.length; i++) {
        if (masked[i] !== "-") digitIdx++;
    }
    return digitIdx;
}

// Translate digit index → cursor position in masked string
function digitIndexToMaskedPos(digitIdx, digits, fmt, col) {
    const masked = applyMask(digits, fmt, col);
    let counted  = 0;
    for (let i = 0; i < masked.length; i++) {
        if (masked[i] !== "-") {
            if (counted === digitIdx) return i;
            counted++;
        }
    }
    return masked.length;
}

const digitsOnly = (v) => String(v ?? "").replace(/\D/g, "");

export default function GovIdCell({ col, value, onChange, error }) {
    const fmt      = FORMATS[col];
    const inputRef = useRef(null);

    const [digits,  setDigits]  = useState(() => digitsOnly(value ?? ""));
    const [focused, setFocused] = useState(false);

    const cursorDigitRef = useRef(0);

    useEffect(() => {
        const incoming = digitsOnly(value ?? "");
        setDigits(prev => prev !== incoming ? incoming : prev);
    }, [value]);

    // Restore cursor after every render while focused
    useEffect(() => {
        if (!focused || !inputRef.current) return;
        const maskedPos = digitIndexToMaskedPos(cursorDigitRef.current, digits, fmt, col);
        inputRef.current.setSelectionRange(maskedPos, maskedPos);
    });

    const commit = (newDigits, newCursorDigitIdx) => {
        cursorDigitRef.current = newCursorDigitIdx;
        setDigits(newDigits);
        onChange(newDigits ? formatClean(newDigits, fmt, col) : "");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") { e.preventDefault(); inputRef.current?.blur(); return; }
        if (e.key === "Tab") return;

        e.preventDefault();

        const input    = inputRef.current;
        const selStart = input.selectionStart;
        const selEnd   = input.selectionEnd;
        const total    = activeTotalSlots(digits, fmt, col);
        const hasSelection = selStart !== selEnd;

        const cursorDigitIdx = maskedPosToDigitIndex(selStart, digits, fmt, col);

        if (/^\d$/.test(e.key)) {
            if (hasSelection) {
                const fromDigit = maskedPosToDigitIndex(selStart, digits, fmt, col);
                const toDigit   = maskedPosToDigitIndex(selEnd,   digits, fmt, col);
                const arr = digits.padEnd(total, "_").split("");
                for (let i = fromDigit; i < toDigit; i++) arr[i] = "_";
                arr.splice(fromDigit, 0, e.key);
                arr.splice(fmt.maxDigits);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, fromDigit + 1);
            } else {
                const filledCount = digits.replace(/_/g, "").length;
                if (filledCount >= fmt.maxDigits) return;
                const arr = digits.padEnd(total, "_").split("");
                arr.splice(cursorDigitIdx, 0, e.key);
                arr.splice(fmt.maxDigits);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, cursorDigitIdx + 1);
            }

        } else if (e.key === "Backspace") {
            if (hasSelection) {
                const fromDigit = maskedPosToDigitIndex(selStart, digits, fmt, col);
                const toDigit   = maskedPosToDigitIndex(selEnd,   digits, fmt, col);
                const arr = digits.padEnd(total, "_").split("");
                arr.splice(fromDigit, toDigit - fromDigit);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, fromDigit);
            } else if (cursorDigitIdx > 0) {
                const arr = digits.padEnd(total, "_").split("");
                arr.splice(cursorDigitIdx - 1, 1);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, cursorDigitIdx - 1);
            }

        } else if (e.key === "Delete") {
            if (hasSelection) {
                const fromDigit = maskedPosToDigitIndex(selStart, digits, fmt, col);
                const toDigit   = maskedPosToDigitIndex(selEnd,   digits, fmt, col);
                const arr = digits.padEnd(total, "_").split("");
                arr.splice(fromDigit, toDigit - fromDigit);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, fromDigit);
            } else if (cursorDigitIdx < digits.length) {
                const arr = digits.padEnd(total, "_").split("");
                arr.splice(cursorDigitIdx, 1);
                const newDigits = arr.join("").replace(/_+$/, "");
                commit(newDigits, cursorDigitIdx);
            }

        } else if (e.key === "ArrowLeft") {
            const next = Math.max(0, cursorDigitRef.current - 1);
            cursorDigitRef.current = next;
            const maskedPos = digitIndexToMaskedPos(next, digits, fmt, col);
            input.setSelectionRange(maskedPos, maskedPos);

        } else if (e.key === "ArrowRight") {
            const next = Math.min(activeTotalSlots(digits, fmt, col), cursorDigitRef.current + 1);
            cursorDigitRef.current = next;
            const maskedPos = digitIndexToMaskedPos(next, digits, fmt, col);
            input.setSelectionRange(maskedPos, maskedPos);

        } else if (e.key === "Home") {
            cursorDigitRef.current = 0;
            input.setSelectionRange(0, 0);

        } else if (e.key === "End") {
            cursorDigitRef.current = digits.length;
            const maskedPos = digitIndexToMaskedPos(digits.length, digits, fmt, col);
            input.setSelectionRange(maskedPos, maskedPos);
        }
    };

    const handleClick = () => {
        if (!inputRef.current) return;
        const pos      = inputRef.current.selectionStart;
        const digitIdx = maskedPosToDigitIndex(pos, digits, fmt, col);
        cursorDigitRef.current = digitIdx;
        const maskedPos = digitIndexToMaskedPos(digitIdx, digits, fmt, col);
        inputRef.current.setSelectionRange(maskedPos, maskedPos);
    };

    const displayValue = focused
        ? applyMask(digits, fmt, col)
        : (digits.length ? formatClean(digits, fmt, col) : "");

    return (
        <div className="relative h-11 group">
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={displayValue}
                placeholder={focused ? "" : PLACEHOLDERS[col]}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onChange={() => {}}
                onFocus={() => {
                    setFocused(true);
                    requestAnimationFrame(() => {
                        if (!inputRef.current) return;
                        const maskedPos = digitIndexToMaskedPos(digits.length, digits, fmt, col);
                        inputRef.current.setSelectionRange(maskedPos, maskedPos);
                        cursorDigitRef.current = digits.length;
                    });
                }}
                onBlur={() => setFocused(false)}
                className={`block w-full h-11 px-3 text-[13px] font-mono outline-none rounded-none tracking-wide bg-white select-none transition-shadow
                            ${error
                                ? "ring-2 ring-inset ring-rose-300 focus:ring-rose-400 text-slate-800"
                                : "ring-0 focus:ring-2 focus:ring-inset focus:ring-indigo-400 text-slate-700"
                            }`}
            />
            {error && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2
                                 w-1.5 h-1.5 rounded-full bg-rose-500 pointer-events-none" />
            )}
            {error && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
                                hidden group-hover:flex items-center gap-1 px-2 py-1
                                bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg
                                whitespace-nowrap pointer-events-none">
                    {error}
                    <span className="absolute top-full left-1/2 -translate-x-1/2
                                     border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}