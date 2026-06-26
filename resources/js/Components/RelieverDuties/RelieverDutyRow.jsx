import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Eye, Pencil, Trash2, MoreHorizontal,
    Building2, CalendarDays,
} from "lucide-react";
import { Link } from "@inertiajs/react";

// ── Badge config ───────────────────────────────────────────────────────────

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

function TypeBadge({ dutyType, label }) {
    return <Badge variant={TYPE_BADGE[dutyType] ?? "outline"}>{label}</Badge>;
}

function shortDate(dateStr) {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ── Row ────────────────────────────────────────────────────────────────────

export default function RelieverDutyRow({ duty, onDelete }) {
    const dateCount = (duty.dates ?? []).length;
    const sameDay   = duty.start_date === duty.end_date;

    return (
        <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">

            {/* ID */}
            <TableCell className="py-3.5 pl-5">
                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                    #{duty.id}
                </span>
            </TableCell>

            {/* Reliever */}
            <TableCell className="py-3.5">
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {duty.reliever_name ?? "—"}
                </p>
                <p className="text-xs text-slate-400">{duty.reliever_number ?? ""}</p>
            </TableCell>

            {/* Type + covered */}
            <TableCell className="py-3.5">
                <TypeBadge dutyType={duty.duty_type} label={duty.duty_type_label} />
                {duty.duty_type === "cover_up" && duty.covered_name && (
                    <p className="mt-1 text-xs text-slate-400">
                        Covering:{" "}
                        <span className="text-slate-600">{duty.covered_name}</span>
                    </p>
                )}
            </TableCell>

            {/* Assignment */}
            <TableCell className="py-3.5">
                <div className="flex items-start gap-1.5">
                    <Building2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                        strokeWidth={1.75}
                    />
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            {duty.company_name ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                            {[duty.branch_name, duty.department_name, duty.position_name]
                                .filter(Boolean).join(" · ") || "—"}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* Dates */}
            <TableCell className="py-3.5">
                <div className="flex items-start gap-1.5">
                    <CalendarDays
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                        strokeWidth={1.75}
                    />
                    <div>
                        <p className="text-sm text-slate-700">{shortDate(duty.start_date)}</p>
                        {!sameDay && (
                            <p className="text-xs text-slate-400">
                                – {shortDate(duty.end_date)}
                            </p>
                        )}
                        <p className="text-xs text-slate-400">
                            {dateCount} day{dateCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* Status */}
            <TableCell className="py-3.5">
                <StatusBadge status={duty.status} />
            </TableCell>

            {/* Actions */}
            <TableCell className="py-3.5 pr-5 text-right">
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">

                    {/* View */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                        title="View"
                        asChild
                    >
                        <Link href={route("reliever-duties.show", duty.id)}>
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Button>

                    {/* Edit */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                        asChild
                    >
                        <Link href={route("reliever-duties.edit", duty.id)}>
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Button>

                    {/* More */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/40"
                            >
                                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                                <Link href={route("reliever-duties.show", duty.id)}>
                                    <Eye className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                    View details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route("reliever-duties.edit", duty.id)}>
                                    <Pencil className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                    Edit duty
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(duty.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                Delete duty
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </TableCell>

        </TableRow>
    );
}