import { useState, useMemo, useEffect } from "react";
import { User, Mail, Lock, Shield, AtSign, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem,
} from "@/components/ui/select";

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

function EmployeeCombobox({ value, onChange, employees, error }) {
    const [query, setQuery] = useState("");
    const [open,  setOpen]  = useState(false);

    const selected = employees.find(e => String(e.id) === String(value));

    const filtered = useMemo(() => {
        if (!query.trim()) return employees.slice(0, 60);
        const q = query.toLowerCase();
        return employees.filter(e =>
            e.label.toLowerCase().includes(q) ||
            e.employee_number?.toLowerCase().includes(q)
        ).slice(0, 60);
    }, [employees, query]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!e.target.closest("[data-combobox]")) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <div className="relative" data-combobox>
            <div
                tabIndex={0}
                role="combobox"
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
                className={[
                    "flex h-9 w-full cursor-pointer items-center justify-between gap-1.5",
                    "rounded-lg border bg-white px-3 py-1 text-sm",
                    "select-none transition-colors outline-none hover:border-slate-300",
                    error ? "border-red-400" : "border-slate-200",
                ].join(" ")}
            >
                {selected
                    ? <span className="truncate text-slate-700">{selected.label}</span>
                    : <span className="text-slate-400">Search employee…</span>
                }
                <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>

            {open && (
                <div data-combobox className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
                    <div className="p-1.5 border-b border-slate-100">
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by name or employee number…"
                            className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-slate-400"
                        />
                    </div>
                    <ul className="max-h-52 overflow-y-auto p-1">
                        {filtered.length === 0
                            ? <li className="px-2.5 py-3 text-center text-sm text-slate-400">No results</li>
                            : filtered.map(emp => (
                                <li
                                    key={emp.id}
                                    onClick={() => { onChange(emp); setOpen(false); setQuery(""); }}
                                    className={[
                                        "flex flex-col rounded-md px-2.5 py-2 text-sm cursor-default select-none transition-colors",
                                        String(emp.id) === String(value)
                                            ? "bg-[#EFF6FF] text-[#1D4ED8] font-medium"
                                            : "text-slate-700 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <span className="font-medium">{emp.label}</span>
                                    <span className="text-xs text-slate-400">{emp.employee_number}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function UserForm({ form, setForm, roles = [], employees = [], errors = {}, isEditing = false, employee = null }) {
    function handleEmployeePick(emp) {
        const cleanNumber = emp.employee_number?.replace(/[^a-zA-Z0-9]/g, "") ?? "";
        setForm("employee_id", String(emp.id));
        setForm("name",        emp.label);
        setForm("email",       emp.email ?? "");
        setForm("username",    `ssi_${cleanNumber}`);
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Employee picker — create only */}
            {!isEditing && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <SectionHeading label="Link to Employee" />
                    <Field label="Employee" icon={User} error={errors.employee_id}
                        hint="Select an employee to auto-fill their name and email.">
                        <EmployeeCombobox
                            value={form.employee_id}
                            onChange={handleEmployeePick}
                            employees={employees}
                            error={errors.employee_id}
                        />
                    </Field>
                </div>
            )}

            {/* Linked employee display — edit only */}
            {isEditing && employee && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <SectionHeading label="Linked Employee" />
                    <Field label="Employee" icon={User}>
                        <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 cursor-not-allowed select-none">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" strokeWidth={1.75} />
                            <span className="truncate">{employee.label}</span>
                            <span className="ml-auto text-xs text-slate-400">{employee.employee_number}</span>
                        </div>
                    </Field>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Info className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                        The linked employee cannot be changed after account creation.
                    </p>
                </div>
            )}

            {/* Account Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Account Information" />

                <Field label="Full Name" icon={User} required error={errors.name}>
                    <Input
                        value={form.name}
                        onChange={e => setForm("name", e.target.value)}
                        placeholder="Full name"
                        aria-invalid={!!errors.name}
                    />
                </Field>

                <Field label="Username" icon={AtSign} required error={errors.username}
                    hint={!isEditing ? "Auto-generated from employee number. You may edit it." : "Used to log in to the system."}>
                    <Input
                        value={form.username}
                        onChange={e => setForm("username", e.target.value)}
                        placeholder="e.g. ssi-00001"
                        aria-invalid={!!errors.username}
                    />
                </Field>

                <Field label="Email" icon={Mail} required error={errors.email}>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm("email", e.target.value)}
                        placeholder="email@example.com"
                        aria-invalid={!!errors.email}
                    />
                </Field>
            </div>

            {/* Temporary password — create only */}
            {!isEditing && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <SectionHeading label="Temporary Password" />
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">Auto-generated password</p>
                            <p className="font-mono text-sm font-semibold text-slate-800 tracking-wider">
                                {form.temp_password}
                            </p>
                        </div>
                        <Badge variant="warning">Temporary</Badge>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Info className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                        The user must change this password on first login.
                    </p>
                </div>
            )}

            {/* Password reset — edit only */}
            {isEditing && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <SectionHeading label="Change Password" />

                    <Field label="New Password" icon={Lock} error={errors.password}
                        hint="Leave blank to keep the current password.">
                        <Input
                            type="password"
                            value={form.password}
                            onChange={e => setForm("password", e.target.value)}
                            placeholder="Leave blank to keep current"
                            aria-invalid={!!errors.password}
                        />
                    </Field>

                    <Field label="Confirm Password" icon={Lock} error={errors.password_confirmation}>
                        <Input
                            type="password"
                            value={form.password_confirmation}
                            onChange={e => setForm("password_confirmation", e.target.value)}
                            placeholder="Confirm new password"
                            aria-invalid={!!errors.password_confirmation}
                        />
                    </Field>
                </div>
            )}

            {/* Role */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <SectionHeading label="Role & Access" />

                <Field label="Role" icon={Shield} required error={errors.role}>
                    <Select
                        value={form.role ?? ""}
                        onValueChange={val => setForm("role", val)}
                    >
                        <SelectTrigger aria-invalid={!!errors.role}>
                            <SelectValue placeholder="— Select role —" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(r => (
                                <SelectItem key={r.id} value={r.name}>
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

        </div>
    );
}