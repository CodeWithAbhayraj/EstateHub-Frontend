import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Search,
  CalendarDays,
  IndianRupee,
  Building2,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  UserRound,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { getAllLeads, updateLeadStatus } from "../../api/leadApi";

const LEAD_STATUSES = ["NEW", "CONTACTED", "VISIT_SCHEDULED", "NEGOTIATION", "CLOSED", "REJECTED"];

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusClasses = {
    NEW: "bg-blue-50 text-blue-700",
    CONTACTED: "bg-amber-50 text-amber-700",
    VISIT_SCHEDULED: "bg-violet-50 text-violet-700",
    NEGOTIATION: "bg-orange-50 text-orange-700",
    CLOSED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        statusClasses[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {String(status || "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, description, icon: Icon, iconClass, valueClass = "text-slate-900" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          <p className={`mt-1 text-xl font-bold sm:text-2xl ${valueClass}`}>{value}</p>
          {description && <p className="mt-1 truncate text-xs text-slate-400">{description}</p>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className="shrink-0 text-slate-400" />}
        <p className="truncate text-[11px] font-medium text-slate-400">{label}</p>
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function LeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [remarks, setRemarks] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeads = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leads error:", err);
      setError(err.response?.data?.message || "Failed to load leads.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const value = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !value ||
        [lead.id, lead.propertyTitle, lead.propertyId, lead.message].some((field) =>
          String(field || "").toLowerCase().includes(value)
        );

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const handleStatusChange = async (leadId, status) => {
    try {
      setUpdatingId(leadId);
      setError("");
      setSuccess("");

      const updatedLead = await updateLeadStatus(leadId, {
        status,
        remarks: remarks[leadId] ?? "",
      });

      setLeads((prev) => prev.map((lead) => (String(lead.id) === String(leadId) ? updatedLead : lead)));
      setSuccess(`Lead #${leadId} updated successfully.`);
    } catch (err) {
      console.error("Update lead error:", err);
      setError(err.response?.data?.message || "Failed to update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemarksChange = (leadId, value) => {
    setRemarks((prev) => ({ ...prev, [leadId]: value }));
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";
    try {
      return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "Not specified";
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const closedLeads = leads.filter((l) => l.status === "CLOSED").length;
  const negotiationLeads = leads.filter((l) => l.status === "NEGOTIATION").length;

  const activeFilter = search.trim() !== "" || statusFilter !== "ALL";

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Leads Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage buyer enquiries and track lead progress.</p>
        </div>

        <button
          type="button"
          onClick={() => fetchLeads(false)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} description="All enquiries" icon={MessageSquare} iconClass="bg-blue-50 text-blue-600" />
        <StatCard label="New Leads" value={newLeads} description="Needs attention" icon={MessageSquare} valueClass="text-amber-600" iconClass="bg-amber-50 text-amber-600" />
        <StatCard label="Negotiation" value={negotiationLeads} description="Active discussions" icon={UserRound} valueClass="text-orange-600" iconClass="bg-orange-50 text-orange-600" />
        <StatCard label="Closed Leads" value={closedLeads} description="Successfully closed" icon={CheckCircle} valueClass="text-emerald-600" iconClass="bg-emerald-50 text-emerald-600" />
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lead, property or message..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 pr-9 text-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">All Statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {!loading && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>{filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"} found</span>
            {activeFilter && (
              <button type="button" onClick={clearFilters} className="font-medium text-blue-600 hover:text-blue-700">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            <p className="mt-3 text-sm text-slate-500">Loading leads...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
          <MessageSquare size={28} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No leads found</h3>
          <p className="mt-1 text-sm text-slate-500">No leads match your search or status filter.</p>
          {activeFilter && (
            <button type="button" onClick={clearFilters} className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {["Lead", "Property", "Budget", "Visit Date", "Message", "Status", "Remarks", "Update"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 align-top">
                        <p className="font-semibold text-slate-900">Lead #{lead.id}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{formatDate(lead.createdAt)}</p>
                      </td>

                      <td className="max-w-[200px] px-4 py-4 align-top">
                        <p className="truncate text-sm font-semibold text-slate-900">{lead.propertyTitle || "Property"}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Property #{lead.propertyId}</p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <IndianRupee size={13} />
                          {formatCurrency(lead.budget).replace("₹", "")}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={14} className="text-slate-400" />
                          {formatDate(lead.preferredVisitDate)}
                        </div>
                      </td>

                      <td className="max-w-[220px] px-4 py-4 align-top">
                        <p className="line-clamp-3 text-sm text-slate-600">{lead.message || "—"}</p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <textarea
                          rows={2}
                          value={remarks[lead.id] ?? lead.remarks ?? ""}
                          onChange={(event) => handleRemarksChange(lead.id, event.target.value)}
                          placeholder="Add remarks..."
                          className="w-44 resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-slate-400"
                        />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <select
                          value={lead.status || "NEW"}
                          onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                          disabled={updatingId === lead.id}
                          className="w-40 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                        >
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE / TABLET CARDS */}
          <div className="grid gap-3 lg:hidden">
            {filteredLeads.map((lead) => {
              const isUpdating = updatingId === lead.id;

              return (
                <article key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Lead #{lead.id}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{lead.propertyTitle || "Property"}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <InfoBox label="Property ID" value={lead.propertyId ? `#${lead.propertyId}` : "—"} icon={Building2} />
                    <InfoBox label="Budget" value={formatCurrency(lead.budget)} icon={IndianRupee} />
                    <InfoBox label="Visit Date" value={formatDate(lead.preferredVisitDate)} icon={CalendarDays} />
                    <InfoBox label="Created" value={formatDate(lead.createdAt)} icon={Clock3} />
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-400">Message</p>
                    <p className="mt-1 text-sm text-slate-600">{lead.message || "No message provided."}</p>
                  </div>

                  <div className="mt-3">
                    <label htmlFor={`remarks-${lead.id}`} className="mb-1.5 block text-[11px] font-medium text-slate-400">
                      Remarks
                    </label>
                    <textarea
                      id={`remarks-${lead.id}`}
                      rows={3}
                      value={remarks[lead.id] ?? lead.remarks ?? ""}
                      onChange={(event) => handleRemarksChange(lead.id, event.target.value)}
                      placeholder="Add remarks..."
                      className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor={`status-${lead.id}`} className="mb-1.5 block text-[11px] font-medium text-slate-400">
                      Update Status
                    </label>
                    <div className="relative">
                      <select
                        id={`status-${lead.id}`}
                        value={lead.status || "NEW"}
                        onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                        disabled={isUpdating}
                        className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2.5 pr-9 text-sm font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    {isUpdating && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <RefreshCw size={12} className="animate-spin" />
                        Updating lead...
                      </div>
                    )}
                  </div>

                  {lead.propertyId && (
                    <a
                      href={`/properties/${lead.propertyId}`}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View Property
                      <ArrowRight size={14} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default LeadsManagement;