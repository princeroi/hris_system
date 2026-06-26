import { useEffect } from "react";
import { useForm, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserForm from "@/Components/Users/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2, Users } from "lucide-react";

function generateTempPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pass = "Temp@";
    for (let i = 0; i < 6; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

export default function Create({ roles, employees }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id:   "",
        name:          "",
        username:      "",
        email:         "",
        temp_password: "",
        role:          "",
    });

    useEffect(() => {
        setData("temp_password", generateTempPassword());
    }, []);

    const employeeOptions = employees.map(e => ({
        id:              e.id,
        label:           `${e.last_name}, ${e.first_name}`,
        email:           e.email,
        employee_number: e.employee_number,
    }));

    function submit(e) {
        e.preventDefault();
        post(route("users.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Add User
                </h2>
            }
        >
            <Head title="Add User" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

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
                                Add User
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Create a new system user from an employee
                            </p>
                        </div>
                    </div>

                    <UserForm
                        form={data}
                        setForm={setData}
                        roles={roles}
                        employees={employeeOptions}
                        errors={errors}
                    />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="ghost" asChild>
                            <Link href={route("users.index")}>Cancel</Link>
                        </Button>
                        <Button onClick={submit} disabled={processing} variant="info">
                            {processing
                                ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                                : <Plus className="h-4 w-4" strokeWidth={1.75} />
                            }
                            Create User
                        </Button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}