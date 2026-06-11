import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';
import EmployeeProfile from "@/Components/Employees/EmployeeProfile";
import { ArrowLeft } from "lucide-react";

export default function Show({
    employee,
    personalInfo,
    employmentDetails,
    govIds,
    bankAccount,
    compensation,
    workExperiences,
    emergencyContacts,
}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 py-1">
                    <button
                        onClick={() => router.visit("/employees")}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150 group"
                    >
                        <ArrowLeft
                            className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5"
                            strokeWidth={2}
                        />
                        Employees
                    </button>

                    <span className="text-slate-200 select-none">/</span>

                    <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
                        Employee Profile
                    </h2>
                </div>
            }
        >
            <Head title="Employee Profile" />

            <div className="min-h-screen bg-slate-50/60">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">

                    {/* Page title row */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                            {employee?.full_name ?? "Employee"}
                        </h1>

                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
                                ${employmentDetails?.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                                }`}
                        >
                            {employmentDetails?.status ?? "Unknown"}
                        </span>
                    </div>

                    {/* Card wrapper */}
                    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/80 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <EmployeeProfile
                                employee={employee}
                                personalInfo={personalInfo}
                                employmentDetails={employmentDetails}
                                govIds={govIds}
                                bankAccount={bankAccount}
                                compensation={compensation}
                                workExperiences={workExperiences}
                                emergencyContacts={emergencyContacts}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}