import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/Components/UI/SearchInput";
import DepartmentTable from "@/Components/Departments/DepartmentTable";
import DepartmentFormModal from "@/Components/Departments/DepartmentFormModal";

export default function Index({ departments }) {
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    const filtered = search.trim()
        ? departments.filter((d) =>
              d.department_name.toLowerCase().includes(search.toLowerCase())
          )
        : departments;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Departments
                </h2>
            }
        >
            <Head title="Departments" />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <LayoutGrid className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Departments
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Manage all departments
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                            New Department
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-sm">
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search by department name…"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <DepartmentTable departments={filtered} />
                        </div>
                    </div>
                </div>
            </div>

            <DepartmentFormModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                department={null}
            />
        </AuthenticatedLayout>
    );
}