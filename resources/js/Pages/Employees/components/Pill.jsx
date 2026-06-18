// resources/js/Pages/Employees/components/Pill.jsx

const COLOR_MAP = {
    slate:   "bg-slate-100 text-slate-600",
    blue:    "bg-indigo-50 text-indigo-700",
    red:     "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-700",
};

export default function Pill({ count, color = "slate" }) {
    return (
        <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-semibold tabular-nums ${COLOR_MAP[color]}`}>
            {count}
        </span>
    );
}