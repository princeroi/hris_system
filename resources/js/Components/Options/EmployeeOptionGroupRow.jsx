// resources/js/Components/EmployeeOptions/EmployeeOptionGroupRow.jsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import EditGroupModal from "./EditGroupModal";
import AddOptionModal from "./AddOptionModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function EmployeeOptionGroupRow({ group }) {
    const [showEdit, setShowEdit] = useState(false);
    const [showAddOption, setShowAddOption] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    function handleDeleteGroup() {
        router.delete(route("employee-options.groups.destroy", group.id), {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <>
            <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                {/* ID */}
                <TableCell className="py-3.5 pl-5 text-center">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                        {group.id}
                    </span>
                </TableCell>

                {/* Group key */}
                <TableCell className="py-3.5 pl-5">
                    <code className="rounded bg-slate-100 px-2 py-0.5 text-sm font-mono font-semibold text-slate-800">
                        {group.group}
                    </code>
                </TableCell>

                {/* Option chips */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex flex-wrap gap-1.5">
                        {group.options.length > 0 ? (
                            group.options.map((opt) => (
                                <span
                                    key={opt.id}
                                    className="inline-flex items-center rounded-full bg-[#3B5BA5]/8 px-2.5 py-0.5 text-xs font-medium text-[#3B5BA5] ring-1 ring-inset ring-[#3B5BA5]/20"
                                >
                                    {opt.value}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-400 italic">
                                No options yet
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* Count */}
                <TableCell className="py-3.5 pl-5 text-center">
                    <Badge
                        variant={
                            group.options.length === 0
                                ? "danger-outline"
                                : "info-outline"
                        }
                    >
                        {group.options.length}
                    </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        {/* Add option */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setShowAddOption(true)}
                            title="Add option"
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.75} />
                        </Button>

                        {/* Edit group */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                            onClick={() => setShowEdit(true)}
                            title="Edit group"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </Button>

                        {/* Delete group */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setShowDelete(true)}
                            title="Delete group"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* Modals */}
            <EditGroupModal
                open={showEdit}
                onClose={() => setShowEdit(false)}
                group={group}
            />
            <AddOptionModal
                open={showAddOption}
                onClose={() => setShowAddOption(false)}
                group={group}
            />
            <DeleteConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDeleteGroup}
                title="Delete Option Group"
                description={`Are you sure you want to delete the "${group.group}" group? This will also delete all ${group.options.length} option(s) inside it.`}
            />
        </>
    );
}