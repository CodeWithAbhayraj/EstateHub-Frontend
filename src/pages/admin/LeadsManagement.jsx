import { useEffect, useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Search,
  CalendarDays,
  IndianRupee,
  Building2,
  ChevronDown,
} from "lucide-react";

import {
  getAllLeads,
  updateLeadStatus,
} from "../../api/leadApi";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "VISIT_SCHEDULED",
  "NEGOTIATION",
  "CLOSED",
  "REJECTED",
];

function StatusBadge({ status }) {
  const statusClasses = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    VISIT_SCHEDULED: "bg-purple-100 text-purple-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    CLOSED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusClasses[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status?.replaceAll("_", " ") || "UNKNOWN"}
    </span>
  );
}

function LeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [updatingId, setUpdatingId] = useState(null);
  const [remarks, setRemarks] = useState({});

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllLeads();

      const leadData = Array.isArray(data) ? data : [];

      setLeads(leadData);
      setFilteredLeads(leadData);
    } catch (err) {
      console.error("Leads error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load leads."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const searchValue = search.toLowerCase().trim();

    const result = leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        String(lead.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(lead.propertyTitle || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(lead.propertyId || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(lead.message || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredLeads(result);
  }, [search, statusFilter, leads]);

  const handleStatusChange = async (leadId, status) => {
    try {
      setUpdatingId(leadId);
      setError("");

      const updatedLead = await updateLeadStatus(leadId, {
        status,
        remarks: remarks[leadId] || "",
      });

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? updatedLead
            : lead
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update lead status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemarksChange = (leadId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [leadId]: value,
    }));
  };

  const formatCurrency = (value) => {
    if (!value) return "₹0";

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Leads Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage buyer enquiries and update lead progress.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by lead, property or message..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-500"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 outline-none focus:border-slate-500"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">
                  Total Leads
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {leads.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-orange-600" />
              <div>
                <p className="text-sm text-slate-500">
                  New Leads
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    leads.filter(
                      (lead) => lead.status === "NEW"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="text-green-600" />
              <div>
                <p className="text-sm text-slate-500">
                  Closed Leads
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    leads.filter(
                      (lead) => lead.status === "CLOSED"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading leads...
              </p>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare
              size={40}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No leads found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No leads match the current search or filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Lead
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Property
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Budget
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Visit Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Message
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Remarks
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                        Update
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-5 align-top">
                          <p className="font-semibold text-slate-900">
                            #{lead.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(lead.createdAt)}
                          </p>
                        </td>

                        <td className="px-5 py-5 align-top">
                          <p className="font-semibold text-slate-900">
                            {lead.propertyTitle ||
                              "Property"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Property ID: {lead.propertyId}
                          </p>
                        </td>

                        <td className="px-5 py-5 align-top">
                          <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <IndianRupee size={15} />
                            {formatCurrency(
                              lead.budget
                            ).replace("₹", "")}
                          </div>
                        </td>

                        <td className="px-5 py-5 align-top">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays size={15} />
                            {formatDate(
                              lead.preferredVisitDate
                            )}
                          </div>
                        </td>

                        <td className="max-w-xs px-5 py-5 align-top">
                          <p className="line-clamp-3 text-sm text-slate-600">
                            {lead.message || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-5 align-top">
                          <StatusBadge status={lead.status} />
                        </td>

                        <td className="px-5 py-5 align-top">
                          <textarea
                            rows="2"
                            value={remarks[lead.id] ?? lead.remarks ?? ""}
                            onChange={(e) =>
                              handleRemarksChange(
                                lead.id,
                                e.target.value
                              )
                            }
                            placeholder="Add remarks..."
                            className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                          />
                        </td>

                        <td className="px-5 py-5 align-top">
                          <div className="relative">
                            <select
                              value={lead.status || "NEW"}
                              onChange={(e) =>
                                handleStatusChange(
                                  lead.id,
                                  e.target.value
                                )
                              }
                              disabled={
                                updatingId === lead.id
                              }
                              className="w-44 appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm outline-none disabled:opacity-50"
                            >
                              {LEAD_STATUSES.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status.replaceAll(
                                      "_",
                                      " "
                                    )}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 lg:hidden">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">
                        Lead #{lead.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {lead.propertyTitle ||
                          "Property"}
                      </p>
                    </div>

                    <StatusBadge status={lead.status} />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 size={16} />
                      Property ID: {lead.propertyId}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <IndianRupee size={16} />
                      {formatCurrency(lead.budget)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={16} />
                      {formatDate(
                        lead.preferredVisitDate
                      )}
                    </div>

                    <div className="text-sm text-slate-500">
                      Created: {formatDate(lead.createdAt)}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Message
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {lead.message || "—"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Remarks
                    </label>

                    <textarea
                      rows="3"
                      value={remarks[lead.id] ?? lead.remarks ?? ""}
                      onChange={(e) =>
                        handleRemarksChange(
                          lead.id,
                          e.target.value
                        )
                      }
                      placeholder="Add remarks..."
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Update Status
                    </label>

                    <select
                      value={lead.status || "NEW"}
                      onChange={(e) =>
                        handleStatusChange(
                          lead.id,
                          e.target.value
                        )
                      }
                      disabled={updatingId === lead.id}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none disabled:opacity-50"
                    >
                      {LEAD_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeadsManagement;