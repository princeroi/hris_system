import { useForm, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DutyForm from "@/Components/RelieverDuties/DutyForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2, FileText } from "lucide-react";

export default function Create({
    employees, companies, branches, departments, positions, scheduledDates = {}
}) {
    const { data, setData, post, processing, errors } = useForm({
        reliever_employee_id: "",
        duty_type:            "vacant_post",
        covered_employee_id:  "",
        company_id:           "",
        branch_id:            "",
        department_id:        "",
        position_id:          "",
        dates:                [],
        remarks:              "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("reliever-duties.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    New Reliever Duty
                </h2>
            }
        >
            <Head title="New Reliever Duty" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon-sm" asChild>
                            <Link href={route("reliever-duties.index")}>
                                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                            </Link>
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <FileText className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                New Reliever Duty
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Assign a reliever to a post or employee
                            </p>
                        </div>
                    </div>

                    <DutyForm
                        form={data}
                        setForm={setData}
                        employees={employees}
                        companies={companies}
                        branches={branches}
                        departments={departments}
                        positions={positions}
                        scheduledDates={scheduledDates}
                        errors={errors}
                    />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="ghost" asChild>
                            <Link href={route("reliever-duties.index")}>Cancel</Link>
                        </Button>
                        <Button onClick={submit} disabled={processing} variant="info">
                            {processing
                                ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                                : <Plus className="h-4 w-4" strokeWidth={1.75} />
                            }
                            Create Duty
                        </Button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}