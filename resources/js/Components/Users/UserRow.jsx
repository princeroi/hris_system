import { Link } from "@inertiajs/react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";

export default function UserRow({ user, onDelete }) {
    return (
        <TableRow className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">

            {/* Name */}
            <TableCell className="py-3.5 pl-5">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            </TableCell>

            {/* Email */}
            <TableCell className="py-3.5">
                <p className="text-sm text-slate-500">{user.email}</p>
            </TableCell>

            {/* Role */}
            <TableCell className="py-3.5">
                {user.roles?.[0] ? (
                    <Badge variant="info">{user.roles[0]}</Badge>
                ) : (
                    <span className="text-slate-400 text-sm">—</span>
                )}
            </TableCell>

            {/* Status */}
            <TableCell className="py-3.5">
                <Badge variant={user.is_active ? "success" : "destructive"}>
                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                    {user.is_active ? "Active" : "Inactive"}
                </Badge>
            </TableCell>

            {/* Created */}
            <TableCell className="py-3.5">
                <p className="text-sm text-slate-500">{user.created_at}</p>
            </TableCell>

            {/* Actions */}
            <TableCell className="py-3.5 pr-5 text-right">
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                        title="View"
                        asChild
                    >
                        <Link href={route("users.show", user.id)}>
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                        asChild
                    >
                        <Link href={route("users.edit", user.id)}>
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/40"
                            >
                                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                                <Link href={route("users.show", user.id)}>
                                    <Eye className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                    View details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route("users.edit", user.id)}>
                                    <Pencil className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                    Edit user
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(user.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.75} />
                                Delete user
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </TableCell>

        </TableRow>
    );
}