export default function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#DBEAFE] bg-white px-4 py-3.5 shadow-sm shadow-blue-50/60 transition-shadow hover:shadow-md">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold leading-none tabular-nums text-gray-900">
          {value}
        </p>
        <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}