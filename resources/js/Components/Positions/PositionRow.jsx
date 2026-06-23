import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { useState } from "react";
import DeleteConfirmModal from "@/Components/ConfirmModal/DeleteConfirmModal";
import PositionFormModal from "./PositionFormModal";

export default function PositionRow({ position }) {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    function handleDelete() {
        router.delete(route("positions.destroy", position.id), {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <>
            <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                <TableCell className="py-3.5 pl-5 text-center">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                        {position.id}
                    </span>
                </TableCell>

                <TableCell className="py-3.5 pl-5">
                    <p className="text-sm font-semibold text-slate-900">
                        {position.position_name}
                    </p>
                </TableCell>

                <TableCell className="py-3.5 pl-5 max-w-xs">
                    <p className="text-sm text-slate-500 truncate">
                        {position.position_description
                            ? position.position_description
                            : <span className="italic text-slate-300">No description</span>
                        }
                    </p>
                </TableCell>

                <TableCell className="py-3.5 pl-5 text-center">
                    <span className="text-sm text-slate-600">
                        {position.employment_detail_count ?? 0}
                    </span>
                </TableCell>

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

            <PositionFormModal
                open={showEdit}
                onClose={() => setShowEdit(false)}
                position={position}
            />
            <DeleteConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete Position"
                description={`Are you sure you want to delete "${position.position_name}"? This cannot be undone.`}
            />
        </>
    );
}