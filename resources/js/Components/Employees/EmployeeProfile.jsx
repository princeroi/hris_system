// EmployeeProfile.jsx
import { useState } from "react";
import {
    User, Briefcase, Shield, CreditCard, Coins, Clock,
    Phone, MapPin, GraduationCap, AlertCircle,
    Building2, CalendarDays, Fingerprint, Smartphone,
    BanknoteIcon, FileText, ArrowLeftRight, RotateCcw,
} from "lucide-react";
import { fmtDate, fmtDateTime } from "@/utils/dateUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val) =>
    val === null || val === undefined || val === "" ? "—" : val;

const fmtMoney = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    return Number(val).toLocaleString("en-PH", {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
};

const fmtGrouped = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const str = String(val).trim();
    if (/^[A-Za-z0-9-]{5,}$/.test(str)) {
        return str.replace(/(.{4})/g, "$1\u2009").trim();
    }
    return str;
};

const labelMap = {
    probationary: "Probationary", regular: "Regular",
    project_based: "Project-based", contractual: "Contractual",
    reliever: "Reliever", part_time: "Part-time", intern: "Intern",
    active: "Active", inactive: "Inactive", on_leave: "On Leave",
    terminated: "Terminated", resigned: "Resigned",
    retired: "Retired", contract_end: "Contract End",
    valid: "Valid", expired: "Expired", renewed: "Renewed",
    no_sss: "No SSS", for_verification: "For Verification",
    verified: "Verified", no_pagibig: "No Pag-IBIG",
    no_philhealth: "No PhilHealth", no_tin: "No TIN",
    pending: "Pending", released: "Released",
    monthly: "Monthly", semi_monthly: "Semi-monthly",
    weekly: "Weekly", daily: "Daily", hourly: "Hourly",
    hourly_rate: "Hourly Rate", daily_rate: "Daily Rate",
    weekly_rate: "Weekly Rate", semi_monthly_rate: "Semi-monthly Rate",
    monthly_rate: "Monthly Rate",
    archive: "Archive", rehire: "Rehire",
};

const fmtLabel = (val) =>
    val && labelMap[val] ? labelMap[val] : fmt(val);

// ─── Badge color maps ─────────────────────────────────────────────────────────

const STATUS_COLORS = {
    active:        "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive:      "bg-slate-100 text-slate-500 ring-slate-200",
    on_leave:      "bg-amber-50 text-amber-700 ring-amber-200",
    terminated:    "bg-red-50 text-red-600 ring-red-200",
    resigned:      "bg-orange-50 text-orange-700 ring-orange-200",
    retired:       "bg-purple-50 text-purple-700 ring-purple-200",
    contract_end:  "bg-sky-50 text-sky-700 ring-sky-200",
    probationary:  "bg-blue-50 text-blue-700 ring-blue-200",
    regular:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
    project_based: "bg-violet-50 text-violet-700 ring-violet-200",
    contractual:   "bg-amber-50 text-amber-700 ring-amber-200",
    reliever:      "bg-sky-50 text-sky-700 ring-sky-200",
    part_time:     "bg-pink-50 text-pink-700 ring-pink-200",
    intern:        "bg-slate-100 text-slate-500 ring-slate-200",
};

const GOV_ID_COLORS = {
    verified:         "bg-emerald-50 text-emerald-700 ring-emerald-200",
    for_verification: "bg-amber-50 text-amber-700 ring-amber-200",
    no_sss:           "bg-slate-100 text-slate-500 ring-slate-200",
    no_pagibig:       "bg-slate-100 text-slate-500 ring-slate-200",
    no_philhealth:    "bg-slate-100 text-slate-500 ring-slate-200",
    no_tin:           "bg-slate-100 text-slate-500 ring-slate-200",
};

const CONTRACT_COLORS = {
    valid:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    expired:    "bg-red-50 text-red-600 ring-red-200",
    renewed:    "bg-sky-50 text-sky-700 ring-sky-200",
    terminated: "bg-slate-100 text-slate-500 ring-slate-200",
};

const ATM_COLORS = {
    active:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending:  "bg-amber-50 text-amber-700 ring-amber-200",
    released: "bg-sky-50 text-sky-700 ring-sky-200",
    inactive: "bg-slate-100 text-slate-500 ring-slate-200",
};

const LOG_TYPE_COLORS = {
    archive: "bg-orange-50 text-orange-700 ring-orange-200",
    rehire:  "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Badge({ value, colorMap }) {
    const cls = colorMap?.[value] ?? "bg-slate-100 text-slate-500 ring-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ring-1 uppercase ${cls}`}>
            {fmtLabel(value)}
        </span>
    );
}

function FieldLabel({ children }) {
    return (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-1.5">
            {children}
        </p>
    );
}

function Field({ label, value, mono = false, badge = false, colorMap, span = false }) {
    return (
        <div className={span ? "col-span-2" : ""}>
            <FieldLabel>{label}</FieldLabel>
            {badge ? (
                <Badge value={value} colorMap={colorMap} />
            ) : mono ? (
                <span className="inline-block font-mono text-[11.5px] tracking-[0.08em] text-slate-800 bg-slate-50 ring-1 ring-slate-200 rounded-md px-2.5 py-1.5">
                    {fmtGrouped(value)}
                </span>
            ) : (
                <p className={`text-sm leading-relaxed ${!value ? "text-slate-300" : "text-slate-800"}`}>
                    {fmt(value)}
                </p>
            )}
        </div>
    );
}

function FieldGrid({ cols = 2, children, className = "" }) {
    const colMap = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-2 lg:grid-cols-4",
    };
    return (
        <div className={`grid gap-x-8 gap-y-6 ${colMap[cols] ?? colMap[2]} ${className}`}>
            {children}
        </div>
    );
}

function RowItem({ label, value, mono = false, badge = false, colorMap }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <p className="text-[11px] text-slate-400 whitespace-nowrap">{label}</p>
            {badge ? (
                <Badge value={value} colorMap={colorMap} />
            ) : mono ? (
                <span className="font-mono text-[11px] tracking-[0.08em] text-slate-700 bg-slate-50 ring-1 ring-slate-200 rounded px-2 py-1">
                    {fmtGrouped(value)}
                </span>
            ) : (
                <p className="text-[12px] font-medium text-slate-800 text-right">{fmt(value)}</p>
            )}
        </div>
    );
}

function InfoCard({ icon: Icon, title, children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm ${className}`}>
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 flex-shrink-0 shadow-sm">
                    <Icon size={13} strokeWidth={2} />
                </div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                    {title}
                </p>
            </div>
            <div className="px-5 py-5">
                {children}
            </div>
        </div>
    );
}

function StatTile({ label, value, colorMap }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-200 px-4 py-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400 mb-3">
                {label}
            </p>
            <Badge value={value} colorMap={colorMap} />
        </div>
    );
}

function MoneyTile({ label, amount }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400 mb-2">
                {label}
            </p>
            <p className="text-xl font-semibold text-slate-900">
                <span className="text-sm font-normal text-slate-400 mr-1">₱</span>
                {fmtMoney(amount)}
            </p>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="py-14 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm text-slate-400">{message}</p>
        </div>
    );
}

function SectionDivider({ label }) {
    return (
        <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
        </div>
    );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
    { id: "personal",     label: "Personal",     icon: User },
    { id: "employment",   label: "Employment",   icon: Briefcase },
    { id: "govids",       label: "Gov IDs",      icon: Shield },
    { id: "bank",         label: "Bank & Pay",   icon: CreditCard },
    { id: "compensation", label: "Compensation", icon: Coins },
    { id: "experience",   label: "Experience",   icon: Clock },
    { id: "emergency",    label: "Emergency",    icon: AlertCircle },
];

// ─── Tab panels ───────────────────────────────────────────────────────────────

function PersonalTab({ pi, employee }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoCard icon={User} title="Name">
                    <FieldGrid cols={2}>
                        <Field label="First name"  value={pi.first_name  ?? employee?.first_name} />
                        <Field label="Middle name" value={pi.middle_name ?? employee?.middle_name} />
                        <Field label="Last name"   value={pi.last_name   ?? employee?.last_name} />
                        <Field label="Suffix"      value={pi.suffix      ?? employee?.suffix} />
                    </FieldGrid>
                </InfoCard>

                <InfoCard icon={FileText} title="Personal details">
                    <FieldGrid cols={2}>
                        <Field label="Birth date"   value={fmtDate(pi.birth_date)} />
                        <Field label="Age"          value={pi.age} />
                        <Field label="Gender"       value={pi.gender} />
                        <Field label="Civil status" value={pi.civil_status} />
                        <Field label="Nationality"  value={pi.nationality} />
                        <Field label="Religion"     value={pi.religion} />
                    </FieldGrid>
                </InfoCard>
            </div>

            <InfoCard icon={MapPin} title="Birth place">
                <Field label="Place of birth" value={pi.birth_place} />
            </InfoCard>

            <InfoCard icon={MapPin} title="Address">
                <FieldGrid cols={2}>
                    <Field label="Home address"    value={pi.home_address} />
                    <Field label="Current address" value={pi.current_address} />
                </FieldGrid>
            </InfoCard>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoCard icon={Phone} title="Contact information">
                    <FieldGrid cols={2}>
                        <Field label="Phone"           value={pi.phone_number} />
                        <Field label="Telephone"       value={pi.telephone_number} />
                        <Field label="Email"           value={pi.email} span />
                        <Field label="Alternate email" value={pi.alternate_email} span />
                    </FieldGrid>
                </InfoCard>

                <InfoCard icon={GraduationCap} title="Educational background">
                    <FieldGrid cols={1}>
                        <Field label="Highest education" value={pi.highest_education} />
                        <Field label="Course"            value={pi.course} />
                        <Field label="School"            value={pi.school} />
                    </FieldGrid>
                </InfoCard>
            </div>
        </div>
    );
}

function EmploymentTab({ ed, statusLogs = [] }) {
    return (
        <div className="space-y-4">
            {/* Status tiles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatTile label="Employment type"  value={ed.employment_type}  colorMap={STATUS_COLORS} />
                <StatTile label="Status"           value={ed.status ?? "inactive"} colorMap={STATUS_COLORS} />
                <StatTile label="Contract status"  value={ed.contract_status}  colorMap={CONTRACT_COLORS} />
            </div>

            {/* Key dates + Assignment */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoCard icon={CalendarDays} title="Key dates">
                    <FieldGrid cols={2}>
                        <Field label="Hired date"          value={fmtDate(ed.hired_date)} />
                        <Field label="Regularization date" value={fmtDate(ed.regularization_date)} />
                        <Field label="Probationary period" value={ed.probationary_period_months ? `${ed.probationary_period_months} months` : null} />
                        <Field label="Evaluation date"     value={fmtDate(ed.probationary_evaluation_date)} />
                        <Field label="Contract start"      value={fmtDate(ed.contract_date_from)} />
                        <Field label="Contract end"        value={fmtDate(ed.contract_date_to)} />
                    </FieldGrid>
                </InfoCard>

                <InfoCard icon={Building2} title="Assignment">
                    <FieldGrid cols={2}>
                        <Field label="Company"    value={ed.company?.company_name       ?? ed.company_id} />
                        <Field label="Branch"     value={ed.branch?.branch_name         ?? ed.branch_id} />
                        <Field label="Department" value={ed.department?.department_name ?? ed.department_id} />
                        <Field label="Position"   value={ed.position?.position_name     ?? ed.position_id} />
                        <Field label="Job level"  value={ed.job_level} />
                    </FieldGrid>
                </InfoCard>
            </div>

            {/* Status change logs */}
            {statusLogs.length > 0 && (
                <>
                    <SectionDivider label="Status change history" />
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 flex-shrink-0 shadow-sm">
                                <ArrowLeftRight size={13} strokeWidth={2} />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.08em]">
                                Status change logs
                            </p>
                            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                                {statusLogs.length}
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {statusLogs.map((log, i) => (
                                <div key={i} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ${
                                            log.type === "rehire"
                                                ? "bg-emerald-50 ring-emerald-200 text-emerald-600"
                                                : "bg-orange-50 ring-orange-200 text-orange-600"
                                        }`}>
                                            {log.type === "rehire"
                                                ? <RotateCcw size={11} strokeWidth={2.5} />
                                                : <ArrowLeftRight size={11} strokeWidth={2.5} />
                                            }
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge value={log.type} colorMap={LOG_TYPE_COLORS} />
                                                <span className="text-slate-300 text-xs">·</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Badge value={log.previous_status} colorMap={STATUS_COLORS} />
                                                    <span className="text-slate-300 text-xs">→</span>
                                                    <Badge value={log.new_status} colorMap={STATUS_COLORS} />
                                                </div>
                                            </div>
                                            {log.reason && (
                                                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-sm">
                                                    {log.reason}
                                                </p>
                                            )}
                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                                                {log.effective_date && (
                                                    <span>Effective: <span className="text-slate-600 font-medium">{fmtDate(log.effective_date)}</span></span>
                                                )}
                                                {log.last_working_date && (
                                                    <span>Last day: <span className="text-slate-600 font-medium">{fmtDate(log.last_working_date)}</span></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:text-right flex-shrink-0 pl-10 sm:pl-0">
                                        <p className="text-[10px] text-slate-400">{fmtDateTime(log.applied_at)}</p>
                                        {log.changed_by && (
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                by <span className="text-slate-600 font-medium">{log.changed_by}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function GovIdsTab({ gi }) {
    const ids = [
        { label: "SSS",        number: gi.sss_number,        status: gi.sss_status,        remarks: gi.sss_remarks },
        { label: "Pag-IBIG",   number: gi.pagibig_number,    status: gi.pagibig_status,    remarks: gi.pagibig_remarks },
        { label: "PhilHealth", number: gi.philhealth_number, status: gi.philhealth_status, remarks: gi.philhealth_remarks },
        { label: "TIN",        number: gi.tin_number,        status: gi.tin_status,        remarks: gi.tin_remarks },
    ];
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ids.map(({ label, number, status, remarks }) => (
                <InfoCard key={label} icon={Fingerprint} title={label}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-slate-800">{label} ID</p>
                        <Badge value={status} colorMap={GOV_ID_COLORS} />
                    </div>
                    <FieldGrid cols={1}>
                        <Field label={`${label} number`} value={number} mono />
                        {remarks && <Field label="Remarks" value={remarks} />}
                    </FieldGrid>
                </InfoCard>
            ))}
        </div>
    );
}

function BankTab({ ba }) {
    return (
        <div className="space-y-4">
            <InfoCard icon={CreditCard} title="Primary bank">
                <RowItem label="Bank name"       value={ba.bank_name} />
                <RowItem label="Account name"    value={ba.account_name} />
                <RowItem label="Account number"  value={ba.account_number} mono />
                <RowItem label="ATM card number" value={ba.atm_card_number} mono />
                <RowItem label="ATM status"      value={ba.atm_status} badge colorMap={ATM_COLORS} />
            </InfoCard>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard icon={Smartphone} title="GCash">
                    <RowItem label="GCash number" value={ba.gcash_account_number} />
                    <RowItem label="GCash name"   value={ba.gcash_account_name} />
                </InfoCard>

                <InfoCard icon={Building2} title="Other bank">
                    <RowItem label="Bank type"      value={ba.other_bank_type} />
                    <RowItem label="Bank name"      value={ba.other_bank_name} />
                    <RowItem label="Account number" value={ba.other_account_number} mono />
                    <RowItem label="Account name"   value={ba.other_account_name} />
                </InfoCard>
            </div>
        </div>
    );
}

function CompensationTab({ cp }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MoneyTile label="Monthly rate" amount={cp.monthly_rate} />
                <MoneyTile label="Daily rate"   amount={cp.daily_rate} />
                <MoneyTile label="Hourly rate"  amount={cp.hourly_rate} />
            </div>

            <InfoCard icon={BanknoteIcon} title="Payroll details">
                <FieldGrid cols={3}>
                    <Field label="Payroll type"   value={cp.payroll_type}   badge colorMap={STATUS_COLORS} />
                    <Field label="Salary type"    value={cp.salary_type}    badge colorMap={STATUS_COLORS} />
                    <Field label="Effective date" value={fmtDate(cp.effective_date)} />
                </FieldGrid>
            </InfoCard>
        </div>
    );
}

function ExperienceTab({ we }) {
    return (
        <div>
            {we.length === 0 ? (
                <EmptyState message="No work experience on record." />
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {we.map((entry, i) => (
                        <InfoCard key={i} icon={Clock} title={entry.company_name ?? "Experience"}>
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {fmt(entry.company_name)}
                                    </p>
                                    {entry.position && (
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {entry.position}
                                            {entry.department ? ` · ${entry.department}` : ""}
                                        </p>
                                    )}
                                </div>
                                {entry.years_of_service && (
                                    <span className="text-xs text-slate-400 flex-shrink-0">
                                        {entry.years_of_service} yr{entry.years_of_service !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <FieldGrid cols={1}>
                                <Field label="Period" value={`${fmtDate(entry.start_date)} — ${fmtDate(entry.end_date)}`} />
                                {entry.remarks && <Field label="Remarks" value={entry.remarks} />}
                            </FieldGrid>
                        </InfoCard>
                    ))}
                </div>
            )}
        </div>
    );
}

function EmergencyTab({ ec }) {
    return (
        <div>
            {ec.length === 0 ? (
                <EmptyState message="No emergency contacts on record." />
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {ec.map((contact, i) => (
                        <InfoCard key={i} icon={AlertCircle} title="Emergency contact">
                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    {fmt(contact.contact_person_name)}
                                </p>
                                {contact.contact_person_relationship && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                                        {contact.contact_person_relationship}
                                    </span>
                                )}
                            </div>
                            <FieldGrid cols={2}>
                                <Field label="Phone"     value={contact.contact_person_phone} />
                                <Field label="Telephone" value={contact.contact_person_telephone} />
                                <Field label="Address"   value={contact.contact_person_address} span />
                            </FieldGrid>
                        </InfoCard>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EmployeeProfile({
    employee,
    personalInfo,
    employmentDetails,
    govIds,
    bankAccount,
    compensation,
    workExperiences,
    emergencyContacts,
    statusLogs = [],
}) {
    const [activeTab, setActiveTab] = useState("personal");

    const pi = personalInfo       ?? {};
    const ed = employmentDetails  ?? {};
    const gi = govIds             ?? {};
    const ba = bankAccount        ?? {};
    const cp = compensation       ?? {};
    const we = Array.isArray(workExperiences)   ? workExperiences   : [];
    const ec = Array.isArray(emergencyContacts) ? emergencyContacts : [];

    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden shadow-sm">

            {/* Tab nav */}
            <div className="flex items-stretch overflow-x-auto border-b border-slate-100 bg-white px-2 scrollbar-none">
                {TABS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    const showDot = id === "employment" && statusLogs.length > 0;
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`
                                relative inline-flex items-center gap-1.5 whitespace-nowrap
                                border-b-2 px-4 py-3.5 text-[11px] font-medium
                                transition-colors duration-150 flex-shrink-0
                                ${isActive
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                                }
                            `}
                        >
                            <Icon size={12} strokeWidth={2} />
                            {label}
                            {showDot && (
                                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-100 px-1 text-[9px] font-bold text-orange-600 ring-1 ring-orange-200">
                                    {statusLogs.length}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Panel */}
            <div className="bg-slate-50/70 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
                {activeTab === "personal"     && <PersonalTab     pi={pi} employee={employee} />}
                {activeTab === "employment"   && <EmploymentTab   ed={ed} statusLogs={statusLogs} />}
                {activeTab === "govids"       && <GovIdsTab       gi={gi} />}
                {activeTab === "bank"         && <BankTab         ba={ba} />}
                {activeTab === "compensation" && <CompensationTab cp={cp} />}
                {activeTab === "experience"   && <ExperienceTab   we={we} />}
                {activeTab === "emergency"    && <EmergencyTab    ec={ec} />}
            </div>
        </div>
    );
}