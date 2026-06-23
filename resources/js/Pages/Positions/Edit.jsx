import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Edit({ position }) {
    const { data, setData, put, processing, errors } = useForm({
        position_name: position.position_name ?? "",
        position_description: position.position_description ?? "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("positions.update", position.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Positions
                </h2>
            }
        >
            <Head title={`Edit · ${position.position_name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-6 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-500 hover:text-slate-800"
                            onClick={() => router.visit(route("positions.index"))}
                        >
                            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <Briefcase className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Edit Position
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                {position.position_name}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 px-6 py-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="position_name">Position Name</Label>
                                    <Input
                                        id="position_name"
                                        value={data.position_name}
                                        onChange={(e) => setData("position_name", e.target.value)}
                                        autoFocus
                                    />
                                    {errors.position_name && (
                                        <p className="text-xs text-red-500">{errors.position_name}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="position_description">
                                        Description{" "}
                                        <span className="text-slate-400 font-normal text-xs">(optional)</span>
                                    </Label>
                                    <textarea
                                        id="position_description"
                                        value={data.position_description}
                                        onChange={(e) => setData("position_description", e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/30 focus:border-[#3B5BA5] resize-none"
                                    />
                                    {errors.position_description && (
                                        <p className="text-xs text-red-500">{errors.position_description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route("positions.index"))}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#3B5BA5] hover:bg-[#2f4a8c] text-white"
                                >
                                    {processing ? "Saving…" : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}