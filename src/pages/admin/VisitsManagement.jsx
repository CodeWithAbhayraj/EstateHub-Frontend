import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  RefreshCw,
  Search,
  User,
  Building2,
} from "lucide-react";

import {
  getAllVisits,
  updateVisitStatus,
} from "../../api/visitApi";

function VisitsManagement() {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL VISITS
  // ==========================================
  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllVisits();

      const visitList = Array.isArray(data) ? data : [];

      setVisits(visitList);
      setFilteredVisits(visitList);
    } catch (err) {
      console.error("Visits error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load visits."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================
  useEffect(() => {
    const value = search.toLowerCase().trim();

    const result = visits.filter((visit) => {
      const matchesSearch =
        !value ||
        String(visit.propertyTitle || "")
          .toLowerCase()
          .includes(value) ||
        String(visit.buyerName || "")
          .toLowerCase()
          .includes(value) ||
        String(visit.id || "")
          .toLowerCase()
          .includes(value) ||
        String(visit.propertyId || "")
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "ALL" ||
        visit.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredVisits(result);
  }, [search, statusFilter, visits]);

  // ==========================================
  // UPDATE VISIT STATUS
  // ==========================================
  const handleStatusChange = async (visitId, status) => {
    try {
      setActionLoading(visitId);
      setError("");

      const response = await updateVisitStatus(visitId, {
        status,
      });

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === visitId
            ? response
            : visit
        )
      );
    } catch (err) {
      console.error("Update visit status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update visit status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "RESCHEDULED":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================
  const formatStatus = (status) => {
    if (!status) return "UNKNOWN";

    return status.replaceAll("_", " ");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Visits Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage property visits and update their status.
            </p>
          </div>

          <button
            onClick={fetchVisits}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            SEARCH + FILTER
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search property, buyer, ID..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="SCHEDULED">
                SCHEDULED
              </option>

              <option value="COMPLETED">
                COMPLETED
              </option>

              <option value="CANCELLED">
                CANCELLED
              </option>

              <option value="RESCHEDULED">
                RESCHEDULED
              </option>
            </select>

          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Visits
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {visits.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Scheduled
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-600">
              {
                visits.filter(
                  (visit) =>
                    visit.status === "SCHEDULED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {
                visits.filter(
                  (visit) =>
                    visit.status === "COMPLETED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              {
                visits.filter(
                  (visit) =>
                    visit.status === "CANCELLED"
                ).length
              }
            </p>
          </div>

        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading visits...
              </p>

            </div>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <CalendarDays
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No visits found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No visits match your search or filter.
            </p>

          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Visit
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Buyer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredVisits.map((visit) => (

                    <tr
                      key={visit.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* VISIT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <CalendarDays
                              size={18}
                              className="text-slate-600"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              Visit #{visit.id}
                            </p>

                            <p className="text-xs text-slate-500">
                              Lead #{visit.leadId}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* BUYER */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <User
                            size={16}
                            className="text-slate-400"
                          />

                          <span className="text-sm font-medium text-slate-700">
                            {visit.buyerName ||
                              `Buyer #${visit.buyerId}`}
                          </span>

                        </div>
                      </td>

                      {/* PROPERTY */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <Building2
                            size={16}
                            className="text-slate-400"
                          />

                          <div>
                            <p className="max-w-[220px] truncate text-sm font-medium text-slate-700">
                              {visit.propertyTitle ||
                                `Property #${visit.propertyId}`}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID #{visit.propertyId}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />

                          {visit.visitDate || "—"}

                        </div>

                      </td>

                      {/* TIME */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Clock
                            size={15}
                            className="text-slate-400"
                          />

                          {visit.visitTime || "—"}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            visit.status
                          )}`}
                        >
                          {formatStatus(
                            visit.status
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <select
                          value={visit.status || ""}
                          disabled={
                            actionLoading ===
                            visit.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              visit.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 disabled:opacity-50"
                        >

                          <option value="SCHEDULED">
                            Scheduled
                          </option>

                          <option value="COMPLETED">
                            Completed
                          </option>

                          <option value="CANCELLED">
                            Cancelled
                          </option>

                          <option value="RESCHEDULED">
                            Rescheduled
                          </option>

                        </select>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default VisitsManagement;