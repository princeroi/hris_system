import { useState, useMemo, useEffect } from "react";
import {
    User, Users, Building2, GitBranch, LayoutGrid, Briefcase,
    ChevronLeft, ChevronRight, X, StickyNote, Info, AlertCircle,
} from "lucide-react";

import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem,
} from "@/components/ui/select";

const RELIEVER_TYPES = ["reliever"];

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];
const DAYS_OF_WEEK = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toYMD(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function daysInMonth(y, m)    { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y, m){ return new Date(y, m, 1).getDay(); }

function fmtDate(str) {
    if (!str) return "—";
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function Field({ label, icon: Icon, error, required, hint, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} />}
                {label}
                {required && <span className="text-red-400 leading-none">*</span>}
            </label>
            {children}
            {hint && !error && (
                <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Info className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                    {hint}
                </p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SectionHeading({ label }) {
    return (
        <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
        </div>
    );
}

function AutoFillBanner({ name }) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
            <Info className="h-3.5 w-3.5 shrink-0 text-indigo-500" strokeWidth={1.75} />
            <p className="text-xs text-indigo-700">
                Auto-filled from{" "}
                <span className="font-semibold">{name}</span>'s profile — you can still edit any field.
            </p>
        </div>
    );
}

function ScheduledDatesBanner({ bookedEntries, companies, branches, departments, positions }) {
    if (!bookedEntries.length) return null;

    const grouped = useMemo(() => {
        const map = {};
        bookedEntries.forEach(({ date, company_id, branch_id, department_id, position_id }) => {
            const key = [company_id, branch_id, department_id, position_id].join("|");
            if (!map[key]) {
                const company    = companies.find(c => String(c.id) === String(company_id));
                const branch     = branches.find(b => String(b.id) === String(branch_id));
                const department = departments.find(d => String(d.id) === String(department_id));
                const position   = positions.find(p => String(p.id) === String(position_id));
                map[key] = {
                    label: [
                        company?.company_name,
                        branch?.branch_name,
                        department?.department_name,
                        position?.position_name,
                    ].filter(Boolean).join(" · ") || "Unassigned",
                    dates: [],
                };
            }
            map[key].dates.push(date);
        });
        return Object.values(map);
    }, [bookedEntries, companies, branches, departments, positions]);

    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 space-y-2">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
                <p className="text-xs font-semibold text-amber-700">
                    This reliever already has scheduled duties on some dates — those dates are disabled.
                </p>
            </div>
            {grouped.map((g, i) => (
                <div key={i} className="pl-5 space-y-1">
                    <p className="text-xs font-medium text-amber-700">{g.label}</p>
                    <div className="flex flex-wrap gap-1">
                        {g.dates.sort().map(d => (
                            <span
                                key={d}
                                className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200"
                            >
                                {fmtDate(d)}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmployeeCombobox({ value, onChange, employees, placeholder, error }) {
    const [query, setQuery] = useState("");
    const [open, setOpen]   = useState(false);

    useEffect(() => { if (!open) setQuery(""); }, [open]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!e.target.closest("[data-combobox]")) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const selected = employees.find(e => String(e.id) === String(value));

    const filtered = useMemo(() => {
        if (!query.trim()) return employees.slice(0, 60);
        const q = query.toLowerCase();
        return employees.filter(e => e.label.toLowerCase().includes(q)).slice(0, 60);
    }, [employees, query]);

    function pick(emp) { onChange(String(emp.id)); setOpen(false); }
    function clear(e)  { e.stopPropagation(); onChange(""); }

    return (
        <div className="relative" data-combobox>
            <div
                tabIndex={0}
                role="combobox"
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); }}}
                aria-invalid={!!error}
                className={[
                    "flex h-8 w-full min-w-0 cursor-pointer items-center justify-between gap-1.5",
                    "rounded-lg border bg-white px-2.5 py-1 text-sm whitespace-nowrap",
                    "select-none transition-colors outline-none",
                    "hover:border-[#93C5FD]",
                    "focus-visible:border-[#3B82F6] focus-visible:ring-3 focus-visible:ring-blue-300/40",
                    error
                        ? "border-red-400 ring-3 ring-red-300/25"
                        : "border-[#BFDBFE]",
                ].join(" ")}
            >
                {selected
                    ? <span className="truncate text-slate-700">{selected.label}</span>
                    : <span className="text-[#93C5FD]">{placeholder}</span>
                }
                <div className="flex shrink-0 items-center gap-1">
                    {selected && (
                        <button
                            type="button"
                            onClick={clear}
                            className="rounded p-0.5 text-slate-300 transition hover:text-slate-500"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <svg className={`h-3.5 w-3.5 text-[#93C5FD] transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
            </div>

            {open && (
                <div
                    data-combobox
                    className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#BFDBFE]
                        bg-white shadow-md shadow-blue-100/50"
                >
                    <div className="p-1.5 border-b border-[#BFDBFE]">
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search employee…"
                            className="w-full rounded-md border border-[#BFDBFE] px-2.5 py-1.5 text-sm outline-none
                                focus:border-[#3B82F6] focus:ring-3 focus:ring-blue-300/40 transition-colors"
                        />
                    </div>
                    <ul className="max-h-52 overflow-y-auto p-1">
                        {filtered.length === 0
                            ? <li className="px-2.5 py-3 text-center text-sm text-slate-400">No results</li>
                            : filtered.map(emp => (
                                <li
                                    key={emp.id}
                                    onClick={() => pick(emp)}
                                    className={[
                                        "relative flex w-full cursor-default items-center rounded-md py-1.5 px-2.5 text-sm",
                                        "select-none outline-none transition-colors",
                                        String(emp.id) === String(value)
                                            ? "bg-[#EFF6FF] text-[#1D4ED8] font-medium"
                                            : "text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]",
                                    ].join(" ")}
                                >
                                    {emp.label}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </div>
    );
}

function DatePicker({ selected = [], onChange, disabledDates = new Set() }) {
    const today = new Date();
    const [year,  setYear]  = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const selectedSet = useMemo(() => new Set(selected), [selected]);

    function prevMonth() {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }
    function nextMonth() {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }
    function toggleDay(ymd) {
        if (disabledDates.has(ymd)) return;
        const next = new Set(selectedSet);
        if (next.has(ymd)) next.delete(ymd); else next.add(ymd);
        onChange([...next].sort());
    }

    const totalDays = daysInMonth(year, month);
    const startDay  = firstDayOfMonth(year, month);
    const cells     = Array.from({ length: startDay + totalDays }, (_, i) =>
        i < startDay ? null : i - startDay + 1
    );

    return (
        <div className="overflow-hidden rounded-xl border border-[#BFDBFE]">
            <div className="flex items-center justify-between border-b border-[#BFDBFE] px-4 py-3">
                <Button type="button" variant="ghost" size="icon-sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </Button>
                <span className="text-sm font-semibold text-slate-700">{MONTHS[month]} {year}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </Button>
            </div>

            <div className="grid grid-cols-7 border-b border-[#BFDBFE] bg-[#EFF6FF]">
                {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="py-2 text-center text-xs font-semibold text-[#93C5FD]">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-px p-2">
                {cells.map((day, idx) => {
                    if (!day) return <div key={`e-${idx}`} />;
                    const ymd        = toYMD(year, month, day);
                    const isSel      = selectedSet.has(ymd);
                    const isDisabled = disabledDates.has(ymd);

                    return (
                        <button
                            key={ymd}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => toggleDay(ymd)}
                            title={isDisabled ? "Already scheduled" : undefined}
                            className={[
                                "aspect-square w-full rounded-md text-xs font-medium transition flex items-center justify-center",
                                isDisabled
                                    ? "cursor-not-allowed bg-amber-50 text-amber-400 ring-1 ring-inset ring-amber-200"
                                    : isSel
                                        ? "bg-[#1D4ED8] text-white shadow-sm"
                                        : "text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]",
                            ].join(" ")}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-4 border-t border-[#BFDBFE] bg-slate-50/60 px-4 py-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="inline-block h-3 w-3 rounded bg-[#1D4ED8]" />
                    Selected
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-200" />
                    Already scheduled
                </span>
            </div>
        </div>
    );
}

function DateChips({ dates, onRemove }) {
    if (!dates.length) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            {dates.map(d => (
                <Badge key={d} variant="info" className="gap-1 pr-1.5">
                    {fmtDate(d)}
                    <button
                        type="button"
                        onClick={() => onRemove(d)}
                        className="ml-0.5 rounded-full opacity-60 transition hover:opacity-100"
                    >
                        <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                </Badge>
            ))}
        </div>
    );
}

export default function DutyForm({
    form,
    setForm,
    employees   = [],
    companies   = [],
    branches    = [],
    departments = [],
    positions   = [],
    scheduledDates = {},
    errors      = {},
    isEditing   = false,
}) {
    const [autoFillSource, setAutoFillSource] = useState(null);

    const employeeMap = useMemo(() => {
        const map = {};
        employees.forEach(e => { map[String(e.id)] = e; });
        return map;
    }, [employees]);

    const bookedEntries = useMemo(() => {
        if (!form.reliever_employee_id) return [];
        return scheduledDates[String(form.reliever_employee_id)] ?? [];
    }, [scheduledDates, form.reliever_employee_id]);

    // On edit: no dates are disabled — user can freely add or remove any date
    const disabledDatesSet = useMemo(() =>
        isEditing ? new Set() : new Set(bookedEntries.map(e => e.date)),
    [bookedEntries, isEditing]);

    useEffect(() => {
        const cleaned = form.dates.filter(d => !disabledDatesSet.has(d));
        if (cleaned.length !== form.dates.length) {
            setForm("dates", cleaned);
        }
    }, [disabledDatesSet]);

    const relieverEmployees = useMemo(() => {
        let list = employees;
        if (form.duty_type === "vacant_post") {
            list = list.filter(e =>
                RELIEVER_TYPES.includes((e.employment_type ?? "").toLowerCase())
            );
        }
        if (form.covered_employee_id) {
            list = list.filter(e => String(e.id) !== String(form.covered_employee_id));
        }
        return list;
    }, [employees, form.duty_type, form.covered_employee_id]);

    const coveredEmployees = useMemo(() =>
        form.reliever_employee_id
            ? employees.filter(e => String(e.id) !== String(form.reliever_employee_id))
            : employees,
    [employees, form.reliever_employee_id]);

    const filteredBranches = useMemo(() =>
        form.company_id
            ? branches.filter(b => String(b.company_id) === String(form.company_id))
            : branches,
    [branches, form.company_id]);

    function set(key, value) { setForm(key, value); }

    function fillAssignmentFrom(empId) {
        const emp = employeeMap[String(empId)];
        if (!emp) return;
        set("company_id",    emp.company_id    ? String(emp.company_id)    : "");
        set("branch_id",     emp.branch_id     ? String(emp.branch_id)     : "");
        set("department_id", emp.department_id ? String(emp.department_id) : "");
        set("position_id",   emp.position_id   ? String(emp.position_id)   : "");
        setAutoFillSource(emp.name ?? emp.label);
    }

    function clearAssignment() {
        set("company_id", ""); set("branch_id", "");
        set("department_id", ""); set("position_id", "");
        setAutoFillSource(null);
    }

    function handleRelieverChange(val) {
        set("reliever_employee_id", val);
        if (form.duty_type === "vacant_post") {
            val ? fillAssignmentFrom(val) : clearAssignment();
        }
    }

    function handleCoveredChange(val) {
        set("covered_employee_id", val);
        if (form.duty_type === "cover_up") {
            val ? fillAssignmentFrom(val) : clearAssignment();
        }
    }

    function handleDutyTypeChange(newType) {
        set("duty_type", newType);
        if (newType === "vacant_post") {
            set("covered_employee_id", "");
            form.reliever_employee_id ? fillAssignmentFrom(form.reliever_employee_id) : clearAssignment();
        } else {
            form.covered_employee_id ? fillAssignmentFrom(form.covered_employee_id) : clearAssignment();
        }
    }

    function handleCompanyChange(val) {
        set("company_id", val);
        set("branch_id", "");
        setAutoFillSource(null);
    }

    function removeDate(d) { set("dates", form.dates.filter(x => x !== d)); }

    const showBanner = autoFillSource && (
        form.company_id || form.branch_id || form.department_id || form.position_id
    );

    const DUTY_TYPES = [
        { value: "vacant_post", label: "Vacant Post",  desc: "Filling an empty post",   color: "amber"  },
        { value: "cover_up",    label: "Cover-Up",     desc: "Covering for an employee", color: "purple" },
    ];

    return (
        <div className="flex flex-col gap-5">

            {/* ── Reliever ─────────────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Reliever" />

                <Field
                    label="Reliever Employee"
                    icon={User}
                    required
                    error={errors.reliever_employee_id}
                    hint={
                        form.duty_type === "vacant_post"
                            ? `Only ${RELIEVER_TYPES.join(" / ")} employees shown for Vacant Post.`
                            : undefined
                    }
                >
                    <EmployeeCombobox
                        value={form.reliever_employee_id}
                        onChange={handleRelieverChange}
                        employees={relieverEmployees}
                        placeholder="Select reliever employee…"
                        error={errors.reliever_employee_id}
                    />
                </Field>

                <Field label="Duty Type" icon={Briefcase} required error={errors.duty_type}>
                    <div className="grid grid-cols-2 gap-2">
                        {DUTY_TYPES.map(opt => {
                            const active = form.duty_type === opt.value;
                            const activeRing = opt.color === "amber"
                                ? "ring-2 ring-amber-400 border-amber-400 bg-amber-50"
                                : "ring-2 ring-purple-400 border-purple-400 bg-purple-50";
                            const activeText = opt.color === "amber" ? "text-amber-700" : "text-purple-700";
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleDutyTypeChange(opt.value)}
                                    className={[
                                        "flex flex-col items-start rounded-lg border p-3 text-left transition",
                                        active
                                            ? activeRing
                                            : "border-[#BFDBFE] hover:border-[#93C5FD] hover:bg-[#EFF6FF]",
                                    ].join(" ")}
                                >
                                    <span className={`text-sm font-semibold ${active ? activeText : "text-slate-700"}`}>
                                        {opt.label}
                                    </span>
                                    <span className={`mt-0.5 text-xs ${active ? activeText : "text-slate-400"}`}>
                                        {opt.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Field>

                {form.duty_type === "cover_up" && (
                    <Field
                        label="Covering For"
                        icon={Users}
                        required
                        error={errors.covered_employee_id}
                        hint="Assignment will be auto-filled from this employee's profile."
                    >
                        <EmployeeCombobox
                            value={form.covered_employee_id}
                            onChange={handleCoveredChange}
                            employees={coveredEmployees}
                            placeholder="Select employee being covered…"
                            error={errors.covered_employee_id}
                        />
                    </Field>
                )}
            </div>

            {/* ── Assignment ───────────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Assignment" />

                {showBanner && <AutoFillBanner name={autoFillSource} />}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <Field label="Company" icon={Building2} error={errors.company_id}>
                        <Select
                            value={form.company_id ? String(form.company_id) : ""}
                            onValueChange={handleCompanyChange}
                        >
                            <SelectTrigger aria-invalid={!!errors.company_id}>
                                <SelectValue placeholder="— Select company —" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.company_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field
                        label="Branch"
                        icon={GitBranch}
                        error={errors.branch_id}
                        hint={!form.company_id ? "Select a company first" : undefined}
                    >
                        <Select
                            value={form.branch_id ? String(form.branch_id) : ""}
                            onValueChange={val => { set("branch_id", val); setAutoFillSource(null); }}
                            disabled={!form.company_id}
                        >
                            <SelectTrigger aria-invalid={!!errors.branch_id}>
                                <SelectValue placeholder="— Select branch —" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredBranches.map(b => (
                                    <SelectItem key={b.id} value={String(b.id)}>
                                        {b.branch_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Department" icon={LayoutGrid} error={errors.department_id}>
                        <Select
                            value={form.department_id ? String(form.department_id) : ""}
                            onValueChange={val => { set("department_id", val); setAutoFillSource(null); }}
                        >
                            <SelectTrigger aria-invalid={!!errors.department_id}>
                                <SelectValue placeholder="— Select department —" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map(d => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.department_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Position" icon={Briefcase} error={errors.position_id}>
                        <Select
                            value={form.position_id ? String(form.position_id) : ""}
                            onValueChange={val => { set("position_id", val); setAutoFillSource(null); }}
                        >
                            <SelectTrigger aria-invalid={!!errors.position_id}>
                                <SelectValue placeholder="— Select position —" />
                            </SelectTrigger>
                            <SelectContent>
                                {positions.map(p => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.position_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                </div>
            </div>

            {/* ── Duty Dates ───────────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Duty Dates" />

                {errors.dates && (
                    <p className="text-xs text-red-500">{errors.dates}</p>
                )}

                {/* Banner only shown on create, not edit */}
                {!isEditing && form.reliever_employee_id && bookedEntries.length > 0 && (
                    <ScheduledDatesBanner
                        bookedEntries={bookedEntries}
                        companies={companies}
                        branches={branches}
                        departments={departments}
                        positions={positions}
                    />
                )}

                <DatePicker
                    selected={form.dates}
                    onChange={dates => set("dates", dates)}
                    disabledDates={disabledDatesSet}
                />

                {form.dates.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500">
                            {form.dates.length} date{form.dates.length !== 1 ? "s" : ""} selected
                        </p>
                        <DateChips dates={form.dates} onRemove={removeDate} />
                    </div>
                )}
            </div>

            {/* ── Additional Info ──────────────────────────────────────── */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Additional Info" />

                <Field label="Remarks" icon={StickyNote} error={errors.remarks}>
                    <Textarea
                        value={form.remarks ?? ""}
                        onChange={e => set("remarks", e.target.value)}
                        placeholder="Optional notes about this duty…"
                        aria-invalid={!!errors.remarks}
                        className="resize-none"
                        rows={3}
                    />
                </Field>
            </div>

        </div>
    );
}