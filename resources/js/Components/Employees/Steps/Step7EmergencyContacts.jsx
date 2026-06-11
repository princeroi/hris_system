import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

function SectionHeading({ title, description }) {
    return (
        <div className="pb-3 border-b border-[#BFDBFE]">
            <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
            {description && <p className="text-sm text-[#3B5BA5] mt-1">{description}</p>}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <Label>{label}</Label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

const emptyContact = {
    contact_person_name:         "",
    contact_person_relationship: "",
    contact_person_phone:        "",
    contact_person_telephone:    "",
    contact_person_address:      "",
};

export default function Step7EmergencyContacts({ form, onBulkChange, errors = {} }) {
    const contacts = form.emergency_contacts ?? [];

    const update = (index, field, value) => {
        const updated = contacts.map((c, i) =>
            i === index ? { ...c, [field]: value } : c
        );
        onBulkChange({ emergency_contacts: updated });
    };

    const addContact = () => {
        onBulkChange({ emergency_contacts: [...contacts, { ...emptyContact }] });
    };

    const removeContact = (index) => {
        onBulkChange({ emergency_contacts: contacts.filter((_, i) => i !== index) });
    };

    const contactError = (index, field) =>
        errors[`emergency_contacts.${index}.${field}`] ||
        errors?.[`emergency_contacts`]?.[index]?.[field];

    return (
        <div className="space-y-8">
            <SectionHeading
                title="Emergency Contacts"
                description="Add one or more people to contact in case of emergency."
            />

            {contacts.length === 0 && (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-[#BFDBFE] rounded-lg">
                    <p className="text-sm">No emergency contacts added yet.</p>
                    <p className="text-xs mt-1">Click the button below to add a contact.</p>
                </div>
            )}

            <div className="space-y-6">
                {contacts.map((contact, index) => (
                    <div
                        key={index}
                        className="border border-[#BFDBFE] rounded-lg p-5 space-y-4 bg-[#F8FAFF]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#1E40AF]">
                                Contact #{index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeContact(index)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Remove contact"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Name + Relationship */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Contact Person Name" error={contactError(index, "contact_person_name")}>
                                <Input
                                    placeholder="e.g. Maria Dela Cruz"
                                    value={contact.contact_person_name ?? ""}
                                    onChange={(e) => update(index, "contact_person_name", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field label="Relationship" error={contactError(index, "contact_person_relationship")}>
                                <Input
                                    placeholder="e.g. Spouse, Parent, Sibling"
                                    value={contact.contact_person_relationship ?? ""}
                                    onChange={(e) => update(index, "contact_person_relationship", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                        </div>

                        {/* Phone + Telephone */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Phone Number" error={contactError(index, "contact_person_phone")}>
                                <Input
                                    placeholder="09XX XXX XXXX"
                                    value={contact.contact_person_phone ?? ""}
                                    onChange={(e) => update(index, "contact_person_phone", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                            <Field label="Telephone Number" error={contactError(index, "contact_person_telephone")}>
                                <Input
                                    placeholder="(02) XXXX XXXX"
                                    value={contact.contact_person_telephone ?? ""}
                                    onChange={(e) => update(index, "contact_person_telephone", e.target.value)}
                                    className="!bg-white"
                                />
                            </Field>
                        </div>

                        {/* Address */}
                        <Field label="Address" error={contactError(index, "contact_person_address")}>
                            <Input
                                placeholder="House No., Street, Barangay, City"
                                value={contact.contact_person_address ?? ""}
                                onChange={(e) => update(index, "contact_person_address", e.target.value)}
                                className="!bg-white"
                            />
                        </Field>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="info-outline"
                    size="sm"
                    onClick={addContact}
                    className="flex items-center gap-2"
                >
                    <PlusCircle size={16} />
                    Add Emergency Contact
                </Button>
            </div>
        </div>
    );
}