import { useMemo } from "react";
import { router, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, FileText, Building2, CalendarDays, User, Users, StickyNote } from "lucide-react";

const STATUS_BADGE = {
    scheduled: { variant: "info",    dot: "bg-blue-500"    },
    ongoing:   { variant: "success", dot: "bg-emerald-500" },
    completed: { variant: "outline", dot: "bg-slate-400"   },
};

const TYPE_BADGE = {
    vacant_post: "warning",
    cover_up:    "default",
};

function StatusBadge({ status }) {
    const cfg   = STATUS_BADGE[status] ?? { variant: "outline", dot: "bg-slate-400" };
    const label = status
        ? status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        : "—";
    return (
        <Badge variant={cfg.variant} className="gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {label}
        </Badge>
    );
}

function dayLabel(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
}

function Row({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-4 px-6 py-4">
            <div className="flex w-36 shrink-0 items-center gap-1.5 pt-0.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />}
                <span className="text-sm text-slate-500">{label}</span>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

export default function Show({ duty }) {
    const sortedDates = useMemo(() => [...(duty.dates ?? [])].sort(), [duty.dates]);

    function destroy() {
        if (!confirm("Delete this reliever duty? This cannot be undone.")) return;
        router.delete(route("reliever-duties.destroy", duty.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Reliever Duty #{duty.id}
                </h2>
            }
        >
            <Head title={`Reliever Duty #${duty.id}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon-sm" asChild>
                                <Link href={route("reliever-duties.index")}>
                                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                                </Link>
                            </Button>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <FileText className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Reliever Duty #{duty.id}
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Recorded {duty.created_at}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route("reliever-duties.edit", duty.id)}>
                                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={destroy}>
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Status + type badges */}
                    <div className="flex items-center gap-2">
                        <StatusBadge status={duty.status} />
                        <Badge variant={TYPE_BADGE[duty.duty_type] ?? "outline"}>
                            {duty.duty_type_label}
                        </Badge>
                        <span className="text-xs text-slate-400">
                            {sortedDates.length} day{sortedDates.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Detail card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">

                        <Row icon={User} label="Reliever">
                            <p className="text-sm font-semibold text-slate-900">{duty.reliever_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{duty.reliever_number}</p>
                        </Row>

                        {duty.duty_type === "cover_up" && (
                            <Row icon={Users} label="Covering for">
                                <p className="text-sm font-semibold text-slate-900">{duty.covered_name ?? "—"}</p>
                            </Row>
                        )}

                        <Row icon={Building2} label="Company">
                            <p className="text-sm text-slate-900">{duty.company_name ?? "—"}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{duty.branch_name}</p>
                        </Row>

                        <Row icon={Building2} label="Department">
                            <p className="text-sm text-slate-900">{duty.department_name ?? "—"}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{duty.position_name}</p>
                        </Row>

                        <Row icon={CalendarDays} label="Duty Dates">
                            {sortedDates.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {sortedDates.map(d => (
                                        <Badge key={d} variant="info" className="font-normal">
                                            {dayLabel(d)}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400 italic">No dates.</span>
                            )}
                        </Row>

                        {duty.remarks && (
                            <Row icon={StickyNote} label="Remarks">
                                <p className="text-sm text-slate-700 whitespace-pre-line">{duty.remarks}</p>
                            </Row>
                        )}

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}