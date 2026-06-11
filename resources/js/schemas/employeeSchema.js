import { z } from "zod";

const optionalString = (max, label) =>
    z.string()
        .max(max, `${label} must be at most ${max} characters`)
        .optional()
        .nullable()
        .or(z.literal(""));

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

    birth_date: z.string()
        .optional()
        .nullable()
        .or(z.literal(""))
        .refine((val) => {
            if (!val) return true; 
            const birth = new Date(val);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
            return age >= 18;
        }, { message: "Employee must be at least 18 years old." }),
    birth_place:       optionalString(255, "Birth place"),
    age:               z.coerce.number().int().min(0).max(150).optional().nullable().or(z.literal("")),
    gender:            z.enum(["Male", "Female", ""]).optional().nullable(),
    civil_status:      z.enum(["Single", "Married", "Divorced", "Widowed", ""]).optional().nullable(),
    nationality:       optionalString(100, "Nationality"),
    religion:          optionalString(100, "Religion"),
    home_address:      optionalString(500, "Home address"),
    current_address:   optionalString(500, "Current address"),
    phone_number:      optionalString(20, "Phone number"),
    telephone_number:  optionalString(20, "Telephone number"),
    email:             z.string().email("Invalid email address.").optional().nullable().or(z.literal("")),
    alternate_email:   z.string().email("Invalid alternate email address.").optional().nullable().or(z.literal("")),
    highest_education: optionalString(100, "Highest education"),
    course:            optionalString(100, "Course"),
    school:            optionalString(255, "School"),
});

// ─── Step 2: Employment Details ───────────────────────────────────────────────

export const employmentDetailsSchema = z.object({
    hired_date:                   z.string().optional().nullable().or(z.literal("")),
    regularization_date:          z.string().optional().nullable().or(z.literal("")),
    contract_date_from:           z.string().optional().nullable().or(z.literal("")),
    contract_date_to:             z.string().optional().nullable().or(z.literal("")),
    contract_status:              optionalString(50, "Contract status"),
    employment_type:              optionalString(50, "Employment type"),
    status:                       optionalString(50, "Status"),
    company_id:                   z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
    branch_id:                    z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
    department_id:                z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
    position_id:                  z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
    job_level:                    optionalString(50, "Job level"),
    probationary_period_months:   z.coerce.number().int().min(0).max(24).optional().nullable().or(z.literal("")),
    probationary_evaluation_date: z.string().optional().nullable().or(z.literal("")),
}).refine(
    (data) => {
        if (data.contract_date_from && data.contract_date_to) {
            return data.contract_date_to >= data.contract_date_from;
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
    sss_number:          optionalString(50, "SSS number"),
    // NOT nullable in DB, has default 'for_verification'
    sss_status:          z.enum(["no_sss", "for_verification", "verified"]),
    sss_remarks:         z.string().optional().nullable().or(z.literal("")),

    pagibig_number:      optionalString(50, "Pag-IBIG number"),
    pagibig_status:      z.enum(["no_pagibig", "for_verification", "verified"]),
    pagibig_remarks:     z.string().optional().nullable().or(z.literal("")),

    philhealth_number:   optionalString(50, "PhilHealth number"),
    philhealth_status:   z.enum(["no_philhealth", "for_verification", "verified"]),
    philhealth_remarks:  z.string().optional().nullable().or(z.literal("")),

    tin_number:          optionalString(50, "TIN"),
    tin_status:          z.enum(["no_tin", "for_verification", "verified"]),
    tin_remarks:         z.string().optional().nullable().or(z.literal("")),
});

// ─── Step 4: Bank Account ─────────────────────────────────────────────────────

export const bankAccountSchema = z.object({
    bank_name:            optionalString(255, "Bank name"),
    account_number:       optionalString(255, "Account number"),
    account_name:         optionalString(255, "Account name"),
    atm_card_number:      optionalString(255, "ATM card number"),
    // NOT nullable in DB, has default 'active'
    atm_status:           z.enum(["pending", "released", "active", "inactive"]).default("active"),
    gcash_account_number: optionalString(255, "GCash account number"),
    gcash_account_name:   optionalString(255, "GCash account name"),
    other_bank_type:      optionalString(255, "Other bank type"),
    other_bank_name:      optionalString(255, "Other bank name"),
    other_account_number: optionalString(255, "Other account number"),
    other_account_name:   optionalString(255, "Other account name"),
});

// ─── Step 5: Compensation ─────────────────────────────────────────────────────

export const compensationSchema = z.object({
    work_time_factor_id: z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
    monthly_rate:        z.coerce.number().min(0, "Monthly rate must be 0 or more.").optional().nullable().or(z.literal("")),
    daily_rate:          z.coerce.number().min(0, "Daily rate must be 0 or more.").optional().nullable().or(z.literal("")),
    hourly_rate:         z.coerce.number().min(0, "Hourly rate must be 0 or more.").optional().nullable().or(z.literal("")),
    payroll_type:        z.enum(["monthly", "semi_monthly", "weekly", "daily", "hourly", ""]).optional().nullable(),
    salary_type:         z.enum(["hourly_rate", "daily_rate", "weekly_rate", "semi_monthly_rate", "monthly_rate", ""]).optional().nullable(),
    effective_date:      z.string().optional().nullable().or(z.literal("")),
    is_current:          z.boolean().default(true),
});

// ─── Step 6: Work Experience ──────────────────────────────────────────────────

export const workExperienceEntrySchema = z.object({
    company_name:     optionalString(255, "Company name"),
    position:         optionalString(255, "Position"),
    department:       optionalString(255, "Department"),
    start_date:       z.string().optional().nullable().or(z.literal("")),
    end_date:         z.string().optional().nullable().or(z.literal("")),
    years_of_service: z.coerce.number().min(0, "Years of service must be 0 or more.").optional().nullable().or(z.literal("")),
    remarks:          z.string().optional().nullable().or(z.literal("")),
}).refine(
    (data) => {
        if (data.start_date && data.end_date) {
            return data.end_date >= data.start_date;
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

// ─── Full schema ──────────────────────────────────────────────────────────────

export const employeeSchema = personalInfoSchema
    .merge(z.object({
        hired_date:                   z.string().optional().nullable().or(z.literal("")),
        regularization_date:          z.string().optional().nullable().or(z.literal("")),
        contract_date_from:           z.string().optional().nullable().or(z.literal("")),
        contract_date_to:             z.string().optional().nullable().or(z.literal("")),
        contract_status:              optionalString(50, "Contract status"),
        employment_type:              optionalString(50, "Employment type"),
        status:                       optionalString(50, "Status"),
        company_id:                   z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        branch_id:                    z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        department_id:                z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        position_id:                  z.coerce.number().int().positive().optional().nullable().or(z.literal("")),
        job_level:                    optionalString(50, "Job level"),
        probationary_period_months:   z.coerce.number().int().min(0).max(24).optional().nullable().or(z.literal("")),
        probationary_evaluation_date: z.string().optional().nullable().or(z.literal("")),
    }))
    .merge(govIdsSchema)
    .merge(bankAccountSchema)
    .merge(compensationSchema)
    .merge(workExperienceSchema) 
    .merge(emergencyContactSchema)
    .refine(
        (data) => {
            if (data.contract_date_from && data.contract_date_to) {
                return data.contract_date_to >= data.contract_date_from;
            }
            return true;
        },
        {
            message: "Contract end date must be on or after the start date.",
            path: ["contract_date_to"],
        }
    );