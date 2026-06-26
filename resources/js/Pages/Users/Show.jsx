import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Users, Mail, Shield, CalendarDays } from "lucide-react";

function Row({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-4 px-6 py-4">
            <div className="flex w-36 shrink-0 items-center gap-1.5 pt-0.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />}
                <span className="text-sm text-slate-500">{label}</span>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

export default function Show({ user }) {
    function destroy() {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        router.delete(route("users.destroy", user.id), {
            onSuccess: () => router.visit(route("users.index")),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    User Details
                </h2>
            }
        >
            <Head title={user.name} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon-sm" asChild>
                                <Link href={route("users.index")}>
                                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                                </Link>
                            </Button>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                                <Users className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {user.name}
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    User #{user.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route("users.edit", user.id)}>
                                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={destroy}>
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                        <Badge variant={user.is_active ? "success" : "destructive"}>
                            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                            {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {user.roles?.[0] && (
                            <Badge variant="info">{user.roles[0]}</Badge>
                        )}
                    </div>

                    {/* Detail card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">

                        <Row icon={Users} label="Name">
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        </Row>

                        <Row icon={Mail} label="Email">
                            <p className="text-sm text-slate-700">{user.email}</p>
                        </Row>

                        <Row icon={Shield} label="Role">
                            {user.roles?.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {user.roles.map(r => (
                                        <Badge key={r} variant="info">{r}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400 italic">No role assigned</span>
                            )}
                        </Row>

                        <Row icon={CalendarDays} label="Created">
                            <p className="text-sm text-slate-700">{user.created_at}</p>
                        </Row>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}