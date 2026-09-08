import { useState } from "react";
import { CalendarDays, Clock, MessageSquare } from "lucide-react";

import { createVisit } from "../../api/visitApi";

function VisitForm({ propertyId, leadId, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    visitDate: "",
    visitTime: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!propertyId) return setError("Property ID is missing.");
      if (!leadId) return setError("Please submit a property enquiry before scheduling a visit.");
      if (!formData.visitDate) return setError("Please select a visit date.");
      if (!formData.visitTime) return setError("Please select a visit time.");

      const visitData = {
        leadId: Number(leadId),
        propertyId: Number(propertyId),
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        remarks: formData.remarks.trim(),
      };

      const response = await createVisit(visitData);

      onSuccess?.(response);
    } catch (err) {
      console.error("Visit creation error:", err);
      setError(err.response?.data?.message || "Unable to schedule the visit.");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrapClass =
    "flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Schedule Property Visit</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select your preferred date and time for visiting this property.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Visit Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Visit Date</label>
          <div className={fieldWrapClass}>
            <CalendarDays size={17} className="ml-3 shrink-0 text-slate-400" />
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Visit Time */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Visit Time</label>
          <div className={fieldWrapClass}>
            <Clock size={17} className="ml-3 shrink-0 text-slate-400" />
            <input
              type="time"
              name="visitTime"
              value={formData.visitTime}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Remarks</label>
          <div className={`items-start ${fieldWrapClass}`}>
            <MessageSquare size={17} className="ml-3 mt-2.5 shrink-0 text-slate-400" />
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any special request or note..."
              rows={4}
              className="w-full resize-none rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarDays size={16} />
            {loading ? "Scheduling..." : "Schedule Visit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VisitForm;