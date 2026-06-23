import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Coins } from "lucide-react";
import EarningRow from "./EarningRow";

export default function EarningTable({ earnings }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50/60">
                    <TableHead className="pl-5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        No
                    </TableHead>
                    <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Name
                    </TableHead>
                    <TableHead className="pl-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Default Amount
                    </TableHead>
                    <TableHead className="pl-5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                    </TableHead>
                    <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {earnings.length > 0 ? (
                    earnings.map((earning) => (
                        <EarningRow key={earning.id} earning={earning} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <Coins className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No earnings found</p>
                                <p className="text-xs text-slate-400">
                                    Try adjusting your search or add a new earning
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}