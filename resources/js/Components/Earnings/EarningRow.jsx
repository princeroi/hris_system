import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { useState } from "react";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";
import EarningFormModal from "./EarningFormModal";

export default function EarningRow({ earning }) {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    function handleDelete() {
        router.delete(route("earnings.destroy", earning.id), {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <>
            <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                {/* ID */}
                <TableCell className="py-3.5 pl-5 text-center">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                        {earning.id}
                    </span>
                </TableCell>

                {/* Name + Description */}
                <TableCell className="py-3.5 pl-5">
                    <p className="text-sm font-semibold text-slate-900">{earning.name}</p>
                    {earning.description && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                            {earning.description}
                        </p>
                    )}
                </TableCell>

                {/* Default Amount */}
                <TableCell className="py-3.5 pl-5 text-right">
                    <span className="text-sm font-medium text-slate-700">
                        ₱{Number(earning.default_amount).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5 pl-5 text-center">
                    {earning.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                            Inactive
                        </span>
                    )}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                            onClick={() => setShowEdit(true)}
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

            <EarningFormModal
                open={showEdit}
                onClose={() => setShowEdit(false)}
                earning={earning}
            />
            <DeleteConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete Earning"
                description={`Are you sure you want to delete "${earning.name}"? This cannot be undone.`}
            />
        </>
    );
}