import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import EmployeeProfile from "@/Components/Employees/EmployeeProfile";
import { ArrowLeft, Printer, MoreHorizontal, Pencil } from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_BADGE = {
    active:       "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    inactive:     "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    on_leave:     "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    terminated:   "bg-red-50 text-red-600 ring-1 ring-red-200",
    resigned:     "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    retired:      "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    contract_end: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
};

const STATUS_LABEL = {
    active: "Active", inactive: "Inactive", on_leave: "On Leave",
    terminated: "Terminated", resigned: "Resigned",
    retired: "Retired", contract_end: "Contract End",
};

// ─── Icon button ──────────────────────────────────────────────────────────────

function IconBtn({ title, onClick, children }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
            {children}
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Show({
    employee,
    personalInfo,
    employmentDetails,
    govIds,
    bankAccount,
    compensation,
    workExperiences,
    emergencyContacts,
    employeeEarnings = [],   
    statusLogs = [],
    reassignmentLogs = [],   
    compensationLogs = [],   
    earningLogs = [],        
    relieverDuties = [],     
}) {
    const status = employmentDetails?.status ?? "unknown";

    const statusBadge = STATUS_BADGE[status]
        ?? "bg-slate-100 text-slate-500 ring-1 ring-slate-200";

    const statusLabel = STATUS_LABEL[status] ?? status;

    const initials = [
        employee?.first_name?.[0],
        employee?.last_name?.[0],
    ].filter(Boolean).join("").toUpperCase() || "EM";

    const positionLine = [
        employmentDetails?.position?.position_name,
        employmentDetails?.department?.department_name,
    ].filter(Boolean).join(" · ");

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2.5 py-0.5">
                    <button
                        onClick={() => router.visit("/employees")}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors group"
                    >
                        <ArrowLeft
                            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
                            strokeWidth={2.5}
                        />
                        Employees
                    </button>
                    <span className="text-slate-300 text-xs select-none">/</span>
                    <span className="text-[12px] font-medium text-slate-600">Employee profile</span>
                </div>
            }
        >
            <Head title="Employee Profile" />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-7 sm:py-9">

                    {/* ── Page header ──────────────────────────────────── */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Identity block */}
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-semibold ring-1 ring-blue-200">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                                    {employee?.full_name ?? "Employee"}
                                </h1>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    {positionLine && (
                                        <span className="text-xs text-slate-500">{positionLine}</span>
                                    )}
                                    {positionLine && (
                                        <span className="text-slate-300 text-xs hidden sm:inline">·</span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                        No.{" "}
                                        <span className="font-medium text-slate-600">
                                            {employee?.employee_number ?? "—"}
                                        </span>
                                    </span>
                                    <span className="text-slate-300 text-xs hidden sm:inline">·</span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${statusBadge}`}>
                                        {statusLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <IconBtn title="Print">
                                <Printer className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </IconBtn>
                            <IconBtn title="More options">
                                <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </IconBtn>
                            <button
                                onClick={() => router.visit(`/employees/${employee?.id}/edit`)}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-700"
                            >
                                <Pencil className="h-3 w-3" strokeWidth={2} />
                                <span className="hidden sm:inline">Edit profile</span>
                                <span className="sm:hidden">Edit</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Profile ──────────────────────────────────────── */}
                    <EmployeeProfile
                        employee={employee}
                        personalInfo={personalInfo}
                        employmentDetails={employmentDetails}
                        govIds={govIds}
                        bankAccount={bankAccount}
                        compensation={compensation}
                        workExperiences={workExperiences}
                        emergencyContacts={emergencyContacts}
                        employeeEarnings={employeeEarnings}  
                        statusLogs={statusLogs}
                        reassignmentLogs={reassignmentLogs}   
                    compensationLogs={compensationLogs}   
                    earningLogs={earningLogs}             
                    relieverDuties={relieverDuties}       
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}