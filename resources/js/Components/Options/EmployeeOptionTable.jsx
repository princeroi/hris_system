// resources/js/Components/EmployeeOptions/EmployeeOptionTable.jsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EmployeeOptionGroupRow from "./EmployeeOptionGroupRow";
import { Settings2 } from "lucide-react";

export default function EmployeeOptionTable({ groups }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50/60">
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center w-20">
                        #
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Group Key
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Option Values
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center w-24">
                        Count
                    </TableHead>
                    <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <EmployeeOptionGroupRow key={group.id} group={group} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <Settings2
                                        className="h-6 w-6 text-slate-400"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <p className="text-sm font-medium text-slate-600">
                                    No option groups found
                                </p>
                                <p className="text-xs text-slate-400">
                                    Create a group to get started
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}