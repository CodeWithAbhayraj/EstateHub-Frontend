import { useState } from "react";
import { CalendarDays, IndianRupee, MessageSquare, Send } from "lucide-react";

import { createLead } from "../../api/leadApi";

function LeadForm({ propertyId, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    budget: "",
    preferredVisitDate: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("");

      if (!propertyId) {
        setError("Property ID is missing.");
        return;
      }

      if (!formData.budget) {
        setError("Please enter your budget.");
        return;
      }

      if (!formData.message.trim()) {
        setError("Please enter your message.");
        return;
      }

      const leadData = {
        propertyId: Number(propertyId),
        budget: Number(formData.budget),
        preferredVisitDate:
          formData.preferredVisitDate || null,
        message: formData.message.trim(),
      };

      const response = await createLead(leadData);

      setSuccess(
        response?.message ||
          "Your enquiry has been submitted successfully."
      );

      setFormData({
        budget: "",
        preferredVisitDate: "",
        message: "",
      });

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error("Lead creation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit your enquiry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Contact Agent
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Send your enquiry to EstateHub regarding this
          property.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Budget */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Your Budget
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <IndianRupee
              size={18}
              className="ml-3 text-slate-400"
            />

            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              min="0"
              className="w-full rounded-lg px-3 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* Preferred Visit Date */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Preferred Visit Date
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <CalendarDays
              size={18}
              className="ml-3 text-slate-400"
            />

            <input
              type="date"
              name="preferredVisitDate"
              value={formData.preferredVisitDate}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Message
          </label>

          <div className="flex items-start rounded-lg border border-slate-200 bg-white focus-within:border-blue-500">
            <MessageSquare
              size={18}
              className="ml-3 mt-3 text-slate-400"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your enquiry..."
              rows={5}
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
            <Send size={17} />

            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeadForm;