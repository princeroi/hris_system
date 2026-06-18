import { z } from "zod";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const optionalString = (max, label) =>
    z.string()
        .max(max, `${label} must be at most ${max} characters`)
        .optional()
        .nullable()
        .or(z.literal(""));

// Numbers-only string (for account numbers, ATM card, GCash)
const numericString = (max, label) =>
    z.string()
        .max(max, `${label} must be at most ${max} characters`)
        .refine((val) => !val || /^\d+$/.test(val.trim()), {
            message: `${label} must contain numbers only`,
        })
        .optional()
        .nullable()
        .or(z.literal(""));

// ─── Gov ID format regexes (mirrors bulkUploadUtils) ─────────────────────────

const GOV_ID_PATTERNS = {
    sss_number:        { regex: /^\d{2}-?\d{7}-?\d{1}$|^\d{10}$/,                                 hint: "XX-XXXXXXX-X (10 digits)"               },
    pagibig_number:    { regex: /^\d{4}-?\d{4}-?\d{4}$|^\d{12}$/,                                 hint: "XXXX-XXXX-XXXX (12 digits)"             },
    philhealth_number: { regex: /^\d{2}-?\d{9}-?\d{1}$|^\d{12}$/,                                 hint: "XX-XXXXXXXXX-X (12 digits)"             },
    tin_number:        { regex: /^\d{3}-?\d{3}-?\d{3}$|^\d{3}-?\d{3}-?\d{3}-?\d{3}$|^\d{9}$|^\d{12}$/, hint: "XXX-XXX-XXX (9 digits) or XXX-XXX-XXX-XXX (12 digits)" },
};

function govIdField(col, label) {
    const { regex, hint } = GOV_ID_PATTERNS[col];
    return z
        .string()
        .refine((val) => !val || regex.test(val.trim()), {
            message: `Invalid ${label} format — expected ${hint}`,
        })
        .optional()
        .nullable()
        .or(z.literal(""));
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
    employee_number: z
        .string()
        .min(1, "Employee number is required.")
        .max(50, "Employee number must be at most 50 characters."),

    first_name:  z.string().min(1, "First name is required.").max(255, "First name must be at most 255 characters."),
    middle_name: optionalString(255, "Middle name"),
    last_name:   z.string().min(1, "Last name is required.").max(255, "Last name must be at most 255 characters."),
    suffix:      optionalString(50, "Suffix"),

    birth_date: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(""))
        .refine((val) => {
            if (!val) return true;
            const d = new Date(val);
            return !isNaN(d);
        }, { message: "Please enter a valid birth date." })
        .refine((val) => {
            if (!val) return true;
            const birth = new Date(val);
            if (isNaN(birth)) return true; // already caught above
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return age >= 18;
        }, { message: "Employee must be at least 18 years old." }),

    birth_place: optionalString(255, "Birth place"),

    age: z.coerce
        .number()
        .int("Age must be a whole number.")
        .min(0, "Age must be 0 or more.")
        .max(150, "Age must be 150 or less.")
        .optional()
        .nullable()
        .or(z.literal("")),

    gender:       z.enum(["Male", "Female", ""]).optional().nullable(),
    civil_status: z.enum(["Single", "Married", "Divorced", "Widowed", ""]).optional().nullable(),

    nationality:  optionalString(100, "Nationality"),
    religion:     optionalString(100, "Religion"),

    home_address:    optionalString(500, "Home address"),
    current_address: optionalString(500, "Current address"),

    phone_number:     optionalString(20, "Phone number"),
    telephone_number: optionalString(20, "Telephone number"),

    email: z
        .string()
        .max(255, "Email must be at most 255 characters.")
        .email("Invalid email address.")
        .optional()
        .nullable()
        .or(z.literal("")),

    alternate_email: z
        .string()
        .max(255, "Alternate email must be at most 255 characters.")
        .email("Invalid alternate email address.")
        .optional()
        .nullable()
        .or(z.literal("")),

    highest_education: optionalString(100, "Highest education"),
    course:            optionalString(100, "Course"),
    school:            optionalString(255, "School"),
});

// ─── Step 2: Employment Details ───────────────────────────────────────────────

export const employmentDetailsSchema = z
    .object({
        hired_date: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid hired date." }),

        regularization_date: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid regularization date." }),

        contract_date_from: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid contract start date." }),

        contract_date_to: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid contract end date." }),

        contract_status: z
            .enum(["valid", "expired", "renewed", "terminated", ""])
            .optional()
            .nullable(),

        employment_type: z
            .enum(["probationary", "regular", "project_based", "contractual", "reliever", "part_time", "intern", ""])
            .optional()
            .nullable(),

        status: z
            .enum(["active", "inactive", "on_leave", "terminated", "resigned", "retired", "contract_end", ""])
            .optional()
            .nullable(),

        company_id:    z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        branch_id:     z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        department_id: z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        position_id:   z.coerce.number().int().positive().optional().nullable().or(z.literal("")),

        job_level: z
            .string()
            .max(50, "Job level must be at most 50 characters.")
            .optional()
            .nullable()
            .or(z.literal("")),

        probationary_period_months: z.coerce
            .number()
            .int("Probationary period must be a whole number.")
            .min(0, "Probationary period must be 0 or more.")
            .max(24, "Probationary period must be 24 months or less.")
            .optional()
            .nullable()
            .or(z.literal("")),

        probationary_evaluation_date: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid probationary evaluation date." }),
    })
    .refine(
        (data) => {
            if (data.contract_date_from && data.contract_date_to) {
                return new Date(data.contract_date_to) >= new Date(data.contract_date_from);
            }
            return true;
        },
        {
            message: "Contract end date must be on or after the start date.",
            path: ["contract_date_to"],
        }
    );

// ─── Step 3: Government IDs ───────────────────────────────────────────────────

export const govIdsSchema = z.object({
    sss_number:       govIdField("sss_number",        "SSS"),
    sss_status:       z.enum(["no_sss", "for_verification", "verified"]),
    sss_remarks:      z.string().optional().nullable().or(z.literal("")),

    pagibig_number:   govIdField("pagibig_number",    "Pag-IBIG"),
    pagibig_status:   z.enum(["no_pagibig", "for_verification", "verified"]),
    pagibig_remarks:  z.string().optional().nullable().or(z.literal("")),

    philhealth_number:  govIdField("philhealth_number", "PhilHealth"),
    philhealth_status:  z.enum(["no_philhealth", "for_verification", "verified"]),
    philhealth_remarks: z.string().optional().nullable().or(z.literal("")),

    tin_number:   govIdField("tin_number",   "TIN"),
    tin_status:   z.enum(["no_tin", "for_verification", "verified"]),
    tin_remarks:  z.string().optional().nullable().or(z.literal("")),
});

// ─── Step 4: Bank Account ─────────────────────────────────────────────────────

export const bankAccountSchema = z.object({
    bank_name:    optionalString(255, "Bank name"),
    account_name: optionalString(255, "Account name"),

    // Account numbers: digits only
    account_number:       numericString(255, "Account number"),
    atm_card_number:      numericString(255, "ATM card number"),
    gcash_account_number: numericString(255, "GCash account number"),
    other_account_number: numericString(255, "Other account number"),

    atm_status: z.enum(["pending", "released", "active", "inactive"]).default("active"),

    gcash_account_name:   optionalString(255, "GCash account name"),
    other_bank_type:      optionalString(255, "Other bank type"),
    other_bank_name:      optionalString(255, "Other bank name"),
    other_account_name:   optionalString(255, "Other account name"),
});

// ─── Step 5: Compensation ─────────────────────────────────────────────────────

export const compensationSchema = z.object({
    work_time_factor_id: z.coerce.number().int().positive().optional().nullable().or(z.literal("")),

    monthly_rate: z.coerce
        .number()
        .min(0, "Monthly rate must be 0 or more.")
        .optional()
        .nullable()
        .or(z.literal("")),

    daily_rate: z.coerce
        .number()
        .min(0, "Daily rate must be 0 or more.")
        .optional()
        .nullable()
        .or(z.literal("")),

    hourly_rate: z.coerce
        .number()
        .min(0, "Hourly rate must be 0 or more.")
        .optional()
        .nullable()
        .or(z.literal("")),

    payroll_type: z
        .enum(["monthly", "semi_monthly", "weekly", "daily", "hourly", ""])
        .optional()
        .nullable(),

    salary_type: z
        .enum(["hourly_rate", "daily_rate", "weekly_rate", "semi_monthly_rate", "monthly_rate", ""])
        .optional()
        .nullable(),

    effective_date: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(""))
        .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid effective date." }),

    is_current: z.boolean().default(true),
});

// ─── Step 6: Work Experience ──────────────────────────────────────────────────

export const workExperienceEntrySchema = z
    .object({
        company_name: optionalString(255, "Company name"),
        position:     optionalString(255, "Position"),
        department:   optionalString(255, "Department"),

        start_date: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid start date." }),

        end_date: z
            .string()
            .optional()
            .nullable()
            .or(z.literal(""))
            .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid end date." }),

        years_of_service: z.coerce
            .number()
            .min(0, "Years of service must be 0 or more.")
            .optional()
            .nullable()
            .or(z.literal("")),

        remarks: z.string().optional().nullable().or(z.literal("")),
    })
    .refine(
        (data) => {
            if (data.start_date && data.end_date) {
                return new Date(data.end_date) >= new Date(data.start_date);
            }
            return true;
        },
        {
            message: "End date must be on or after the start date.",
            path: ["end_date"],
        }
    );

export const workExperienceSchema = z.object({
    work_experiences: z.array(workExperienceEntrySchema).optional().default([]),
});

// ─── Step 7: Emergency Contacts ───────────────────────────────────────────────

export const emergencyContactEntrySchema = z.object({
    contact_person_name:         optionalString(255, "Contact person name"),
    contact_person_relationship: optionalString(100, "Relationship"),
    contact_person_phone:        optionalString(20,  "Phone"),
    contact_person_telephone:    optionalString(20,  "Telephone"),
    contact_person_address:      optionalString(500, "Address"),
});

export const emergencyContactSchema = z.object({
    emergency_contacts: z.array(emergencyContactEntrySchema).optional().default([]),
});

// ─── Full schema (wizard submit) ──────────────────────────────────────────────

export const employeeSchema = personalInfoSchema
    .merge(
        z.object({
            hired_date: z
                .string()
                .optional()
                .nullable()
                .or(z.literal(""))
                .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid hired date." }),

            regularization_date: z
                .string()
                .optional()
                .nullable()
                .or(z.literal(""))
                .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid regularization date." }),

            contract_date_from: z
                .string()
                .optional()
                .nullable()
                .or(z.literal(""))
                .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid contract start date." }),

            contract_date_to: z
                .string()
                .optional()
                .nullable()
                .or(z.literal(""))
                .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid contract end date." }),

            contract_status: z
                .enum(["valid", "expired", "renewed", "terminated", ""])
                .optional()
                .nullable(),

            employment_type: z
                .enum(["probationary", "regular", "project_based", "contractual", "reliever", "part_time", "intern", ""])
                .optional()
                .nullable(),

            status: z
                .enum(["active", "inactive", "on_leave", "terminated", "resigned", "retired", "contract_end", ""])
                .optional()
                .nullable(),

            company_id:    z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
            branch_id:     z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
            department_id: z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
            position_id:   z.coerce.number().int().positive().optional().nullable().or(z.literal("")),

            job_level: z
                .string()
                .max(50, "Job level must be at most 50 characters.")
                .optional()
                .nullable()
                .or(z.literal("")),

            probationary_period_months: z.coerce
                .number()
                .int("Probationary period must be a whole number.")
                .min(0, "Probationary period must be 0 or more.")
                .max(24, "Probationary period must be 24 months or less.")
                .optional()
                .nullable()
                .or(z.literal("")),

            probationary_evaluation_date: z
                .string()
                .optional()
                .nullable()
                .or(z.literal(""))
                .refine((v) => !v || !isNaN(new Date(v)), { message: "Please enter a valid probationary evaluation date." }),
        })
    )
    .merge(govIdsSchema)
    .merge(bankAccountSchema)
    .merge(compensationSchema)
    .merge(workExperienceSchema)
    .merge(emergencyContactSchema)
    .refine(
        (data) => {
            if (data.contract_date_from && data.contract_date_to) {
                return new Date(data.contract_date_to) >= new Date(data.contract_date_from);
            }
            return true;
        },
        {
            message: "Contract end date must be on or after the start date.",
            path: ["contract_date_to"],
        }
    );