// resources/js/Components/Employees/ChangeStatusModal.jsx

import { useState } from "react";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "active",       label: "Active" },
  { value: "inactive",     label: "Inactive" },
  { value: "on_leave",     label: "On Leave" },
  { value: "terminated",   label: "Terminated" },
  { value: "resigned",     label: "Resigned" },
  { value: "retired",      label: "Retired" },
  { value: "contract_end", label: "Contract End" },
];

export default function ChangeStatusModal({ employee, onClose }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    new_status:        "",
    effective_date:    today,
    last_working_date: "",
    reason:            "",
  });

  const [errors, setErrors]         = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = () => {
    setProcessing(true);
    router.patch(`/employees/${employee.id}/status`, form, {
      onSuccess: () => onClose(),
      onError:   (errs) => { setErrors(errs); setProcessing(false); },
      onFinish:  () => setProcessing(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Change Status</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {employee.first_name} {employee.last_name} · {employee.employee_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">

          {/* New Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              name="new_status"
              value={form.new_status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20"
            >
              <option value="">Select status…</option>
              {STATUS_OPTIONS.filter((opt) => opt.value !== employee.employment_details?.status).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {errors.new_status && (
              <p className="mt-1 text-xs text-red-500">{errors.new_status}</p>
            )}
          </div>

          {/* Effective Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="effective_date"
              value={form.effective_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20"
            />
            {errors.effective_date && (
              <p className="mt-1 text-xs text-red-500">{errors.effective_date}</p>
            )}
          </div>

          {/* Last Working Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Last Working Date
              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              name="last_working_date"
              value={form.last_working_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Reason
              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Enter reason for status change…"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#3B5BA5] focus:outline-none focus:ring-2 focus:ring-[#3B5BA5]/20"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="rounded-lg bg-[#3B5BA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#33508f] disabled:opacity-60"
          >
            {processing ? "Saving…" : "Apply Change"}
          </button>
        </div>

      </div>
    </div>
  );
}