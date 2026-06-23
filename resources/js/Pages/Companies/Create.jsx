import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: "",
        is_active: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("companies.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Companies
                </h2>
            }
        >
            <Head title="New Company" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-6 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-500 hover:text-slate-800"
                            onClick={() => router.visit(route("companies.index"))}
                        >
                            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <Building2 className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                New Company
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Add a new company record
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 px-6 py-6">

                                <div className="space-y-1.5">
                                    <Label htmlFor="company_name">Company Name</Label>
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) => setData("company_name", e.target.value)}
                                        placeholder="e.g. Acme Corporation"
                                        autoFocus
                                    />
                                    {errors.company_name && (
                                        <p className="text-xs text-red-500">{errors.company_name}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {data.is_active ? "Active" : "Inactive"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Inactive companies won't appear in employee assignments
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={data.is_active}
                                        onCheckedChange={(val) => setData("is_active", val)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route("companies.index"))}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                                >
                                    {processing ? "Creating…" : "Create Company"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}