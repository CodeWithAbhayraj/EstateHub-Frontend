import { useState } from "react";
import { CalendarDays, IndianRupee, MessageSquare, Send } from "lucide-react";

import { createLead } from "../../api/leadApi";
import Button from "../common/Button";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!propertyId) return setError("Property ID is missing.");
      if (!formData.budget) return setError("Please enter your budget.");
      if (!formData.message.trim()) return setError("Please enter your message.");

      const leadData = {
        propertyId: Number(propertyId),
        budget: Number(formData.budget),
        preferredVisitDate: formData.preferredVisitDate || null,
        message: formData.message.trim(),
      };

      const response = await createLead(leadData);

      setSuccess(response?.message || "Your enquiry has been submitted successfully.");
      setFormData({ budget: "", preferredVisitDate: "", message: "" });

      onSuccess?.(response);
    } catch (err) {
      console.error("Lead creation error:", err);
      setError(err.response?.data?.message || "Unable to submit your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrapClass =
    "flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-brand-500";

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Contact Agent</h2>
        <p className="mt-1 text-sm text-slate-500">
          Send your enquiry to EstateHub regarding this property.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Budget */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Budget</label>
          <div className={fieldWrapClass}>
            <IndianRupee size={17} className="ml-3 text-slate-400" />
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              min="0"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Preferred Visit Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Preferred Visit Date</label>
          <div className={fieldWrapClass}>
            <CalendarDays size={17} className="ml-3 text-slate-400" />
            <input
              type="date"
              name="preferredVisitDate"
              value={formData.preferredVisitDate}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
          <div className={`items-start ${fieldWrapClass}`}>
            <MessageSquare size={17} className="ml-3 mt-2.5 text-slate-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your enquiry..."
              rows={4}
              className="w-full resize-none rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
              Cancel
            </Button>
          )}

          <Button type="submit" variant="accent" disabled={loading} className="flex-1">
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LeadForm;