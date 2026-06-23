// resources/js/Pages/Companies/Show.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Building2,
    ArrowLeft,
    Pencil,
    Plus,
    MapPin,
    Phone,
    User,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import Avatar from "@/Components/ui/Avatar";
import BranchFormModal from "@/Components/Companies/BranchFormModal";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";

export default function Show({ company, branches }) {
    const [showBranchForm, setShowBranchForm] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [deletingBranch, setDeletingBranch] = useState(null);

    function handleDeleteBranch() {
        router.delete(route("companies.branches.destroy", [company.id, deletingBranch.id]), {
            onSuccess: () => setDeletingBranch(null),
        });
    }

    function openAddBranch() {
        setEditingBranch(null);
        setShowBranchForm(true);
    }

    function openEditBranch(branch) {
        setEditingBranch(branch);
        setShowBranchForm(true);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Companies
                </h2>
            }
        >
            <Head title={company.company_name} />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Page heading */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-500 hover:text-slate-800"
                                onClick={() => router.visit(route("companies.index"))}
                            >
                                <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                            </Button>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Building2 className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {company.company_name}
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Company profile
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => router.visit(route("companies.edit", company.id))}
                            variant="outline"
                            className="inline-flex items-center gap-2"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                            Edit Company
                        </Button>
                    </div>

                    {/* Profile card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-5 px-6 py-6 border-b border-slate-100">
                            <Avatar name={company.company_name} size="lg" />
                            <div className="space-y-1">
                                <p className="text-lg font-semibold text-slate-900">
                                    {company.company_name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={company.is_active ? "success-outline" : "danger-outline"}>
                                        {company.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                    <Badge variant="info-outline">
                                        {branches.length} branch{branches.length !== 1 ? "es" : ""}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Meta row */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-3">
                            <div className="px-6 py-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Company ID
                                </p>
                                <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                                    #{company.id}
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Status
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                    {company.is_active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Branches
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                    {branches.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Branches section */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Branches</h2>
                                <p className="text-sm text-slate-500">
                                    All branches under {company.company_name}
                                </p>
                            </div>
                            <Button
                                onClick={openAddBranch}
                                className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                            >
                                <Plus className="h-4 w-4" strokeWidth={1.75} />
                                Add Branch
                            </Button>
                        </div>

                        {/* Branch list */}
                        {branches.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <Building2 className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">No branches yet</p>
                                    <p className="text-xs text-slate-400">Add the first branch for this company</p>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {branches.map((branch) => (
                                    <li
                                        key={branch.id}
                                        className="group flex items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {branch.branch_name}
                                            </p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                {branch.branch_location && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                                                        {branch.branch_location}
                                                    </span>
                                                )}
                                                {branch.branch_contact_person && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <User className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                                                        {branch.branch_contact_person}
                                                    </span>
                                                )}
                                                {branch.branch_contact_number && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                                                        {branch.branch_contact_number}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 opacity-60 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                                onClick={() => openEditBranch(branch)}
                                                title="Edit branch"
                                            >
                                                <Pencil className="h-4 w-4" strokeWidth={1.75} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => setDeletingBranch(branch)}
                                                title="Delete branch"
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
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
            <BranchFormModal
                open={showBranchForm}
                onClose={() => setShowBranchForm(false)}
                company={company}
                branch={editingBranch}
            />
            <DeleteConfirmModal
                open={!!deletingBranch}
                onClose={() => setDeletingBranch(null)}
                onConfirm={handleDeleteBranch}
                title="Delete Branch"
                description={`Are you sure you want to delete "${deletingBranch?.branch_name}"? This cannot be undone.`}
            />
        </AuthenticatedLayout>
    );
}