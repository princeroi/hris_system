import { TableCell, TableRow } from "@/components/ui/table";
import Avatar from "@/Components/ui/Avatar";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { router } from "@inertiajs/react";
import { useState } from "react";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";

export default function CompanyRow({ company }) {
    const [showDelete, setShowDelete] = useState(false);

    const companyName = company.company_name;

    function handleDelete() {
        router.delete(route("companies.destroy", company.id), {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <>
            <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                {/* ID */}
                <TableCell className="py-3.5 pl-5 text-center">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                        {company.id}
                    </span>
                </TableCell>

                {/* Name */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                        <Avatar name={companyName} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {companyName}
                            </p>
                            <Badge
                                variant={company.is_active ? "success-outline" : "danger-outline"}
                                className="mt-0.5"
                            >
                                {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </TableCell>

                {/* Branch count */}
                <TableCell className="py-3.5 pl-5 text-center">
                    <Badge variant={company.branches_count === 0 ? "danger-outline" : "info-outline"}>
                        {company.branches_count === 0
                            ? "No branches"
                            : `${company.branches_count} branch${company.branches_count !== 1 ? "es" : ""}`}
                    </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            onClick={() => router.visit(route("companies.show", company.id))}
                            title="View"
                        >
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                            onClick={() => router.visit(route("companies.edit", company.id))}
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setShowDelete(true)}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            <DeleteConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete Company"
                description={`Are you sure you want to delete "${companyName}"? This will also remove all its branches.`}
            />
        </>
    );
}