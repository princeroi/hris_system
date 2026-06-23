// resources/js/Pages/EmployeeOptions/Show.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Settings2, ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import AddOptionModal from "@/Components/EmployeeOptions/AddOptionModal";
import EditOptionModal from "@/Components/EmployeeOptions/EditOptionModal";
import DeleteConfirmModal from "@/Components/EmployeeOptions/DeleteConfirmModal";

export default function Show({ group }) {
    const [showAddOption, setShowAddOption] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [deletingOption, setDeletingOption] = useState(null);

    function handleDeleteOption() {
        router.delete(
            route("employee-options.options.destroy", deletingOption.id),
            { onSuccess: () => setDeletingOption(null) }
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Employee Options
                </h2>
            }
        >
            <Head title={`Option Group · ${group.group}`} />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    {/* Back + heading */}
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-500 hover:text-slate-800"
                                onClick={() =>
                                    router.visit(
                                        route("employee-options.index")
                                    )
                                }
                            >
                                <ArrowLeft
                                    className="h-5 w-5"
                                    strokeWidth={1.75}
                                />
                            </Button>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Settings2
                                    className="h-5 w-5 text-[#3B5BA5]"
                                    strokeWidth={1.75}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    <code className="font-mono">{group.group}</code>
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {group.options.length} option
                                    {group.options.length !== 1 ? "s" : ""} in
                                    this group
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setShowAddOption(true)}
                            className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                            Add Option
                        </Button>
                    </div>

                    {/* Options card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {group.options.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <Settings2
                                            className="h-6 w-6 text-slate-400"
                                            strokeWidth={1.75}
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">
                                        No options yet
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Add the first option to this group
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {group.options.map((opt, idx) => (
                                    <li
                                        key={opt.id}
                                        className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50/80"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 w-8 justify-center">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-medium text-slate-800">
                                                {opt.value}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                                onClick={() =>
                                                    setEditingOption(opt)
                                                }
                                                title="Edit option"
                                            >
                                                <Pencil
                                                    className="h-4 w-4"
                                                    strokeWidth={1.75}
                                                />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() =>
                                                    setDeletingOption(opt)
                                                }
                                                title="Delete option"
                                            >
                                                <Trash2
                                                    className="h-4 w-4"
                                                    strokeWidth={1.75}
                                                />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddOptionModal
                open={showAddOption}
                onClose={() => setShowAddOption(false)}
                group={group}
            />
            <EditOptionModal
                open={!!editingOption}
                onClose={() => setEditingOption(null)}
                option={editingOption}
            />
            <DeleteConfirmModal
                open={!!deletingOption}
                onClose={() => setDeletingOption(null)}
                onConfirm={handleDeleteOption}
                title="Delete Option"
                description={`Are you sure you want to delete "${deletingOption?.value}"?`}
            />
        </AuthenticatedLayout>
    );
}