import { useForm, Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DutyForm from "@/Components/RelieverDuties/DutyForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";

export default function Edit({
    duty, employees, companies, branches, departments, positions, scheduledDates = {}
}) {
    const { data, setData, put, processing, errors } = useForm({
        reliever_employee_id: duty.reliever_employee_id ?? "",
        duty_type:            duty.duty_type            ?? "vacant_post",
        covered_employee_id:  duty.covered_employee_id  ?? "",
        company_id:           duty.company_id           ?? "",
        branch_id:            duty.branch_id            ?? "",
        department_id:        duty.department_id        ?? "",
        position_id:          duty.position_id          ?? "",
        dates:                duty.dates                ?? [],
        remarks:              duty.remarks              ?? "",
    });

    function submit(e) {
        e.preventDefault();
        put(route("reliever-duties.update", duty.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Edit Reliever Duty
                </h2>
            }
        >
            <Head title={`Edit Duty #${duty.id}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon-sm" asChild>
                            <Link href={route("reliever-duties.show", duty.id)}>
                                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                            </Link>
                        </Button>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B5BA5]/10">
                            <FileText className="h-5 w-5 text-[#3B5BA5]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Edit Reliever Duty
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Duty #{duty.id} · {duty.reliever_name}
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
                        isEditing={true}
                    />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="ghost" asChild>
                            <Link href={route("reliever-duties.show", duty.id)}>Cancel</Link>
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