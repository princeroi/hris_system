// resources/js/Pages/Employees/components/EmergencyContactsPanel.jsx

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, PlusCircle } from "lucide-react";
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
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            {isOpen
                                ? <ChevronDown  size={14} className="text-slate-400 shrink-0" />
                                : <ChevronRight size={14} className="text-slate-400 shrink-0" />
                            }
                            <span className="text-xs font-semibold text-slate-600 w-5 shrink-0">{ri + 1}</span>
                            <span className="text-xs font-medium text-slate-800 flex-1 truncate">
                                {[row.first_name, row.last_name].filter(Boolean).join(" ") || (
                                    <span className="text-slate-400 italic">Unnamed employee</span>
                                )}
                            </span>
                            <span className="text-xs text-slate-400">{row.employee_number || "—"}</span>
                            <Pill count={contacts.length} color={contacts.length > 0 ? "blue" : "slate"} />
                            <span className="text-xs text-slate-400 ml-1">{contacts.length === 1 ? "contact" : "contacts"}</span>
                        </button>

                        {/* Expanded contacts */}
                        {isOpen && (
                            <div className="px-6 pb-4 space-y-3 bg-slate-50/50">
                                {contacts.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic py-2">No emergency contacts added yet.</p>
                                ) : (
                                    contacts.map((contact, ci) => (
                                        <div key={ci} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-blue-700">Contact #{ci + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact(ri, ci)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { key: "contact_person_name",         label: "Full Name",     placeholder: "Maria Dela Cruz"        },
                                                    { key: "contact_person_relationship",  label: "Relationship", placeholder: "Spouse, Parent, Sibling" },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={contact[key] ?? ""}
                                                            onChange={e => updateContact(ri, ci, key, e.target.value)}
                                                            className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { key: "contact_person_phone",     label: "Phone",     placeholder: "09XX XXX XXXX"    },
                                                    { key: "contact_person_telephone", label: "Telephone", placeholder: "(02) XXXX XXXX" },
                                                ].map(({ key, label, placeholder }) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholder}
                                                            value={contact[key] ?? ""}
                                                            onChange={e => updateContact(ri, ci, key, e.target.value)}
                                                            className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">Address</p>
                                                <input
                                                    type="text"
                                                    placeholder="House No., Street, Barangay, City"
                                                    value={contact.contact_person_address ?? ""}
                                                    onChange={e => updateContact(ri, ci, "contact_person_address", e.target.value)}
                                                    className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button
                                    type="button"
                                    onClick={() => addContact(ri)}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 transition-colors"
                                >
                                    <PlusCircle size={13} /> Add contact
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}