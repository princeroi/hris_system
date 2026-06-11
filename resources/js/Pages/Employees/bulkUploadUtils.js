// resources/js/Pages/Employees/bulkUploadUtils.js

import { REQUIRED, DATE_KEYS, NUM_KEYS, CELL_OPTIONS, FK_COLS } from "./bulkUploadConfig";

// ── Date parser ───────────────────────────────────────────────────────────────
export const parseDate = (val) => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    const s = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
};

// ── Gov ID formatter (mirrors GovIdCell logic, used for Excel imports) ────────
const GOV_ID_FORMATS = {
    sss_number:        { groups: [2, 7, 1] },
    pagibig_number:    { groups: [4, 4, 4] },
    philhealth_number: { groups: [2, 9, 1] },
    tin_number:        { groups: [3, 3, 3, 3] },
};

function formatGovId(val, col) {
    if (!val) return val;
    const fmt    = GOV_ID_FORMATS[col];
    if (!fmt)    return val;
    const digits = String(val).replace(/\D/g, "");
    if (!digits) return val;

    // For TIN: if only 9 digits, use first 3 groups only
    const groups = (col === "tin_number" && digits.length <= 9)
        ? fmt.groups.slice(0, 3)
        : fmt.groups;

    let result = "";
    let pos    = 0;
    groups.forEach((len, gi) => {
        if (pos >= digits.length) return;
        if (gi > 0) result += "-";
        result += digits.slice(pos, pos + len);
        pos += len;
    });
    return result;
}

// ── Row parser — normalises dates, numbers, and gov IDs from raw Excel data ───
export function parseRow(raw) {
    const row = { ...raw };
    DATE_KEYS.forEach(k => { if (k in row) row[k] = parseDate(row[k]); });
    NUM_KEYS.forEach(k => { if (row[k] !== undefined && row[k] !== "") row[k] = Number(row[k]) || ""; });
    // Auto-format gov ID numbers (Excel may have raw digits or existing dashes)
    Object.keys(GOV_ID_FORMATS).forEach(k => {
        if (k in row && row[k] !== "" && row[k] !== null && row[k] !== undefined)
            row[k] = formatGovId(row[k], k);
    });
    return row;
}

// ── Smart defaults ────────────────────────────────────────────────────────────
/**
 * Applies smart default logic for gov ID statuses and ATM status.
 * Called after parseRow (on Excel import) and after any cell update in BulkUpload.
 *
 * Gov ID status rules:
 *   - number blank  → default to no_<id>  (regardless of what status says)
 *   - number filled + status blank → default to "for_verification"
 *   - number filled + status filled → keep the status from Excel / user input
 *
 * ATM status rules:
 *   - blank → default to "pending"
 *   - filled → keep as-is
 */
export function applyRowDefaults(row) {
    const r = { ...row };

    const GOV_IDS = [
        { num: "sss_number",        status: "sss_status",        noVal: "no_sss"        },
        { num: "pagibig_number",    status: "pagibig_status",    noVal: "no_pagibig"    },
        { num: "philhealth_number", status: "philhealth_status", noVal: "no_philhealth" },
        { num: "tin_number",        status: "tin_status",        noVal: "no_tin"        },
    ];

    GOV_IDS.forEach(({ num, status, noVal }) => {
        const hasNumber = !isBlank(r[num]) && String(r[num]).trim() !== "";
        const currentStatus = String(r[status] ?? "").trim();

        if (!hasNumber) {
            // Number blank/cleared → always force to no_*
            r[status] = noVal;
        } else if (currentStatus === noVal || isBlank(r[status])) {
            // Number just filled in and status is still no_* or blank → for_verification
            r[status] = "for_verification";
        }
        // Status is already "for_verification" or "verified" → leave it alone
    });

    if (isBlank(r.atm_status) || String(r.atm_status).trim() === "") {
        r.atm_status = "pending";
    }

    return r;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const isBlank  = (v) => v === "" || v === null || v === undefined;
const isDate   = (v) => !isBlank(v) && !isNaN(new Date(v));
const parseD   = (v) => new Date(v);

// ── Row validator ─────────────────────────────────────────────────────────────
/**
 * Returns { fieldErrors: Record<string, string[]>, rowErrors: string[] }
 *
 * @param {object}   row              - The row data object
 * @param {object[]} allRows          - All rows in the current upload (for duplicate detection)
 * @param {number}   currentIndex     - Index of this row in allRows
 * @param {Set}      existingNumbers  - Set<string> of employee_numbers already in the DB (lowercased)
 * @param {object}   fkOptions        - { company_id: [{value, label}], branch_id: [...], ... }
 */
export function validateRow(
    row,
    allRows,
    currentIndex,
    existingNumbers = new Set(),
    fkOptions       = {}
) {
    const fieldErrors = {}; // col → string[]
    const rowErrors   = []; // row-level messages not tied to a single field

    const addField = (col, msg) => {
        if (!fieldErrors[col]) fieldErrors[col] = [];
        fieldErrors[col].push(msg);
    };

    // ── Required fields ───────────────────────────────────────────────────────
    REQUIRED.forEach(k => {
        if (!row[k] && row[k] !== 0)
            addField(k, `${colLabel(k)} is required`);
    });

    // ── Employee fields ───────────────────────────────────────────────────────
    if (!isBlank(row.employee_number) && String(row.employee_number).length > 50)
        addField("employee_number", "Employee number must be 50 characters or less");

    if (!isBlank(row.first_name) && String(row.first_name).length > 255)
        addField("first_name", "First name must be 255 characters or less");

    if (!isBlank(row.middle_name) && String(row.middle_name).length > 255)
        addField("middle_name", "Middle name must be 255 characters or less");

    if (!isBlank(row.last_name) && String(row.last_name).length > 255)
        addField("last_name", "Last name must be 255 characters or less");

    if (!isBlank(row.suffix) && String(row.suffix).length > 50)
        addField("suffix", "Suffix must be 50 characters or less");

    // ── Personal Info ─────────────────────────────────────────────────────────

    if (!isBlank(row.birth_date) && !isDate(row.birth_date))
        addField("birth_date", "Please enter a valid birth date");

    if (!isBlank(row.birth_place) && String(row.birth_place).length > 255)
        addField("birth_place", "Birth place must be 255 characters or less");

    if (!isBlank(row.age)) {
        const age = Number(row.age);
        if (!Number.isInteger(age))  addField("age", "Age must be a whole number");
        else if (age < 0)            addField("age", "Age must be 0 or more");
        else if (age > 150)          addField("age", "Age must be 150 or less");
    }

    if (!isBlank(row.gender) && !["Male", "Female"].includes(row.gender))
        addField("gender", "Gender must be Male or Female");

    if (!isBlank(row.civil_status) && !["Single", "Married", "Divorced", "Widowed"].includes(row.civil_status))
        addField("civil_status", "Invalid civil status");

    if (!isBlank(row.nationality) && String(row.nationality).length > 100)
        addField("nationality", "Nationality must be 100 characters or less");

    if (!isBlank(row.religion) && String(row.religion).length > 100)
        addField("religion", "Religion must be 100 characters or less");

    if (!isBlank(row.home_address) && String(row.home_address).length > 500)
        addField("home_address", "Home address must be 500 characters or less");

    if (!isBlank(row.current_address) && String(row.current_address).length > 500)
        addField("current_address", "Current address must be 500 characters or less");

    if (!isBlank(row.phone_number) && String(row.phone_number).length > 20)
        addField("phone_number", "Phone number must be 20 characters or less");

    if (!isBlank(row.telephone_number) && String(row.telephone_number).length > 20)
        addField("telephone_number", "Telephone number must be 20 characters or less");

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isBlank(row.email)) {
        if (String(row.email).length > 255)
            addField("email", "Email must be 255 characters or less");
        else if (!emailRe.test(row.email))
            addField("email", "Invalid email address");
    }

    if (!isBlank(row.alternate_email)) {
        if (String(row.alternate_email).length > 255)
            addField("alternate_email", "Alternate email must be 255 characters or less");
        else if (!emailRe.test(row.alternate_email))
            addField("alternate_email", "Invalid alternate email address");
    }

    if (!isBlank(row.highest_education) && String(row.highest_education).length > 100)
        addField("highest_education", "Highest education must be 100 characters or less");

    if (!isBlank(row.course) && String(row.course).length > 100)
        addField("course", "Course must be 100 characters or less");

    if (!isBlank(row.school) && String(row.school).length > 255)
        addField("school", "School must be 255 characters or less");

    // age cross-check from birth_date
    if (isDate(row.birth_date)) {
        const birth = parseD(row.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18) addField("birth_date", "Employee must be at least 18 years old");
    }

    // ── Employment Details ────────────────────────────────────────────────────

    if (!isBlank(row.hired_date) && !isDate(row.hired_date))
        addField("hired_date", "Please enter a valid hired date");

    if (!isBlank(row.regularization_date) && !isDate(row.regularization_date))
        addField("regularization_date", "Please enter a valid regularization date");

    if (!isBlank(row.contract_date_from) && !isDate(row.contract_date_from))
        addField("contract_date_from", "Please enter a valid contract start date");

    if (!isBlank(row.contract_date_to) && !isDate(row.contract_date_to))
        addField("contract_date_to", "Please enter a valid contract end date");

    if (isDate(row.contract_date_from) && isDate(row.contract_date_to) &&
        parseD(row.contract_date_to) < parseD(row.contract_date_from))
        addField("contract_date_to", "Contract end date must be on or after the start date");

    if (!isBlank(row.contract_status) && String(row.contract_status).length > 50)
        addField("contract_status", "Contract status must be 50 characters or less");

    if (!isBlank(row.employment_type) && String(row.employment_type).length > 50)
        addField("employment_type", "Employment type must be 50 characters or less");

    if (!isBlank(row.status) && String(row.status).length > 50)
        addField("status", "Status must be 50 characters or less");

    if (!isBlank(row.job_level) && String(row.job_level).length > 50)
        addField("job_level", "Job level must be 50 characters or less");

    if (!isBlank(row.probationary_period_months)) {
        const v = Number(row.probationary_period_months);
        if (!Number.isInteger(v))  addField("probationary_period_months", "Probationary period must be a whole number");
        else if (v < 0)            addField("probationary_period_months", "Probationary period must be 0 or more");
        else if (v > 24)           addField("probationary_period_months", "Probationary period must be 24 months or less");
    }

    if (!isBlank(row.probationary_evaluation_date) && !isDate(row.probationary_evaluation_date))
        addField("probationary_evaluation_date", "Please enter a valid probationary evaluation date");

    // ── Gov IDs ───────────────────────────────────────────────────────────────
    // Format rules (dashes are part of the stored value after GovIdCell formats it;
    // we also accept raw digits so Excel imports without dashes still validate):
    //   SSS        → XX-XXXXXXX-X        (10 digits)
    //   Pag-IBIG   → XXXX-XXXX-XXXX      (12 digits)
    //   PhilHealth → XX-XXXXXXXXX-X      (12 digits)
    //   TIN        → XXX-XXX-XXX[-XXX]   (9 or 12 digits)

    const GOV_ID_FIELDS = [
        {
            num:     "sss_number",
            status:  "sss_status",
            label:   "SSS",
            allowed: ["no_sss", "for_verification", "verified"],
            // Accept with or without dashes: 10 digits total
            regex:   /^\d{2}-?\d{7}-?\d{1}$|^\d{10}$/,
            hint:    "XX-XXXXXXX-X (10 digits)",
        },
        {
            num:     "pagibig_number",
            status:  "pagibig_status",
            label:   "Pag-IBIG",
            allowed: ["no_pagibig", "for_verification", "verified"],
            // 12 digits: XXXX-XXXX-XXXX
            regex:   /^\d{4}-?\d{4}-?\d{4}$|^\d{12}$/,
            hint:    "XXXX-XXXX-XXXX (12 digits)",
        },
        {
            num:     "philhealth_number",
            status:  "philhealth_status",
            label:   "PhilHealth",
            allowed: ["no_philhealth", "for_verification", "verified"],
            // 12 digits: XX-XXXXXXXXX-X
            regex:   /^\d{2}-?\d{9}-?\d{1}$|^\d{12}$/,
            hint:    "XX-XXXXXXXXX-X (12 digits)",
        },
        {
            num:     "tin_number",
            status:  "tin_status",
            label:   "TIN",
            allowed: ["no_tin", "for_verification", "verified"],
            // 9 digits: XXX-XXX-XXX  or  12 digits: XXX-XXX-XXX-XXX
            regex:   /^\d{3}-?\d{3}-?\d{3}$|^\d{3}-?\d{3}-?\d{3}-?\d{3}$|^\d{9}$|^\d{12}$/,
            hint:    "XXX-XXX-XXX (9 digits) or XXX-XXX-XXX-XXX (12 digits)",
        },
    ];

    GOV_ID_FIELDS.forEach(({ num, status, label, allowed, regex, hint }) => {
        if (!isBlank(row[num])) {
            const val = String(row[num]).trim();
            if (!regex.test(val))
                addField(num, `Invalid ${label} format — expected ${hint}`);
        }

        // Status is always set by applyRowDefaults, so validate it's a valid enum
        if (!isBlank(row[status]) && !allowed.includes(String(row[status])))
            addField(status, `Invalid ${label} status. Allowed: ${allowed.join(", ")}`);
    });

    // ── Bank Account ──────────────────────────────────────────────────────────

    const BANK_FIELDS_255 = [
        "bank_name", "account_name", "account_number", "atm_card_number",
        "gcash_account_number", "gcash_account_name",
        "other_bank_type", "other_bank_name", "other_account_number", "other_account_name",
    ];
    BANK_FIELDS_255.forEach(f => {
        if (!isBlank(row[f]) && String(row[f]).length > 255)
            addField(f, `${colLabel(f)} must be 255 characters or less`);
    });
    // Account numbers must be digits only
    const NUMERIC_ACCOUNT_FIELDS = ["account_number", "atm_card_number", "gcash_account_number", "other_account_number"];
    NUMERIC_ACCOUNT_FIELDS.forEach(f => {
        if (!isBlank(row[f]) && !/^\d+$/.test(String(row[f]).trim()))
            addField(f, `${colLabel(f)} must contain numbers only`);
    });

    if (!isBlank(row.atm_status) && !["pending", "released", "active", "inactive"].includes(String(row.atm_status)))
        addField("atm_status", "Invalid ATM status. Allowed: pending, released, active, inactive");

    if (!isBlank(row.atm_status) && !["pending", "released", "active", "inactive"].includes(String(row.atm_status)))
        addField("atm_status", "Invalid ATM status. Allowed: pending, released, active, inactive");

    // ── Compensation ──────────────────────────────────────────────────────────

    ["monthly_rate", "daily_rate", "hourly_rate"].forEach(k => {
        if (!isBlank(row[k])) {
            const v = Number(row[k]);
            if (isNaN(v))   addField(k, `${colLabel(k)} must be a valid number`);
            else if (v < 0) addField(k, `${colLabel(k)} must be 0 or more`);
        }
    });

    const PAYROLL_TYPES = ["monthly", "semi_monthly", "weekly", "daily", "hourly"];
    if (!isBlank(row.payroll_type) && !PAYROLL_TYPES.includes(String(row.payroll_type)))
        addField("payroll_type", `Invalid payroll type. Allowed: ${PAYROLL_TYPES.join(", ")}`);

    const SALARY_TYPES = ["hourly_rate", "daily_rate", "weekly_rate", "semi_monthly_rate", "monthly_rate"];
    if (!isBlank(row.salary_type) && !SALARY_TYPES.includes(String(row.salary_type)))
        addField("salary_type", `Invalid salary type. Allowed: ${SALARY_TYPES.join(", ")}`);

    if (!isBlank(row.effective_date) && !isDate(row.effective_date))
        addField("effective_date", "Please enter a valid effective date");

    // ── CELL_OPTIONS enum validation ──────────────────────────────────────────
    Object.entries(CELL_OPTIONS).forEach(([col, allowed]) => {
        if (isBlank(row[col])) return;
        // Skip cols already validated with custom messages above
        if (["gender", "civil_status", "atm_status",
             "sss_status", "pagibig_status", "philhealth_status", "tin_status",
             "payroll_type", "salary_type"].includes(col)) return;
        if (!allowed.includes(String(row[col])))
            addField(col, `"${row[col]}" is not a valid option. Allowed: ${allowed.join(", ")}`);
    });

    // ── FK column validation ──────────────────────────────────────────────────
    FK_COLS.forEach(col => {
        if (isBlank(row[col])) return;
        const options = fkOptions[col] ?? [];
        if (options.length === 0) return;
        if (!options.some(opt => String(opt.value) === String(row[col])))
            addField(col, `Selected ${col.replace(/_id$/, "")} does not exist in the system`);
    });

    // ── Employee number — DB conflict & cross-row duplicate ───────────────────
    if (row.employee_number) {
        const empNum = String(row.employee_number).trim().toLowerCase();

        if (existingNumbers.has(empNum))
            addField("employee_number", `"${row.employee_number}" already exists in the system`);

        if (allRows) {
            const fullName = [row.first_name, row.middle_name, row.last_name]
                .map(s => String(s ?? "").trim().toLowerCase()).join("|");

            allRows.forEach((other, oi) => {
                if (oi === currentIndex) return;
                const otherNum  = String(other.employee_number ?? "").trim().toLowerCase();
                const otherName = [other.first_name, other.middle_name, other.last_name]
                    .map(s => String(s ?? "").trim().toLowerCase()).join("|");

                const sameId   = empNum   === otherNum  && empNum   !== "";
                const sameName = fullName === otherName && fullName !== "||";

                if (sameId && sameName)
                    rowErrors.push(`Duplicate of row ${oi + 1} — same employee number and name`);
                else if (sameId && !sameName)
                    rowErrors.push(`Employee number conflicts with row ${oi + 1} — same ID, different name`);
            });
        }
    }

    // ── Work experience sub-row validation ────────────────────────────────────
    (row.work_experiences ?? []).forEach((exp, ei) => {
        const prefix = `work_experiences[${ei}]`;

        if (!isBlank(exp.company_name) && String(exp.company_name).length > 255)
            addField(prefix + ".company_name", `Entry ${ei + 1}: Company name must be 255 characters or less`);

        if (!isBlank(exp.position) && String(exp.position).length > 255)
            addField(prefix + ".position", `Entry ${ei + 1}: Position must be 255 characters or less`);

        if (!isBlank(exp.department) && String(exp.department).length > 255)
            addField(prefix + ".department", `Entry ${ei + 1}: Department must be 255 characters or less`);

        if (!isBlank(exp.start_date) && !isDate(exp.start_date))
            addField(prefix + ".start_date", `Entry ${ei + 1}: Please enter a valid start date`);

        if (!isBlank(exp.end_date) && !isDate(exp.end_date))
            addField(prefix + ".end_date", `Entry ${ei + 1}: Please enter a valid end date`);

        if (isDate(exp.start_date) && isDate(exp.end_date) &&
            parseD(exp.end_date) < parseD(exp.start_date))
            addField(prefix + ".end_date", `Entry ${ei + 1}: End date must be on or after the start date`);

        if (!isBlank(exp.years_of_service)) {
            const v = Number(exp.years_of_service);
            if (isNaN(v) || v < 0)
                addField(prefix + ".years_of_service", `Entry ${ei + 1}: Years of service must be a valid number (0 or more)`);
        }
    });

    // ── Emergency contact sub-row validation ──────────────────────────────────
    (row.emergency_contacts ?? []).forEach((c, ci) => {
        const prefix = `emergency_contacts[${ci}]`;

        if (!isBlank(c.contact_person_name) && String(c.contact_person_name).length > 255)
            addField(prefix + ".contact_person_name", `Contact ${ci + 1}: Name must be 255 characters or less`);

        if (!isBlank(c.contact_person_relationship) && String(c.contact_person_relationship).length > 100)
            addField(prefix + ".contact_person_relationship", `Contact ${ci + 1}: Relationship must be 100 characters or less`);

        if (!isBlank(c.contact_person_phone) && String(c.contact_person_phone).length > 20)
            addField(prefix + ".contact_person_phone", `Contact ${ci + 1}: Phone must be 20 characters or less`);

        if (!isBlank(c.contact_person_telephone) && String(c.contact_person_telephone).length > 20)
            addField(prefix + ".contact_person_telephone", `Contact ${ci + 1}: Telephone must be 20 characters or less`);

        if (!isBlank(c.contact_person_address) && String(c.contact_person_address).length > 500)
            addField(prefix + ".contact_person_address", `Contact ${ci + 1}: Address must be 500 characters or less`);
    });

    return { fieldErrors, rowErrors };
}

// ── Flat helper — collapses { fieldErrors, rowErrors } into a string[] ────────
export function flatErrors({ fieldErrors, rowErrors }) {
    return [...Object.values(fieldErrors).flat(), ...rowErrors];
}

// ── Empty-row factory ─────────────────────────────────────────────────────────
// Gov ID statuses default to no_* because numbers start blank.
// ATM status defaults to "pending".
export const emptyWorkExp = () => ({
    company_name: "", position: "", department: "",
    start_date: "", end_date: "", years_of_service: "", remarks: "",
});

export const emptyContact = () => ({
    contact_person_name: "", contact_person_relationship: "",
    contact_person_phone: "", contact_person_telephone: "", contact_person_address: "",
});

export const emptyRow = () => ({
    employee_number: "", first_name: "", middle_name: "", last_name: "", suffix: "",
    birth_date: "", birth_place: "", age: "", gender: "", civil_status: "",
    nationality: "", religion: "", email: "", phone_number: "", telephone_number: "",
    alternate_email: "", home_address: "", current_address: "",
    highest_education: "", course: "", school: "",
    employment_type: "", status: "active", hired_date: "", regularization_date: "",
    contract_date_from: "", contract_date_to: "", contract_status: "", job_level: "",
    company_id: "", branch_id: "", department_id: "", position_id: "",
    probationary_period_months: "", probationary_evaluation_date: "",
    // Gov IDs: no number yet → no_* status
    sss_number: "",        sss_status: "no_sss",        sss_remarks: "",
    pagibig_number: "",    pagibig_status: "no_pagibig",    pagibig_remarks: "",
    philhealth_number: "", philhealth_status: "no_philhealth", philhealth_remarks: "",
    tin_number: "",        tin_status: "no_tin",        tin_remarks: "",
    // Bank
    bank_name: "", account_name: "", account_number: "", atm_card_number: "",
    atm_status: "pending", gcash_account_number: "", gcash_account_name: "",
    other_bank_type: "", other_bank_name: "", other_account_number: "", other_account_name: "",
    // Compensation
    monthly_rate: "", daily_rate: "", hourly_rate: "", payroll_type: "",
    salary_type: "", effective_date: "", is_current: true,
    work_experiences: [],
    emergency_contacts: [],
});

// ── Column label formatter ────────────────────────────────────────────────────
export const colLabel = (col) =>
    col.replace(/_id$/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());