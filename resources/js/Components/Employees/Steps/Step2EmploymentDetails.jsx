// resources/js/Components/Employees/Steps/Step2EmploymentDetails.jsx

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

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function toDateInput(date) {
  return date.toISOString().split("T")[0];
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function todayInput() {
  return toDateInput(new Date());
}

/**
 * Derives contract_status from contract_date_to:
 *   - blank          → "valid"
 *   - past (< today) → "expired"
 *   - today or future → "valid"
 */
function deriveContractStatus(endDateStr) {
  if (!endDateStr) return "valid";
  const end   = new Date(endDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return end < today ? "expired" : "valid";
}

// Employment types that use contract dates instead of regularization
const CONTRACT_TYPES  = ["contractual", "project_based", "part_time", "intern"];
const RELIEVER_TYPE   = "reliever";
const PROBATION_TYPES = ["probationary", "regular"];

export default function Step2EmploymentDetails({
  form, onChange, errors = {},
  companies = [], branches = [], departments = [], positions = [],
}) {
  const sel = (name) => (v) => onChange({ target: { name, value: v } });

  const isContractType  = CONTRACT_TYPES.includes(form.employment_type);
  const isRelieverType  = form.employment_type === RELIEVER_TYPE;
  const isProbationType = PROBATION_TYPES.includes(form.employment_type);
  const hasType         = !!form.employment_type;

  // ── Hired date change ─────────────────────────────────────────────────────
  const handleHiredDateChange = (e) => {
    onChange(e);
    const hired = new Date(e.target.value);
    if (isNaN(hired)) return;

    const type = form.employment_type;

    if (PROBATION_TYPES.includes(type)) {
      const regDate  = toDateInput(addMonths(hired, 6));
      const evalDate = toDateInput(addMonths(hired, Number(form.probationary_period_months) || 6));
      onChange({ target: { name: "regularization_date",          value: regDate  } });
      onChange({ target: { name: "probationary_evaluation_date", value: evalDate } });
    }

    if (CONTRACT_TYPES.includes(type) && !form.contract_date_from) {
      onChange({ target: { name: "contract_date_from", value: toDateInput(hired) } });
    }
  };

  // ── Employment type change ────────────────────────────────────────────────
  const handleEmploymentTypeChange = (value) => {
    onChange({ target: { name: "employment_type", value } });

    const hired = form.hired_date ? new Date(form.hired_date) : new Date();

    onChange({ target: { name: "status", value: "active" } });

    if (PROBATION_TYPES.includes(value)) {
      // Probationary / regular — no contract dates needed
      const months   = Number(form.probationary_period_months) || 6;
      const regDate  = toDateInput(addMonths(hired, 6));
      const evalDate = toDateInput(addMonths(hired, months));

      onChange({ target: { name: "regularization_date",          value: regDate  } });
      onChange({ target: { name: "probationary_period_months",   value: months   } });
      onChange({ target: { name: "probationary_evaluation_date", value: evalDate } });

      // Clear contract date fields
      onChange({ target: { name: "contract_date_from", value: ""      } });
      onChange({ target: { name: "contract_date_to",   value: ""      } });
      onChange({ target: { name: "contract_status",    value: "valid" } });

    } else {
      // Non-probationary: clear probation-specific fields, keep contract dates
      onChange({ target: { name: "regularization_date",          value: "" } });
      onChange({ target: { name: "probationary_period_months",   value: "" } });
      onChange({ target: { name: "probationary_evaluation_date", value: "" } });

      // Seed contract_date_from if not set
      if (CONTRACT_TYPES.includes(value) && !form.contract_date_from) {
        onChange({ target: { name: "contract_date_from", value: todayInput() } });
      }

      // Derive contract_status from existing contract_date_to
      const derived = deriveContractStatus(form.contract_date_to);
      onChange({ target: { name: "contract_status", value: derived } });
      if (derived === "expired") {
        onChange({ target: { name: "status", value: "contract_end" } });
      }
    }
  };

  // ── Contract end date change ──────────────────────────────────────────────
  const handleContractEndDateChange = (e) => {
    const endDateStr = e.target.value;
    onChange(e);

    const derived = deriveContractStatus(endDateStr);
    onChange({ target: { name: "contract_status", value: derived } });
    onChange({ target: { name: "status",          value: derived === "expired" ? "contract_end" : "active" } });
  };

  // ── Probationary months change ────────────────────────────────────────────
  const handleProbationaryMonthsChange = (e) => {
    onChange(e);
    const months = parseInt(e.target.value, 10);
    if (isNaN(months) || months <= 0) return;
    const hired = form.hired_date ? new Date(form.hired_date) : new Date();
    onChange({ target: { name: "probationary_evaluation_date", value: toDateInput(addMonths(hired, months)) } });
  };

  return (
    <div className="space-y-8">

      {/* ── Employment Classification ────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading title="Employment Classification" />

        <div className="grid grid-cols-3 gap-4">
          <Field label="Employment Type" error={errors.employment_type}>
            <Select
              value={form.employment_type ?? ""}
              onValueChange={handleEmploymentTypeChange}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="probationary">Probationary</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="project_based">Project-based</SelectItem>
                <SelectItem value="contractual">Contractual</SelectItem>
                <SelectItem value="reliever">Reliever</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status" error={errors.status}>
            <Select value={form.status ?? ""} onValueChange={sel("status")}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="resigned">Resigned</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="contract_end">Contract End</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Contract Status" error={errors.contract_status}>
            <Select
              value={form.contract_status ?? ""}
              onValueChange={sel("contract_status")}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* ── Employment Dates ─────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading
          title="Employment Dates"
          description={
            isProbationType
              ? "Probationary/Regular: regularization and evaluation dates are derived automatically."
              : !isRelieverType
                ? "Contract types: contract start and end dates are required."
                : undefined
          }
        />

        {/* Contract types: Hired + Contract Start + Contract End */}
        {isContractType && (
          <div className="grid grid-cols-3 gap-4">
            <Field label="Hired Date" error={errors.hired_date}>
              <Input
                name="hired_date"
                type="date"
                value={form.hired_date ?? ""}
                onChange={handleHiredDateChange}
                className="!bg-white"
              />
            </Field>
            <Field label="Contract Start Date" required error={errors.contract_date_from}>
              <Input
                name="contract_date_from"
                type="date"
                value={form.contract_date_from ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
            <Field
              label="Contract End Date"
              required
              error={errors.contract_date_to}
              hint="Contract status updates automatically when this date passes."
            >
              <Input
                name="contract_date_to"
                type="date"
                value={form.contract_date_to ?? ""}
                onChange={handleContractEndDateChange}
                className="!bg-white"
              />
            </Field>
          </div>
        )}

        {/* Reliever: Hired Date only */}
        {isRelieverType && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hired Date" error={errors.hired_date}>
              <Input
                name="hired_date"
                type="date"
                value={form.hired_date ?? ""}
                onChange={handleHiredDateChange}
                className="!bg-white"
              />
            </Field>
            <div />
          </div>
        )}

        {/* Probationary / Regular: Hired Date + Regularization Date */}
        {isProbationType && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hired Date" error={errors.hired_date}>
              <Input
                name="hired_date"
                type="date"
                value={form.hired_date ?? ""}
                onChange={handleHiredDateChange}
                className="!bg-white"
              />
            </Field>
            <Field
              label="Regularization Date"
              error={errors.regularization_date}
              hint="Auto-set to 6 months after hired date."
            >
              <Input
                name="regularization_date"
                type="date"
                value={form.regularization_date ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
          </div>
        )}

        {/* No type selected */}
        {!hasType && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hired Date" error={errors.hired_date}>
              <Input
                name="hired_date"
                type="date"
                value={form.hired_date ?? ""}
                onChange={handleHiredDateChange}
                className="!bg-white"
              />
            </Field>
            <div />
          </div>
        )}
      </div>

      {/* ── Assignment ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading
          title="Assignment"
          description="Where this employee is assigned."
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company" error={errors.company_id}>
            <Select
              value={form.company_id ? String(form.company_id) : ""}
              onValueChange={(v) => onChange({ target: { name: "company_id", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
              <SelectContent>
                {companies.length === 0 && <SelectItem value="_none" disabled>No companies available</SelectItem>}
                {companies.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.company_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Branch" error={errors.branch_id}>
            <Select
              value={form.branch_id ? String(form.branch_id) : ""}
              onValueChange={(v) => onChange({ target: { name: "branch_id", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {branches.length === 0 && <SelectItem value="_none" disabled>No branches available</SelectItem>}
                {branches.map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.branch_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Department" error={errors.department_id}>
            <Select
              value={form.department_id ? String(form.department_id) : ""}
              onValueChange={(v) => onChange({ target: { name: "department_id", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {departments.length === 0 && <SelectItem value="_none" disabled>No departments available</SelectItem>}
                {departments.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.department_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Position" error={errors.position_id}>
            <Select
              value={form.position_id ? String(form.position_id) : ""}
              onValueChange={(v) => onChange({ target: { name: "position_id", value: v } })}
            >
              <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
              <SelectContent>
                {positions.length === 0 && <SelectItem value="_none" disabled>No positions available</SelectItem>}
                {positions.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.position_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="max-w-xs">
          <Field label="Job Level" error={errors.job_level}>
            <Input
              name="job_level"
              placeholder="e.g. Junior, Senior, Manager"
              value={form.job_level ?? ""}
              onChange={onChange}
              className="!bg-white"
            />
          </Field>
        </div>
      </div>

      {/* ── Probationary Details — regular / probationary only ───── */}
      {isProbationType && (
        <div className="space-y-4">
          <SectionHeading title="Probationary Details" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Probationary Period (months)"
              error={errors.probationary_period_months}
              hint="Default is 6 months. Evaluation date updates automatically."
            >
              <Input
                name="probationary_period_months"
                type="number"
                min={0}
                max={24}
                placeholder="e.g. 6"
                value={form.probationary_period_months ?? ""}
                onChange={handleProbationaryMonthsChange}
                className="!bg-white"
              />
            </Field>

            <Field
              label="Probationary Evaluation Date"
              error={errors.probationary_evaluation_date}
              hint="Auto-set based on hired date + probationary period."
            >
              <Input
                name="probationary_evaluation_date"
                type="date"
                value={form.probationary_evaluation_date ?? ""}
                onChange={onChange}
                className="!bg-white"
              />
            </Field>
          </div>
        </div>
      )}

    </div>
  );
}