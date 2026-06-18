// resources/js/Pages/Employees/components/EmergencyContactsPanel.jsx

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import Pill from "./Pill";
import { emptyContact } from "../bulkUploadUtils";

/**
 * Accordion panel for editing emergency-contact entries per employee row.
 * Props:
 *   rows     — full rows array (each row has an `emergency_contacts` array)
 *   onUpdate — (nextRows) => void
 */
export default function EmergencyContactsPanel({ rows, onUpdate }) {
    const [expanded, setExpanded] = useState({});

    const toggle = (ri) => setExpanded(prev => ({ ...prev, [ri]: !prev[ri] }));

    const updateContact = (ri, ci, field, value) => {
        const next     = [...rows];
        const contacts = [...(next[ri].emergency_contacts || [])];
        contacts[ci]   = { ...contacts[ci], [field]: value };
        next[ri]       = { ...next[ri], emergency_contacts: contacts };
        onUpdate(next);
    };

    const addContact = (ri) => {
        const next = [...rows];
        next[ri]   = { ...next[ri], emergency_contacts: [...(next[ri].emergency_contacts || []), emptyContact()] };
        onUpdate(next);
        setExpanded(prev => ({ ...prev, [ri]: true }));
    };

    const removeContact = (ri, ci) => {
        const next     = [...rows];
        const contacts = (next[ri].emergency_contacts || []).filter((_, i) => i !== ci);
        next[ri]       = { ...next[ri], emergency_contacts: contacts };
        onUpdate(next);
    };

    return (
        <div className="divide-y divide-slate-100">
            {rows.map((row, ri) => {
                const contacts = row.emergency_contacts || [];
                const isOpen   = expanded[ri];

                return (
                    <div key={ri}>
                        {/* Row header */}
                        <button
                            type="button"
                            onClick={() => toggle(ri)}
                            className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            {isOpen
                                ? <ChevronDown  size={15} strokeWidth={2} className="text-slate-400 shrink-0" />
                                : <ChevronRight size={15} strokeWidth={2} className="text-slate-400 shrink-0" />
                            }
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 shrink-0">
                                {ri + 1}
                            </span>
                            <span className="text-[13px] font-medium text-slate-800 flex-1 truncate min-w-0">
                                {[row.first_name, row.last_name].filter(Boolean).join(" ") || (
                                    <span className="text-slate-400">Unnamed employee</span>
                                )}
                            </span>
                            <span className="text-xs text-slate-400 font-mono hidden sm:inline">{row.employee_number || "—"}</span>
                            <Pill count={contacts.length} color={contacts.length > 0 ? "blue" : "slate"} />
                            <span className="text-xs text-slate-400 hidden md:inline">{contacts.length === 1 ? "contact" : "contacts"}</span>
                        </button>

                        {/* Expanded contacts */}
                        {isOpen && (
                            <div className="px-4 sm:px-6 pb-4 space-y-3 bg-slate-50/60">
                                {contacts.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-2">No emergency contacts added yet.</p>
                                ) : (
                                    contacts.map((contact, ci) => (
                                        <div key={ci} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">Contact {ci + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact(ri, ci)}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors p-1 -m-1"
                                                    aria-label="Remove contact"
                                                >
                                                    <Trash2 size={14} strokeWidth={2} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { key: "contact_person_name",         label: "Full name",     placeholder: "Maria Dela Cruz"        },
                                                    { key: "contact_person_relationship",  label: "Relationship", placeholder: "Spouse, Parent, Sibling" },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">{label}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={contact[key] ?? ""}
                                                            onChange={e => updateContact(ri, ci, key, e.target.value)}
                                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    { key: "contact_person_phone",     label: "Phone",     placeholder: "09XX XXX XXXX"    },
                                                    { key: "contact_person_telephone", label: "Telephone", placeholder: "(02) XXXX XXXX" },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <label className="block text-[11px] font-medium text-slate-500 mb-1.5">{label}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={contact[key] ?? ""}
                                                            onChange={e => updateContact(ri, ci, key, e.target.value)}
                                                            className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Address</label>
                                                <input
                                                    type="text"
                                                    placeholder="House No., Street, Barangay, City"
                                                    value={contact.contact_person_address ?? ""}
                                                    onChange={e => updateContact(ri, ci, "contact_person_address", e.target.value)}
                                                    className="w-full h-9 px-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button
                                    type="button"
                                    onClick={() => addContact(ri)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <Plus size={14} strokeWidth={2} /> Add contact
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}