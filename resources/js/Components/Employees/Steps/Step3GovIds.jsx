import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

function SectionHeading({ title }) {
    return (
        <div className="pb-3 border-b border-[#BFDBFE]">
            <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
        </div>
    );
}

function GovIdBlock({ label, numberField, statusField, remarksField, noValue, form, onChange, errors }) {
    const sel = (name) => (v) => onChange({ target: { name, value: v } });

    // blank number → noValue (no_sss etc.); typing a number → for_verification
    const handleNumberChange = (e) => {
        onChange(e);
        const isEmpty = !e.target.value.trim();
        onChange({ target: { name: statusField, value: isEmpty ? noValue : "for_verification" } });
    };

    return (
        <div className="grid grid-cols-3 gap-4 items-start">
            <div>
                <Label>{label} Number</Label>
                <Input
                    name={numberField}
                    placeholder={`Enter ${label} number`}
                    value={form[numberField] ?? ""}
                    onChange={handleNumberChange}
                    className="!bg-white"
                />
                {errors[numberField] && (
                    <p className="text-xs text-red-500 mt-1">{errors[numberField]}</p>
                )}
            </div>

            <div>
                <Label>
                    Status
                    <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Select value={form[statusField] ?? "for_verification"} onValueChange={sel(statusField)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={noValue}>No {label}</SelectItem>
                        <SelectItem value="for_verification">For Verification</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                </Select>
                {errors[statusField] && (
                    <p className="text-xs text-red-500 mt-1">{errors[statusField]}</p>
                )}
            </div>

            <div>
                <Label>Remarks</Label>
                <Input
                    name={remarksField}
                    placeholder="Optional remarks"
                    value={form[remarksField] ?? ""}
                    onChange={onChange}
                    className="!bg-white"
                />
            </div>
        </div>
    );
}

const GOV_ID_FIELDS = [
    { label: "SSS",        numberField: "sss_number",        statusField: "sss_status",        remarksField: "sss_remarks",        noValue: "no_sss"        },
    { label: "Pag-IBIG",   numberField: "pagibig_number",    statusField: "pagibig_status",    remarksField: "pagibig_remarks",    noValue: "no_pagibig"    },
    { label: "PhilHealth", numberField: "philhealth_number", statusField: "philhealth_status", remarksField: "philhealth_remarks", noValue: "no_philhealth" },
    { label: "TIN",        numberField: "tin_number",        statusField: "tin_status",        remarksField: "tin_remarks",        noValue: "no_tin"        },
];

export default function Step3GovIds({ form, onChange, errors = {} }) {
    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <SectionHeading title="Government IDs" />
                {GOV_ID_FIELDS.map((field) => (
                    <GovIdBlock
                        key={field.numberField}
                        {...field}
                        form={form}
                        onChange={onChange}
                        errors={errors}
                    />
                ))}
            </div>
        </div>
    );
}