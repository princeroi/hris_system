import { useState, useMemo } from "react";
import {
    employeeSchema,
    personalInfoSchema,
    employmentDetailsSchema,
    govIdsSchema,
    bankAccountSchema,
    compensationSchema,
    workExperienceSchema,
    emergencyContactSchema,
} from "@/schemas/employeeSchema";

import { Button } from "@/components/ui/button";
import Step1PersonalInfo      from "./Steps/Step1PersonalInfo";
import Step2EmploymentDetails from "./Steps/Step2EmploymentDetails";
import Step3GovIds            from "./Steps/Step3GovIds";
import Step4BankAccount       from "./Steps/Step4BankAccount";
import Step5Compensation      from "./Steps/Step5Compensation";
import Step6WorkExperience    from "./Steps/Step6WorkExperience";
import Step7EmergencyContacts from "./Steps/Step7EmergencyContacts";

const STEPS = [
    { id: 1, label: "Personal Info"   },
    { id: 2, label: "Employment"      },
    { id: 3, label: "Gov IDs"         },
    { id: 4, label: "Bank Account"    },
    { id: 5, label: "Compensation"    },
    { id: 6, label: "Work Experience" },
    { id: 7, label: "Emergency"       },
];

const STEP_FIELDS = {
    1: [
        "employee_number", "first_name", "middle_name", "last_name", "suffix",
        "birth_date", "birth_place", "age", "gender", "civil_status",
        "nationality", "religion", "home_address", "current_address",
        "phone_number", "telephone_number", "email", "alternate_email",
        "highest_education", "course", "school",
    ],
    2: [
        "hired_date", "regularization_date", "contract_date_from", "contract_date_to",
        "contract_status", "employment_type", "status", "company_id", "branch_id",
        "department_id", "position_id", "job_level",
        "probationary_period_months", "probationary_evaluation_date",
    ],
    3: [
        "sss_number", "sss_status", "sss_remarks",
        "pagibig_number", "pagibig_status", "pagibig_remarks",
        "philhealth_number", "philhealth_status", "philhealth_remarks",
        "tin_number", "tin_status", "tin_remarks",
    ],
    4: [
        "bank_name", "account_number", "account_name", "atm_card_number", "atm_status",
        "gcash_account_number", "gcash_account_name",
        "other_bank_type", "other_bank_name", "other_account_number", "other_account_name",
    ],
    5: [
        "work_time_factor_id",
        "monthly_rate", "daily_rate", "hourly_rate",
        "payroll_type", "salary_type",
        "effective_date", "is_current",
    ],
    6: ["work_experiences"],
    7: ["emergency_contacts"],
};

const STEP_SCHEMAS = {
    1: personalInfoSchema,
    2: employmentDetailsSchema,
    3: govIdsSchema,
    4: bankAccountSchema,
    5: compensationSchema,
    6: workExperienceSchema,
    7: emergencyContactSchema,
};

function toDateInput(date) {
    return date.toISOString().split("T")[0];
}

function getDefaultDates() {
    const today = new Date();
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    return {
        hired_date:          toDateInput(today),
        regularization_date: toDateInput(sixMonthsLater),
        effective_date:      toDateInput(today),
    };
}

const { hired_date, regularization_date, effective_date } = getDefaultDates();

const emptyForm = {
    // Employee
    employee_number: "",
    first_name:      "",
    middle_name:     "",
    last_name:       "",
    suffix:          "",

    // Personal Details
    birth_date:        "",
    birth_place:       "",
    age:               "",
    gender:            "",
    civil_status:      "",
    nationality:       "Filipino",
    religion:          "",
    home_address:      "",
    current_address:   "",
    phone_number:      "",
    telephone_number:  "",
    email:             "",
    alternate_email:   "",
    highest_education: "",
    course:            "",
    school:            "",

    // Employment Details
    hired_date,
    regularization_date,
    contract_date_from:           "",
    contract_date_to:             "",
    contract_status:              "",
    employment_type:              "probationary",
    status:                       "",
    company_id:                   "",
    branch_id:                    "",
    department_id:                "",
    position_id:                  "",
    job_level:                    "",
    probationary_period_months:   "",
    probationary_evaluation_date: "",

    // Gov IDs
    sss_number:          "",
    sss_status:          "no_sss",
    sss_remarks:         "",
    pagibig_number:      "",
    pagibig_status:      "no_pagibig",
    pagibig_remarks:     "",
    philhealth_number:   "",
    philhealth_status:   "no_philhealth",
    philhealth_remarks:  "",
    tin_number:          "",
    tin_status:          "no_tin",
    tin_remarks:         "",

    // Bank Account
    bank_name:            "",
    account_number:       "",
    account_name:         "",
    atm_card_number:      "",
    atm_status:           "pending",
    gcash_account_number: "",
    gcash_account_name:   "",
    other_bank_type:      "",
    other_bank_name:      "",
    other_account_number: "",
    other_account_name:   "",

    // Compensation
    work_time_factor_id: "",
    monthly_rate:        "",
    daily_rate:          "",
    hourly_rate:         "",
    payroll_type:        "semi_monthly",
    salary_type:         "daily_rate",
    effective_date,
    is_current:          true,

    // Arrays
    work_experiences:   [],
    emergency_contacts: [],
};

function pickStepData(form, stepId) {
    return Object.fromEntries(
        STEP_FIELDS[stepId].map((key) => [key, form[key]])
    );
}

// ─── Flatten Zod issues into a { fieldKey: firstMessage } map ────────────────
// Handles both top-level fields and nested array fields:
//   path = ["work_experiences", 0, "end_date"]  →  "work_experiences.0.end_date"
//   path = ["emergency_contacts", 1, "contact_person_phone"] → same pattern

function flattenZodErrors(zodError) {
    const fieldErrors = {};
    for (const issue of zodError.issues) {
        if (issue.path.length === 0) continue;

        // Build a dot-notation key from the path array
        const key = issue.path
            .map((segment) => String(segment))
            .join(".");

        if (!fieldErrors[key]) {
            fieldErrors[key] = issue.message;
        }
    }
    return fieldErrors;
}

function validateStep(stepId, form) {
    const schema = STEP_SCHEMAS[stepId];
    const data   = pickStepData(form, stepId);
    const result = schema.safeParse(data);
    if (result.success) return {};
    return flattenZodErrors(result.error);
}

// ─── Count errors that belong to a step ──────────────────────────────────────
// Top-level fields are checked by inclusion in STEP_FIELDS[stepId].
// Nested array errors start with "work_experiences." or "emergency_contacts."

function countStepErrors(errors, stepId) {
    let count = 0;
    const topLevelSet = new Set(STEP_FIELDS[stepId]);

    for (const key of Object.keys(errors)) {
        const rootKey = key.split(".")[0]; // e.g. "work_experiences" or "employee_number"
        if (topLevelSet.has(rootKey)) count++;
    }
    return count;
}

export default function EmployeeWizard({
    initialData,
    onSubmit,
    companies       = [],
    branches        = [],
    departments     = [],
    positions       = [],
    workTimeFactors = [],
}) {
    const [step,    setStep]    = useState(1);
    const [form,    setForm]    = useState(initialData ? { ...emptyForm, ...initialData } : emptyForm);
    const [errors,  setErrors]  = useState({});
    const [visited, setVisited] = useState(new Set([1]));

    // ── Field change handlers ─────────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear the error for this exact key (including nested keys like "work_experiences.0.end_date")
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleBulkChange = (fields) => {
        setForm((prev) => ({ ...prev, ...fields }));
        setErrors((prev) => {
            const next = { ...prev };
            // Clear top-level keys
            Object.keys(fields).forEach((key) => delete next[key]);
            // Also clear any nested errors for array fields (e.g. clearing work_experiences clears work_experiences.0.*)
            Object.keys(fields).forEach((key) => {
                Object.keys(next).forEach((errKey) => {
                    if (errKey.startsWith(key + ".")) delete next[errKey];
                });
            });
            return next;
        });
    };

    // ── Step error badge counts ───────────────────────────────────────────────

    const stepErrorCounts = useMemo(() => {
        const counts = {};
        STEPS.forEach((s) => { counts[s.id] = 0; });

        for (const key of Object.keys(errors)) {
            const rootKey = key.split(".")[0];
            for (const [stepId, fields] of Object.entries(STEP_FIELDS)) {
                if (fields.includes(rootKey)) {
                    counts[Number(stepId)]++;
                    break;
                }
            }
        }
        return counts;
    }, [errors]);

    // ── Navigation ────────────────────────────────────────────────────────────

    const goToStep = (targetStep) => {
        setVisited((prev) => new Set([...prev, targetStep]));
        setStep(targetStep);
    };

    const next = () => {
        const stepErrors = validateStep(step, form);

        if (Object.keys(stepErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...stepErrors }));
        } else {
            // Clear all errors for fields belonging to this step
            setErrors((prev) => {
                const next = { ...prev };
                const topLevelSet = new Set(STEP_FIELDS[step]);
                for (const key of Object.keys(next)) {
                    if (topLevelSet.has(key.split(".")[0])) delete next[key];
                }
                return next;
            });
        }

        goToStep(step + 1);
    };

    const back = () => goToStep(step - 1);

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = () => {
        const result = employeeSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = flattenZodErrors(result.error);
            setErrors(fieldErrors);
            setVisited(new Set([1, 2, 3, 4, 5, 6, 7]));

            // Navigate to the step containing the first error
            const firstErrorKey = result.error.issues[0]?.path?.[0];
            if (firstErrorKey) {
                for (const [stepId, fields] of Object.entries(STEP_FIELDS)) {
                    if (fields.includes(String(firstErrorKey))) {
                        setStep(Number(stepId));
                        break;
                    }
                }
            }
            return;
        }

        onSubmit(form);
        setForm(emptyForm);
        setStep(1);
        setVisited(new Set([1]));
        setErrors({});
    };

    // ── Step renderer ─────────────────────────────────────────────────────────

    const renderStep = () => {
        switch (step) {
            case 1: return (
                <Step1PersonalInfo
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                />
            );
            case 2: return (
                <Step2EmploymentDetails
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                    companies={companies}
                    branches={branches}
                    departments={departments}
                    positions={positions}
                />
            );
            case 3: return (
                <Step3GovIds
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                />
            );
            case 4: return (
                <Step4BankAccount
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                />
            );
            case 5: return (
                <Step5Compensation
                    form={form}
                    onChange={handleChange}
                    onBulkChange={handleBulkChange}
                    errors={errors}
                    workTimeFactors={workTimeFactors}
                />
            );
            case 6: return (
                <Step6WorkExperience
                    form={form}
                    onChange={handleChange}
                    onBulkChange={handleBulkChange}
                    errors={errors}
                />
            );
            case 7: return (
                <Step7EmergencyContacts
                    form={form}
                    onBulkChange={handleBulkChange}
                    errors={errors}
                />
            );
            default: return null;
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* ── Step indicator ───────────────────────────────────────── */}
            <div className="flex items-center gap-0">
                {STEPS.map((s, i) => {
                    const isActive    = step === s.id;
                    const isCompleted = step > s.id;
                    const hasError    = visited.has(s.id) && stepErrorCounts[s.id] > 0;

                    const bgColor     = hasError ? "#FEF2F2"  : (isCompleted || isActive) ? "#1D4ED8" : "#EFF6FF";
                    const textColor   = hasError ? "#DC2626"  : (isCompleted || isActive) ? "#fff"    : "#93C5FD";
                    const borderColor = hasError ? "#DC2626"  : (isCompleted || isActive) ? "#1D4ED8" : "#BFDBFE";
                    const labelColor  = hasError ? "#DC2626"  : (isActive || isCompleted) ? "#1D4ED8" : "#9CA3AF";

                    return (
                        <div key={s.id} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => goToStep(s.id)}
                                className="flex flex-col items-center gap-1 cursor-pointer group"
                            >
                                <div
                                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-150 group-hover:opacity-80"
                                    style={{
                                        background:  bgColor,
                                        color:       textColor,
                                        border:      "2px solid",
                                        borderColor: borderColor,
                                    }}
                                >
                                    {hasError ? "!" : isCompleted ? "✓" : s.id}
                                </div>
                                <span
                                    className="text-xs font-medium whitespace-nowrap"
                                    style={{ color: labelColor }}
                                >
                                    {s.label}
                                    {hasError && (
                                        <span className="ml-1 text-red-500">
                                            ({stepErrorCounts[s.id]})
                                        </span>
                                    )}
                                </span>
                            </button>

                            {i < STEPS.length - 1 && (
                                <div
                                    className="h-px w-16 mb-5 mx-2 transition-all duration-150"
                                    style={{ background: step > s.id ? "#1D4ED8" : "#BFDBFE" }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Step content ─────────────────────────────────────────── */}
            {renderStep()}

            {/* ── Navigation ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 border-t border-[#DBEAFE]">
                <div>
                    {step > 1 && (
                        <Button variant="info-outline" size="sm" onClick={back}>
                            ← Back
                        </Button>
                    )}
                </div>
                <div>
                    {step < STEPS.length && (
                        <Button variant="default" size="sm" onClick={next}>
                            Next →
                        </Button>
                    )}
                    {step === STEPS.length && (
                        <Button variant="success" size="sm" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
}