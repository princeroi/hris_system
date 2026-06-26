import { useForm, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserForm from "@/Components/Users/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Users } from "lucide-react";

export default function Edit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name:                  user.name     ?? "",
        username:              user.username ?? "",
        email:                 user.email    ?? "",
        password:              "",
        password_confirmation: "",
        role:                  user.roles?.[0] ?? "",
        is_active:             user.is_active ?? true,
    });

    const linkedEmployee = user.employee ? {
        label:           `${user.employee.last_name}, ${user.employee.first_name}`,
        employee_number: user.employee.employee_number,
    } : null;

    function submit(e) {
        e.preventDefault();
        put(route("users.update", user.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Edit User
                </h2>
            }
        >
            <Head title={`Edit ${user.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon-sm" asChild>
                            <Link href={route("users.show", user.id)}>
                                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                            </Link>
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <Users className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Edit User
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">{user.name}</p>
                        </div>
                    </div>

                    <UserForm
                        form={data}
                        setForm={setData}
                        roles={roles}
                        errors={errors}
                        isEditing={true}
                        employee={linkedEmployee}
                    />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="ghost" asChild>
                            <Link href={route("users.show", user.id)}>Cancel</Link>
                        </Button>
                        <Button onClick={submit} disabled={processing} variant="info">
                            {processing
                                ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                                : <Save className="h-4 w-4" strokeWidth={1.75} />
                            }
                            Save Changes
                        </Button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}