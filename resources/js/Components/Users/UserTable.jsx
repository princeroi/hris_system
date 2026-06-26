import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import UserRow from "./UserRow";

const HEADERS = ["Name", "Email", "Role", "Status", "Created", "Actions"];

export default function UserTable({ users, onDelete }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50/60 hover:bg-slate-50/60">
                    {HEADERS.map((h, i) => (
                        <TableHead
                            key={h}
                            className={[
                                "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                i === 0                  ? "pl-5"            : "",
                                i === HEADERS.length - 1 ? "pr-5 text-right" : "",
                            ].join(" ")}
                        >
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {users.length > 0 ? (
                    users.map(user => (
                        <UserRow key={user.id} user={user} onDelete={onDelete} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B5BA5]/10">
                                    <Users className="h-6 w-6 text-[#3B5BA5]" strokeWidth={1.75} />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No users found</p>
                                <p className="text-xs text-slate-400">Try adjusting your search</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}