import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        department_name: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("departments.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Departments
                </h2>
            }
        >
            <Head title="New Department" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-6 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-500 hover:text-slate-800"
                            onClick={() => router.visit(route("departments.index"))}
                        >
                            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <LayoutGrid className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                New Department
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Add a new department record
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 px-6 py-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="department_name">Department Name</Label>
                                    <Input
                                        id="department_name"
                                        value={data.department_name}
                                        onChange={(e) => setData("department_name", e.target.value)}
                                        placeholder="e.g. Human Resources"
                                        autoFocus
                                    />
                                    {errors.department_name && (
                                        <p className="text-xs text-red-500">{errors.department_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route("departments.index"))}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                                >
                                    {processing ? "Creating…" : "Create Department"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}