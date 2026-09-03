import { useState } from "react";
import { CalendarDays, Clock, MessageSquare } from "lucide-react";

import { createVisit } from "../../api/visitApi";

function VisitForm({
  propertyId,
  leadId,
  onSuccess,
  onClose,
}) {
  const [formData, setFormData] = useState({
    visitDate: "",
    visitTime: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!propertyId) {
        setError("Property ID is missing.");
        return;
      }

      if (!leadId) {
        setError(
          "Please submit a property enquiry before scheduling a visit."
        );
        return;
      }

      if (!formData.visitDate) {
        setError("Please select a visit date.");
        return;
      }

      if (!formData.visitTime) {
        setError("Please select a visit time.");
        return;
      }

      const visitData = {
        leadId: Number(leadId),
        propertyId: Number(propertyId),
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        remarks: formData.remarks.trim(),
      };

      const response = await createVisit(visitData);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error("Visit creation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to schedule the visit."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Schedule Property Visit
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select your preferred date and time for visiting
          this property.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Visit Date */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Visit Date
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <CalendarDays
              size={18}
              className="ml-3 text-slate-400"
            />

            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg px-3 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* Visit Time */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Visit Time
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <Clock
              size={18}
              className="ml-3 text-slate-400"
            />

            <input
              type="time"
              name="visitTime"
              value={formData.visitTime}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Remarks
          </label>

          <div className="flex items-start rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <MessageSquare
              size={18}
              className="ml-3 mt-3 text-slate-400"
            />

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any special request or note..."
              rows={4}
              className="w-full resize-none rounded-lg px-3 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarDays size={17} />

            {loading ? "Scheduling..." : "Schedule Visit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VisitForm;