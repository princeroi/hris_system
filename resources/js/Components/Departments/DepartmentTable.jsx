import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";
import { LayoutGrid } from "lucide-react";
import DepartmentRow from "./DepartmentRow";

export default function DepartmentTable({ departments }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50/60">
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                        No
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Department Name
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                        Employees
                    </TableHead>
                    <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {departments.length > 0 ? (
                    departments.map((dept) => (
                        <DepartmentRow key={dept.id} department={dept} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <LayoutGrid className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No departments found</p>
                                <p className="text-xs text-slate-400">Try adjusting your search or add a new department</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}