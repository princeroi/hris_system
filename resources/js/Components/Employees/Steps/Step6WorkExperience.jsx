// resources/js/Components/Employees/Steps/Step6WorkExperience.jsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

function SectionHeading({ title, description }) {
    return (
        <div className="pb-3 border-b border-[#BFDBFE]">
            <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
            {description && <p className="text-sm text-[#3B5BA5] mt-1">{description}</p>}
        </div>
    );
}

function Field({ label, error, hint, children }) {
    return (
        <div>
            <Label>{label}</Label>
            {children}
            {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

// ── Auto-compute years of service from start/end dates ────────────────────────
function calcYearsOfService(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return "";
    const start = new Date(startDateStr);
    const end   = new Date(endDateStr);
    if (isNaN(start) || isNaN(end) || end < start) return "";
    const ms    = end - start;
    const years = ms / (1000 * 60 * 60 * 24 * 365.25);
    return Math.round(years * 100) / 100;
}

const emptyEntry = {
    company_name:     "",
    position:         "",
    department:       "",
    start_date:       "",
    end_date:         "",
    years_of_service: "",
    remarks:          "",
};

export default function Step6WorkExperience({ form, onBulkChange, errors = {} }) {
    const entries = form.work_experiences ?? [];

    const update = (index, field, value) => {
        const updated = entries.map((entry, i) => {
            if (i !== index) return entry;

            const next = { ...entry, [field]: value };

            // Auto-compute years_of_service when either date changes
            if (field === "start_date" || field === "end_date") {
                next.years_of_service = calcYearsOfService(next.start_date, next.end_date);
            }

            return next;
        });
        onBulkChange({ work_experiences: updated });
    };

    const addEntry = () => {
        onBulkChange({ work_experiences: [...entries, { ...emptyEntry }] });
    };

    const removeEntry = (index) => {
        onBulkChange({ work_experiences: entries.filter((_, i) => i !== index) });
    };

    const entryError = (index, field) =>
        errors[`work_experiences.${index}.${field}`] ||
        errors?.[`work_experiences`]?.[index]?.[field];

    return (
        <div className="space-y-8">
            <SectionHeading
                title="Work Experience"
                description="Add the employee's previous work history. Leave blank if none."
            />

            {entries.length === 0 && (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-[#BFDBFE] rounded-lg">
                    <p className="text-sm">No work experience added yet.</p>
                    <p className="text-xs mt-1">Click the button below to add an entry.</p>
                </div>
            )}

            <div className="space-y-6">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className="border border-[#BFDBFE] rounded-lg p-5 space-y-4 bg-[#F8FAFF]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#1E40AF]">
                                Entry #{index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeEntry(index)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Remove entry"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Company / Position / Department */}
                        <div className="grid grid-cols-3 gap-4">
                            <Field label="Company Name" error={entryError(index, "company_name")}>
                                <Input
                                    placeholder="e.g. Acme Corporation"
                                    value={entry.company_name ?? ""}
                                    onChange={(e) => update(index, "company_name", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field label="Position" error={entryError(index, "position")}>
                                <Input
                                    placeholder="e.g. Software Engineer"
                                    value={entry.position ?? ""}
                                    onChange={(e) => update(index, "position", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field label="Department" error={entryError(index, "department")}>
                                <Input
                                    placeholder="e.g. Engineering"
                                    value={entry.department ?? ""}
                                    onChange={(e) => update(index, "department", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                        </div>

                        {/* Dates + auto-computed years */}
                        <div className="grid grid-cols-3 gap-4">
                            <Field label="Start Date" error={entryError(index, "start_date")}>
                                <Input
                                    type="date"
                                    value={entry.start_date ?? ""}
                                    onChange={(e) => update(index, "start_date", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field label="End Date" error={entryError(index, "end_date")}>
                                <Input
                                    type="date"
                                    value={entry.end_date ?? ""}
                                    onChange={(e) => update(index, "end_date", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field
                                label="Years of Service"
                                hint="Auto-computed from start and end date."
                                error={entryError(index, "years_of_service")}
                            >
                                <Input
                                    type="number"
                                    readOnly
                                    tabIndex={-1}
                                    value={entry.years_of_service ?? ""}
                                    placeholder="—"
                                    className="bg-gray-50 cursor-not-allowed text-gray-500"
                                />
                            </Field>
                        </div>

                        {/* Remarks */}
                        <Field label="Remarks" error={entryError(index, "remarks")}>
                            <Input
                                placeholder="Optional notes"
                                value={entry.remarks ?? ""}
                                onChange={(e) => update(index, "remarks", e.target.value)}
                                className="!bg-white"
                            />
                        </Field>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="info-outline"
                    size="sm"
                    onClick={addEntry}
                    className="flex items-center gap-2"
                >
                    <PlusCircle size={16} />
                    Add Work Experience
                </Button>
            </div>
        </div>
    );
}