// resources/js/Pages/Employees/bulkUploadConfig.js

export const REQUIRED = ["employee_number", "first_name", "last_name"];

export const DATE_KEYS = [
    "birth_date", "hired_date", "regularization_date",
    "contract_date_from", "contract_date_to",
    "probationary_evaluation_date", "effective_date",
];

export const NUM_KEYS = [
    "probationary_period_months", "monthly_rate", "daily_rate", "hourly_rate",
];

export const CELL_OPTIONS = {
    gender:            ["Male", "Female"],
    civil_status:      ["Single", "Married", "Divorced", "Widowed"],
    employment_type:   ["probationary", "regular", "project_based", "contractual", "reliever", "part_time", "intern"],
    status:            ["active", "inactive", "on_leave", "terminated", "resigned", "retired", "contract_end"],
    contract_status:   ["valid", "expired", "renewed", "terminated"],
    job_level:         ["Junior", "Mid-level", "Senior", "Lead", "Manager", "Director"],
    sss_status:        ["for_verification", "verified", "no_sss"],
    pagibig_status:    ["for_verification", "verified", "no_pagibig"],
    philhealth_status: ["for_verification", "verified", "no_philhealth"],
    tin_status:        ["for_verification", "verified", "no_tin"],
    atm_status:        ["pending", "released", "active", "inactive"],
    payroll_type:      ["monthly", "semi_monthly", "weekly", "daily", "hourly"],
    salary_type:       ["monthly_rate", "semi_monthly_rate", "weekly_rate", "daily_rate", "hourly_rate"],
};

export const FK_COLS = ["company_id", "branch_id", "department_id", "position_id"];

// work_time_factor_id is handled separately (dynamic FK, not in FK_COLS)
export const COMPENSATION_RATE_KEYS = ["monthly_rate", "daily_rate", "hourly_rate"];

export const TABS = [
    {
        id: "personal",
        label: "Personal Info",
        icon: "👤",
        cols: ["employee_number", "first_name", "middle_name", "last_name", "suffix",
               "birth_date", "gender", "civil_status", "nationality", "email", "phone_number"],
    },
    {
        id: "employment",
        label: "Employment",
        icon: "💼",
        cols: ["employment_type", "status", "hired_date", "regularization_date",
               "contract_date_from", "contract_date_to", "contract_status", "job_level"],
    },
    {
        id: "assignment",
        label: "Assignment",
        icon: "🏢",
        cols: ["company_id", "branch_id", "department_id", "position_id", "probationary_period_months"],
    },
    {
        id: "gov_ids",
        label: "Gov IDs",
        icon: "🪪",
        cols: ["sss_number", "sss_status", "pagibig_number", "pagibig_status",
               "philhealth_number", "philhealth_status", "tin_number", "tin_status"],
    },
    {
        id: "bank",
        label: "Bank",
        icon: "🏦",
        cols: ["bank_name", "account_name", "account_number", "atm_card_number",
               "atm_status", "gcash_account_number", "gcash_account_name"],
    },
    {
        id: "compensation",
        label: "Compensation",
        icon: "💰",
        special: "compensation",
    },
    {
        id: "work_experience",
        label: "Work Experience",
        icon: "📋",
        special: "work_experience",
    },
    {
        id: "emergency_contacts",
        label: "Emergency Contacts",
        icon: "🆘",
        special: "emergency_contacts",
    },
];