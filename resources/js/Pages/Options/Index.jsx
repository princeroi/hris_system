// resources/js/Pages/EmployeeOptions/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import SearchInput from "@/Components/UI/SearchInput";
import EmployeeOptionTable from "@/Components/Options/EmployeeOptionTable";
import CreateGroupModal from "@/Components/Options/CreateGroupModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Index({ groups }) {
    const [search, setSearch] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    const filtered = search.trim()
        ? groups.filter(
              (g) =>
                  g.group.toLowerCase().includes(search.toLowerCase()) ||
                  g.options.some((o) =>
                      o.value.toLowerCase().includes(search.toLowerCase())
                  )
          )
        : groups;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Employee Options
                </h2>
            }
        >
            <Head title="Employee Options" />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    {/* Page heading */}
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Settings2
                                    className="h-5 w-5 text-[#3B5BA5]"
                                    strokeWidth={1.75}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    Employee Options
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Manage option groups and their values
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setShowCreateGroup(true)}
                            className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                            New Group
                        </Button>
                    </div>

                    {/* Main card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Toolbar */}
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-sm">
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    placeholder="Search groups or option values…"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <EmployeeOptionTable groups={filtered} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Group Modal */}
            <CreateGroupModal
                open={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
            />
        </AuthenticatedLayout>
    );
}