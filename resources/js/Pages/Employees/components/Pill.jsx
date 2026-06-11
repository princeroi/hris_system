// resources/js/Pages/Employees/components/Pill.jsx
// Added "red" to COLOR_MAP (was already defined but keeping explicit for clarity)

const COLOR_MAP = {
    slate:   "bg-slate-100 text-slate-600",
    blue:    "bg-blue-100 text-blue-700",
    red:     "bg-red-100 text-red-600",
    emerald: "bg-emerald-100 text-emerald-700",
};

export default function Pill({ count, color = "slate" }) {
    return (
        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold ${COLOR_MAP[color]}`}>
            {count}
        </span>
    );
}