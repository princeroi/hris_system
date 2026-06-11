import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

function SectionHeading({ title, description }) {
    return (
        <div className="pb-3 border-b border-[#BFDBFE]">
            <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
            {description && <p className="text-sm text-[#3B5BA5] mt-1">{description}</p>}
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div>
            <Label>
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export default function Step4BankAccount({ form, onChange, errors = {} }) {
    const sel = (name) => (v) => onChange({ target: { name, value: v } });

    // When account_name or atm_card_number changes, derive atm_status
    const handleAtmFieldChange = (e) => {
        onChange(e);

        const updatedAccountName  = e.target.name === "account_name"    ? e.target.value : (form.account_name    ?? "");
        const updatedAtmCardNumber = e.target.name === "atm_card_number" ? e.target.value : (form.atm_card_number ?? "");

        const isFilled = updatedAccountName.trim() && updatedAtmCardNumber.trim();
        onChange({ target: { name: "atm_status", value: isFilled ? "active" : "pending" } });
    };

    return (
        <div className="space-y-8">

            {/* ── Primary Bank ──────────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading title="Primary Bank Account" description="Employee's main bank account for payroll." />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Bank Name" error={errors.bank_name}>
                        <Input name="bank_name" placeholder="e.g. BDO, BPI, Metrobank" value={form.bank_name ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                    <Field label="Account Name" error={errors.account_name}>
                        <Input name="account_name" placeholder="Enter account name" value={form.account_name ?? ""} onChange={handleAtmFieldChange} className="!bg-white" />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="ATM Card Number" error={errors.atm_card_number}>
                        <Input name="atm_card_number" placeholder="Enter ATM card number" value={form.atm_card_number ?? ""} onChange={handleAtmFieldChange} className="!bg-white" />
                    </Field>
                    {/* atm_status is required — non-nullable in DB */}
                    <Field label="ATM Status" required error={errors.atm_status}>
                        <Select value={form.atm_status ?? "pending"} onValueChange={sel("atm_status")}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="released">Released</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </div>

            {/* ── GCash ─────────────────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading title="GCash" />
                <div className="grid grid-cols-2 gap-4">
                    <Field label="GCash Account Number" error={errors.gcash_account_number}>
                        <Input name="gcash_account_number" placeholder="e.g. 09XX XXX XXXX" value={form.gcash_account_number ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                    <Field label="GCash Account Name" error={errors.gcash_account_name}>
                        <Input name="gcash_account_name" placeholder="Enter GCash account name" value={form.gcash_account_name ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                </div>
            </div>

            {/* ── Other Bank ────────────────────────────────────── */}
            <div className="space-y-4">
                <SectionHeading title="Other Bank Account" description="Optional secondary account." />
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Bank Type" error={errors.other_bank_type}>
                        <Input name="other_bank_type" placeholder="e.g. Savings, Checking" value={form.other_bank_type ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                    <Field label="Bank Name" error={errors.other_bank_name}>
                        <Input name="other_bank_name" placeholder="e.g. UnionBank, Landbank" value={form.other_bank_name ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                    <Field label="Account Number" error={errors.other_account_number}>
                        <Input name="other_account_number" placeholder="Enter account number" value={form.other_account_number ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                    <Field label="Account Name" error={errors.other_account_name}>
                        <Input name="other_account_name" placeholder="Enter account name" value={form.other_account_name ?? ""} onChange={onChange} className="!bg-white" />
                    </Field>
                </div>
            </div>

        </div>
    );
}