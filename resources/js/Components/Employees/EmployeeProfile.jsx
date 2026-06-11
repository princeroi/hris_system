// resources/js/Components/Employees/EmployeeProfile.jsx

import {
    User, Briefcase, Shield, CreditCard, DollarSign,
    Clock, Phone, MapPin, GraduationCap, AlertCircle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val) => (val === null || val === undefined || val === "") ? "—" : val;

const fmtDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
};

const fmtMoney = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    return Number(val).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const labelMap = {
    // Employment type
    probationary:   "Probationary",
    regular:        "Regular",
    project_based:  "Project-based",
    contractual:    "Contractual",
    reliever:       "Reliever",
    part_time:      "Part-time",
    intern:         "Intern",
    // Status
    active:         "Active",
    inactive:       "Inactive",
    on_leave:       "On Leave",
    terminated:     "Terminated",
    resigned:       "Resigned",
    retired:        "Retired",
    contract_end:   "Contract End",
    // Contract status
    valid:          "Valid",
    expired:        "Expired",
    renewed:        "Renewed",
    // Gov ID status
    no_sss:             "No SSS",
    for_verification:   "For Verification",
    verified:           "Verified",
    no_pagibig:         "No Pag-IBIG",
    no_philhealth:      "No PhilHealth",
    no_tin:             "No TIN",
    // ATM status
    pending:    "Pending",
    released:   "Released",
    // Payroll / salary type
    monthly:            "Monthly",
    semi_monthly:       "Semi-monthly",
    weekly:             "Weekly",
    daily:              "Daily",
    hourly:             "Hourly",
    hourly_rate:        "Hourly Rate",
    daily_rate:         "Daily Rate",
    weekly_rate:        "Weekly Rate",
    semi_monthly_rate:  "Semi-monthly Rate",
    monthly_rate:       "Monthly Rate",
};

const fmtLabel = (val) => (val && labelMap[val]) ? labelMap[val] : fmt(val);

// Status badge colours
const statusColors = {
    active:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive:     "bg-slate-100 text-slate-500 ring-slate-200",
    on_leave:     "bg-amber-50 text-amber-700 ring-amber-200",
    terminated:   "bg-red-50 text-red-600 ring-red-200",
    resigned:     "bg-orange-50 text-orange-700 ring-orange-200",
    retired:      "bg-purple-50 text-purple-700 ring-purple-200",
    contract_end: "bg-sky-50 text-sky-700 ring-sky-200",
};

const govIdStatusColors = {
    verified:           "bg-emerald-50 text-emerald-700 ring-emerald-200",
    for_verification:   "bg-amber-50 text-amber-700 ring-amber-200",
    no_sss:             "bg-slate-100 text-slate-500 ring-slate-200",
    no_pagibig:         "bg-slate-100 text-slate-500 ring-slate-200",
    no_philhealth:      "bg-slate-100 text-slate-500 ring-slate-200",
    no_tin:             "bg-slate-100 text-slate-500 ring-slate-200",
};

const atmStatusColors = {
    active:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending:  "bg-amber-50 text-amber-700 ring-amber-200",
    released: "bg-sky-50 text-sky-700 ring-sky-200",
    inactive: "bg-slate-100 text-slate-500 ring-slate-200",
};

function Badge({ value, colorMap }) {
    const classes = colorMap?.[value] ?? "bg-slate-100 text-slate-500 ring-slate-200";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ring-1 ${classes}`}>
            {fmtLabel(value)}
        </span>
    );
}

// ─── Layout primitives ────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
    return (
        <div>
            <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={15} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                    {title}
                </h3>
            </div>
            <div className="pl-9.5">
                {children}
            </div>
        </div>
    );
}

function Divider() {
    return <hr className="border-slate-100" />;
}

// Grid of label+value pairs
function InfoGrid({ cols = 3, items }) {
    const colClass = {
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
    }[cols] ?? "grid-cols-3";

    return (
        <div className={`grid ${colClass} gap-x-6 gap-y-4 pl-9`}>
            {items.map(({ label, value, badge, colorMap, span }) => (
                <div key={label} className={span === 2 ? "col-span-2" : ""}>
                    <p className="text-xs font-medium text-slate-400 mb-0.5 uppercase tracking-wide">{label}</p>
                    {badge
                        ? <Badge value={value} colorMap={colorMap} />
                        : <p className="text-sm font-medium text-slate-800">{fmt(value)}</p>
                    }
                </div>
            ))}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeProfile({
    employee,
    personalInfo,
    employmentDetails,
    govIds,
    bankAccount,
    compensation,
    workExperiences,
    emergencyContacts,
}) {
    const pi = personalInfo   ?? {};
    const ed = employmentDetails ?? {};
    const gi = govIds          ?? {};
    const ba = bankAccount     ?? {};
    const cp = compensation    ?? {};
    const we = workExperiences ?? [];
    const ec = emergencyContacts ?? [];

    return (
        <div className="space-y-8">

            {/* ── Step 1: Personal Information ─────────────────── */}
            <Section icon={User} title="Personal Information">
                {/* Employee number */}
                <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Employee No.</span>
                    <span className="text-sm font-bold text-slate-800">{fmt(employee?.employee_number)}</span>
                </div>

                {/* Name block */}
                <InfoGrid cols={4} items={[
                    { label: "First Name",   value: pi.first_name   ?? employee?.first_name },
                    { label: "Middle Name",  value: pi.middle_name  ?? employee?.middle_name },
                    { label: "Last Name",    value: pi.last_name    ?? employee?.last_name },
                    { label: "Suffix",       value: pi.suffix       ?? employee?.suffix },
                ]} />

                <div className="mt-5">
                    <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide pl-9">Personal Details</p>
                    <InfoGrid cols={3} items={[
                        { label: "Birth Date",    value: fmtDate(pi.birth_date) },
                        { label: "Age",           value: pi.age },
                        { label: "Birth Place",   value: pi.birth_place },
                        { label: "Gender",        value: pi.gender },
                        { label: "Civil Status",  value: pi.civil_status },
                        { label: "Nationality",   value: pi.nationality },
                        { label: "Religion",      value: pi.religion },
                    ]} />
                </div>
            </Section>

            <Divider />

            {/* ── Address ──────────────────────────────────────── */}
            <Section icon={MapPin} title="Address">
                <InfoGrid cols={2} items={[
                    { label: "Home Address",    value: pi.home_address,    span: 1 },
                    { label: "Current Address", value: pi.current_address, span: 1 },
                ]} />
            </Section>

            <Divider />

            {/* ── Contact ──────────────────────────────────────── */}
            <Section icon={Phone} title="Contact Information">
                <InfoGrid cols={2} items={[
                    { label: "Phone Number",     value: pi.phone_number },
                    { label: "Telephone Number", value: pi.telephone_number },
                    { label: "Email",            value: pi.email },
                    { label: "Alternate Email",  value: pi.alternate_email },
                ]} />
            </Section>

            <Divider />

            {/* ── Education ────────────────────────────────────── */}
            <Section icon={GraduationCap} title="Educational Background">
                <InfoGrid cols={3} items={[
                    { label: "Highest Education", value: pi.highest_education },
                    { label: "Course",            value: pi.course },
                    { label: "School",            value: pi.school },
                ]} />
            </Section>

            <Divider />

            {/* ── Step 2: Employment Details ────────────────────── */}
            <Section icon={Briefcase} title="Employment Details">
                <InfoGrid cols={3} items={[
                    { label: "Employment Type",  value: fmtLabel(ed.employment_type) },
                    { label: "Status",           value: ed.status,           badge: true, colorMap: statusColors },
                    { label: "Contract Status",  value: ed.contract_status,  badge: true, colorMap: {
                        valid:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
                        expired:    "bg-red-50 text-red-600 ring-red-200",
                        renewed:    "bg-sky-50 text-sky-700 ring-sky-200",
                        terminated: "bg-slate-100 text-slate-500 ring-slate-200",
                    }},
                ]} />

                <div className="mt-5">
                    <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide pl-9">Dates</p>
                    <InfoGrid cols={3} items={[
                        { label: "Hired Date",                value: fmtDate(ed.hired_date) },
                        { label: "Regularization Date",       value: fmtDate(ed.regularization_date) },
                        { label: "Contract Start",            value: fmtDate(ed.contract_date_from) },
                        { label: "Contract End",              value: fmtDate(ed.contract_date_to) },
                        { label: "Probationary Period",       value: ed.probationary_period_months ? `${ed.probationary_period_months} months` : "—" },
                        { label: "Evaluation Date",           value: fmtDate(ed.probationary_evaluation_date) },
                    ]} />
                </div>

                <div className="mt-5">
                    <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide pl-9">Assignment</p>
                    <InfoGrid cols={4} items={[
                        { label: "Company",    value: ed.company?.company_name     ?? ed.company_id   ?? "—" },
                        { label: "Branch",     value: ed.branch?.branch_name       ?? ed.branch_id    ?? "—" },
                        { label: "Department", value: ed.department?.department_name ?? ed.department_id ?? "—" },
                        { label: "Position",   value: ed.position?.position_name   ?? ed.position_id  ?? "—" },
                        { label: "Job Level",  value: ed.job_level },
                    ]} />
                </div>
            </Section>

            <Divider />

            {/* ── Step 3: Government IDs ────────────────────────── */}
            <Section icon={Shield} title="Government IDs">
                <div className="pl-9 space-y-4">
                    {[
                        { label: "SSS",        number: gi.sss_number,        status: gi.sss_status,        remarks: gi.sss_remarks },
                        { label: "Pag-IBIG",   number: gi.pagibig_number,    status: gi.pagibig_status,    remarks: gi.pagibig_remarks },
                        { label: "PhilHealth", number: gi.philhealth_number, status: gi.philhealth_status, remarks: gi.philhealth_remarks },
                        { label: "TIN",        number: gi.tin_number,        status: gi.tin_status,        remarks: gi.tin_remarks },
                    ].map(({ label, number, status, remarks }) => (
                        <div key={label} className="grid grid-cols-3 gap-x-6 items-start py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label} Number</p>
                                <p className="text-sm font-medium text-slate-800">{fmt(number)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Status</p>
                                <Badge value={status} colorMap={govIdStatusColors} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Remarks</p>
                                <p className="text-sm text-slate-600">{fmt(remarks)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Divider />

            {/* ── Step 4: Bank Account ──────────────────────────── */}
            <Section icon={CreditCard} title="Bank & Payment Accounts">
                {/* Primary Bank */}
                <div className="pl-9 space-y-5">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Primary Bank</p>
                        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                            {[
                                { label: "Bank Name",       value: ba.bank_name },
                                { label: "Account Name",    value: ba.account_name },
                                { label: "Account Number",  value: ba.account_number },
                                { label: "ATM Card Number", value: ba.atm_card_number },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                                    <p className="text-sm font-medium text-slate-800">{fmt(value)}</p>
                                </div>
                            ))}
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">ATM Status</p>
                                <Badge value={ba.atm_status} colorMap={atmStatusColors} />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">GCash</p>
                        <div className="grid grid-cols-2 gap-x-6">
                            {[
                                { label: "GCash Number", value: ba.gcash_account_number },
                                { label: "GCash Name",   value: ba.gcash_account_name },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                                    <p className="text-sm font-medium text-slate-800">{fmt(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Other Bank Account</p>
                        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                            {[
                                { label: "Bank Type",       value: ba.other_bank_type },
                                { label: "Bank Name",       value: ba.other_bank_name },
                                { label: "Account Number",  value: ba.other_account_number },
                                { label: "Account Name",    value: ba.other_account_name },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                                    <p className="text-sm font-medium text-slate-800">{fmt(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Divider />

            {/* ── Step 5: Compensation ──────────────────────────── */}
            <Section icon={DollarSign} title="Compensation">
                <div className="pl-9 space-y-5">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Monthly Rate</p>
                            <p className="text-sm font-semibold text-slate-800">₱ {fmtMoney(cp.monthly_rate)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Daily Rate</p>
                            <p className="text-sm font-semibold text-slate-800">₱ {fmtMoney(cp.daily_rate)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Hourly Rate</p>
                            <p className="text-sm font-semibold text-slate-800">₱ {fmtMoney(cp.hourly_rate)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Payroll Type</p>
                            <p className="text-sm font-medium text-slate-800">{fmtLabel(cp.payroll_type)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Salary Type</p>
                            <p className="text-sm font-medium text-slate-800">{fmtLabel(cp.salary_type)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Effective Date</p>
                            <p className="text-sm font-medium text-slate-800">{fmtDate(cp.effective_date)}</p>
                        </div>
                    </div>
                </div>
            </Section>

            <Divider />

            {/* ── Step 6: Work Experience ───────────────────────── */}
            <Section icon={Clock} title="Work Experience">
                <div className="pl-9">
                    {we.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-sm text-slate-400">No work experience on record.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {we.map((entry, i) => (
                                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {fmt(entry.company_name)}
                                        </p>
                                        {entry.years_of_service && (
                                            <span className="text-xs text-slate-400 font-medium">
                                                {entry.years_of_service} yr{entry.years_of_service !== 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Position</p>
                                            <p className="text-sm text-slate-700">{fmt(entry.position)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Department</p>
                                            <p className="text-sm text-slate-700">{fmt(entry.department)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Period</p>
                                            <p className="text-sm text-slate-700">
                                                {fmtDate(entry.start_date)} — {fmtDate(entry.end_date)}
                                            </p>
                                        </div>
                                        {entry.remarks && (
                                            <div className="col-span-3">
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Remarks</p>
                                                <p className="text-sm text-slate-600">{entry.remarks}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>

            <Divider />

            {/* ── Step 7: Emergency Contacts ────────────────────── */}
            <Section icon={AlertCircle} title="Emergency Contacts">
                <div className="pl-9">
                    {ec.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-sm text-slate-400">No emergency contacts on record.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ec.map((contact, i) => (
                                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">
                                        {fmt(contact.contact_person_name)}
                                        {contact.contact_person_relationship && (
                                            <span className="ml-2 text-xs font-normal text-slate-400">
                                                · {contact.contact_person_relationship}
                                            </span>
                                        )}
                                    </p>
                                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Phone</p>
                                            <p className="text-sm text-slate-700">{fmt(contact.contact_person_phone)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Telephone</p>
                                            <p className="text-sm text-slate-700">{fmt(contact.contact_person_telephone)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Address</p>
                                            <p className="text-sm text-slate-700">{fmt(contact.contact_person_address)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>

        </div>
    );
}