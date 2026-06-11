import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const nameFields = [
  { name: "first_name",  label: "First Name",  placeholder: "Juan",              required: true },
  { name: "middle_name", label: "Middle Name", placeholder: "Santos (optional)", required: false },
  { name: "last_name",   label: "Last Name",   placeholder: "Dela Cruz",         required: true },
  { name: "suffix",      label: "Suffix",      placeholder: "Jr., Sr., III",     required: false },
];

const contactFields = [
  { name: "phone_number",     label: "Phone Number",     placeholder: "09XX XXX XXXX" },
  { name: "telephone_number", label: "Telephone Number", placeholder: "(02) XXXX XXXX" },
  { name: "email",            label: "Email",            placeholder: "juan@email.com", type: "email" },
  { name: "alternate_email",  label: "Alternate Email",  placeholder: "alt@email.com",  type: "email" },
];

const educationFields = [
  { name: "highest_education", label: "Highest Education", placeholder: "e.g. Bachelor's Degree" },
  { name: "course",            label: "Course",            placeholder: "e.g. BS Computer Science" },
  { name: "school",            label: "School",            placeholder: "e.g. University of the Philippines" },
];

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

export default function Step1PersonalInfo({ form, onChange, errors = {} }) {

  const handleBirthDateChange = (e) => {
    onChange(e);

    const birthDate = new Date(e.target.value);
    if (!isNaN(birthDate)) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        onChange({ target: { name: "age", value: age } });
    } else {
        onChange({ target: { name: "age", value: "" } });
    }
};

  return (
    <div className="space-y-8">

      {/* ── Basic Info ─────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading
          title="Personal Information"
          description="Fill in the employee's basic details."
        />

        {/* Employee Number */}
        <div className="max-w-xs">
          <Field label="Employee Number" required error={errors.employee_number}>
            <Input
              name="employee_number"
              placeholder="e.g. EMP-0001"
              value={form.employee_number ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-4 gap-4">
          {nameFields.map(({ name, label, placeholder, required }) => (
            <Field key={name} label={label} required={required} error={errors[name]}>
              <Input
                name={name}
                placeholder={placeholder}
                value={form[name] ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
          ))}
        </div>
      </div>

      {/* ── Personal Details ───────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading title="Personal Details" />

        <div className="grid grid-cols-3 gap-4">
          <Field label="Birth Date" error={errors.birth_date}>
            <Input
              name="birth_date"
              type="date"
              value={form.birth_date ?? ""}
              onChange={handleBirthDateChange}
              className="!bg-white"
            />
          </Field>

          <Field label="Age" error={errors.age}>
            <Input
              name="age"
              type="number"
              value={form.age ?? ""}
              readOnly
              className="bg-gray-50 cursor-not-allowed text-gray-500"
            />
          </Field>

          <Field label="Birth Place" error={errors.birth_place}>
            <Input
              name="birth_place"
              placeholder="e.g. Manila"
              value={form.birth_place ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Field label="Gender" error={errors.gender}>
            <Select
              value={form.gender ?? ""}
              onValueChange={(v) => onChange({ target: { name: "gender", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Civil Status" error={errors.civil_status}>
            <Select
              value={form.civil_status ?? ""}
              onValueChange={(v) => onChange({ target: { name: "civil_status", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Nationality" error={errors.nationality}>
            <Input
              name="nationality"
              placeholder="e.g. Filipino"
              value={form.nationality ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>

          <Field label="Religion" error={errors.religion}>
            <Input
              name="religion"
              placeholder="e.g. Catholic"
              value={form.religion ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
        </div>
      </div>

      {/* ── Address ────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading title="Address" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Home Address" error={errors.home_address}>
            <Input
              name="home_address"
              placeholder="House No., Street, Barangay, City"
              value={form.home_address ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
          <Field label="Current Address" error={errors.current_address}>
            <Input
              name="current_address"
              placeholder="Leave blank if same as home"
              value={form.current_address ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
        </div>
      </div>

      {/* ── Contact ────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading title="Contact Information" />
        <div className="grid grid-cols-2 gap-4">
          {contactFields.map(({ name, label, placeholder, type = "text" }) => (
            <Field key={name} label={label} error={errors[name]}>
              <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name] ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
          ))}
        </div>
      </div>

      {/* ── Education ──────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading title="Educational Background" />
        <div className="grid grid-cols-3 gap-4">
          {educationFields.map(({ name, label, placeholder }) => (
            <Field key={name} label={label} error={errors[name]}>
              <Input
                name={name}
                placeholder={placeholder}
                value={form[name] ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
          ))}
        </div>
      </div>

    </div>
  );
}