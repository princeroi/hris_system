// EmployeeRow.jsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  ArrowLeftRight,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { getFullName } from "@/utils/employeeUtils";
import { toUpperCase } from "@/utils/textUtils";
import { formatContactNumber } from "@/utils/contactFormat";
import Avatar from "@/Components/ui/Avatar";

const STATUS_STYLES = {
  active:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive:     "bg-slate-100 text-slate-500 ring-slate-200",
  on_leave:     "bg-amber-50 text-amber-700 ring-amber-200",
  terminated:   "bg-red-50 text-red-700 ring-red-200",
  resigned:     "bg-rose-50 text-rose-700 ring-rose-200",
  retired:      "bg-violet-50 text-violet-700 ring-violet-200",
  contract_end: "bg-orange-50 text-orange-700 ring-orange-200",
};

const STATUS_DOT = {
  active:       "bg-emerald-500",
  inactive:     "bg-slate-400",
  on_leave:     "bg-amber-500",
  terminated:   "bg-red-500",
  resigned:     "bg-rose-500",
  retired:      "bg-violet-500",
  contract_end: "bg-orange-500",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-500 ring-slate-200";
  const dot   = STATUS_DOT[status]   ?? "bg-slate-400";

  const label = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "No Record";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
}

export default function EmployeeRow({
  employee,
  onShow,
  onDelete,
  onChangeStatus,
  onRehire,
  onReassign,
}) {
  const employmentDetails = employee.employment_details ?? {};
  const personalInfo      = employee.personal_info      ?? {};
  const status            = employmentDetails.status    ?? null;
  const isActive          = status === "active";
  const fullName          = toUpperCase(getFullName(employee));

  return (
    <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">

      {/* Employee No */}
      <TableCell className="py-3.5 pl-5">
        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
          {employee.employee_number}
        </span>
      </TableCell>

      {/* Name + Position */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{fullName}</p>
            <p className="truncate text-xs text-slate-500">
              {employmentDetails.position_name || "—"}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Company / Branch */}
      <TableCell className="py-3.5">
        <p className="text-sm text-slate-700">{employmentDetails.company_name || "—"}</p>
        <p className="text-xs text-slate-400">{employmentDetails.branch_name  || "—"}</p>
      </TableCell>

      {/* Department */}
      <TableCell className="py-3.5 text-sm text-slate-700">
        {employmentDetails.department_name || "—"}
      </TableCell>

      {/* Contact */}
      <TableCell className="py-3.5">
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          {personalInfo.email ? (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
              <span className="truncate max-w-[180px]">{personalInfo.email}</span>
            </span>
          ) : (
            <span>—</span>
          )}
          {personalInfo.phone_number && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />
              {formatContactNumber(personalInfo.phone_number)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Hired Date */}
      <TableCell className="py-3.5 text-sm text-slate-600">
        {formatDate(employmentDetails.hired_date)}
      </TableCell>

      {/* Status */}
      <TableCell className="py-3.5">
        <StatusBadge status={status} />
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3.5 pr-5 text-right">
        <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">

          {/* View */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
            onClick={() => onShow(employee.id)}
            title="View"
          >
            <Eye className="h-4 w-4" strokeWidth={1.75} />
          </Button>

          {/* Edit */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => (window.location.href = `/employees/${employee.id}/edit`)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </Button>

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/40"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 min-w-48">

              {/* Reassign — only for active employees */}
              {isActive && onReassign && (
                <DropdownMenuItem onClick={() => onReassign(employee)}>
                  <Shuffle className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Reassign
                </DropdownMenuItem>
              )}

              {/* Change Status — only for active */}
              {isActive && onChangeStatus && (
                <DropdownMenuItem onClick={() => onChangeStatus(employee)}>
                  <ArrowLeftRight className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Change Status
                </DropdownMenuItem>
              )}

              {/* Rehire — only for inactive/archived */}
              {!isActive && onRehire && (
                <DropdownMenuItem onClick={() => onRehire(employee)}>
                  <RotateCcw className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Rehire
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Delete */}
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(employee.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.75} />
                Delete employee
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </TableCell>

    </TableRow>
  );
}