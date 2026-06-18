import { useState } from "react";
import { router } from "@inertiajs/react";
import { X, RotateCcw } from "lucide-react";

export default function RehireModal({ employee, onClose }) {
  const [rehireDate, setRehireDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    router.patch(
      `/employees/${employee.id}/rehire`,
      { rehire_date: rehireDate, reason },
      {
        onError: (err) => setErrors(err),
        onFinish: () => setProcessing(false),
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B5BA5]/10">
              <RotateCcw className="h-4 w-4 text-[#3B5BA5]" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Rehire Employee</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Rehiring {employee.first_name} {employee.last_name} will set their status back to Active.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Effective date</label>
            <input
              type="date"
              value={rehireDate}
              onChange={(e) => setRehireDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#3B5BA5] focus:outline-none focus:ring-1 focus:ring-[#3B5BA5]"
              required
            />
            {errors.rehire_date && <p className="mt-1 text-xs text-red-600">{errors.rehire_date}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Note / remarks</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Optional context about the rehire…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#3B5BA5] focus:outline-none focus:ring-1 focus:ring-[#3B5BA5]"
            />
            {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-[#3B5BA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#33508f] disabled:opacity-60"
            >
              {processing ? "Rehiring…" : "Confirm rehire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}