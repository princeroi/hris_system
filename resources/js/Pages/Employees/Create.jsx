import { router } from "@inertiajs/react";
import EmployeeWizard from "@/Components/Employees/EmployeeWizard";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

export default function Create({ companies, branches, departments, positions, workTimeFactors, cellOptions  }) {
    const handleSubmit = (data) => {
        router.post("/employees", data);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit("/employees")}
                        className="text-[#1E40AF] hover:text-[#1E3A8A] hover:bg-[#EFF6FF]"
                    >
                        ← Back
                    </Button>
                    <div className="w-px h-5 bg-[#BFDBFE]" />
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Add Employee
                    </h2>
                </div>
            }
        >
            <Head title="Add Employee" />

            <div className="py-5">
                <div className="mx-auto max-w-10xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <EmployeeWizard
                                onSubmit={handleSubmit}
                                companies={companies}
                                branches={branches}
                                departments={departments}
                                positions={positions}
                                workTimeFactors={workTimeFactors}
                                cellOptions={cellOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}