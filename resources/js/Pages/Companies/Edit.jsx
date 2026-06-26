import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Building2, ArrowLeft, Plus, Pencil, Trash2, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import BranchFormModal from "@/Components/Companies/BranchFormModal";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";

export default function Edit({ company, branches }) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: company.company_name ?? "",
        is_active: Boolean(company.is_active),
    });

    const [showBranchForm, setShowBranchForm] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [deletingBranch, setDeletingBranch] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        put(route("companies.update", company.id));
    }

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
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(`/companies/${company.id}`)}
                        className="text-[#1E40AF] hover:text-[#1E3A8A] hover:bg-[#EFF6FF]"
                    >
                        ← Back
                    </Button>
                    <div className="w-px h-5 bg-[#BFDBFE]" />
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Companies
                    </h2>
                </div>
            }
        >
            <Head title={`Edit · ${company.company_name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <Building2 className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Edit Company
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                {company.company_name}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        <div className="lg:col-span-1">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-5 py-4">
                                    <h2 className="text-sm font-semibold text-slate-700">Company Details</h2>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-5 px-5 py-5">

                                        <div className="space-y-1.5">
                                            <Label htmlFor="company_name">Company Name</Label>
                                            <Input
                                                id="company_name"
                                                value={data.company_name}
                                                onChange={(e) => setData("company_name", e.target.value)}
                                                autoFocus
                                            />
                                            {errors.company_name && (
                                                <p className="text-xs text-red-500">{errors.company_name}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div>
                                                <p className={`text-sm font-medium ${data.is_active ? "text-slate-800" : "text-slate-400"}`}>
                                                    {data.is_active ? "Active" : "Inactive"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Inactive companies won't appear in assignments
                                                </p>
                                            </div>
                                            <Toggle
                                                checked={data.is_active}
                                                onCheckedChange={(val) => setData("is_active", val)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.visit(route("companies.index"))}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                                        >
                                            {processing ? "Saving…" : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-700">Branches</h2>
                                        <p className="text-xs text-slate-500">
                                            {branches.length} branch{branches.length !== 1 ? "es" : ""}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={openAddBranch}
                                        className="inline-flex items-center gap-2 bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4" strokeWidth={1.75} />
                                        Add Branch
                                    </Button>
                                </div>

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
                                                className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80"
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
                </div>
            </div>

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