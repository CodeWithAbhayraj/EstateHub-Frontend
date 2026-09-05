import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  IndianRupee,
} from "lucide-react";

import {
  getAllDeals,
  updateDealStatus,
} from "../../api/dealApi";

function DealsManagement() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL DEALS
  // ==========================================
  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllDeals();

      const dealList = Array.isArray(data) ? data : [];

      setDeals(dealList);
      setFilteredDeals(dealList);
    } catch (err) {
      console.error("Deals error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load deals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================
  useEffect(() => {
    const value = search.toLowerCase().trim();

    const result = deals.filter((deal) => {
      const matchesSearch =
        !value ||
        String(deal.propertyTitle || "")
          .toLowerCase()
          .includes(value) ||
        String(deal.id || "")
          .toLowerCase()
          .includes(value) ||
        String(deal.leadId || "")
          .toLowerCase()
          .includes(value) ||
        String(deal.propertyId || "")
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "ALL" ||
        deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredDeals(result);
  }, [search, statusFilter, deals]);

  // ==========================================
  // UPDATE DEAL STATUS
  // ==========================================
  const handleStatusChange = async (dealId, status) => {
    try {
      setActionLoading(dealId);
      setError("");

      const updatedDeal = await updateDealStatus(
        dealId,
        status
      );

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId
            ? updatedDeal
            : deal
        )
      );
    } catch (err) {
      console.error("Update deal status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update deal status."
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
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

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

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================
  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
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
              Deals Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor deals, amounts, commissions and status.
            </p>
          </div>

          <button
            onClick={fetchDeals}
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

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search property, deal ID, lead ID..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-500"
              />
            </div>

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

              <option value="PENDING">
                PENDING
              </option>

              <option value="COMPLETED">
                COMPLETED
              </option>

              <option value="CANCELLED">
                CANCELLED
              </option>
            </select>

          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <BriefcaseBusiness
                className="text-blue-600"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Total Deals
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {deals.length}
                </p>
              </div>

            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <Clock className="text-yellow-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status === "PENDING"
                    ).length
                  }
                </p>
              </div>

            </div>
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <CheckCircle className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status === "COMPLETED"
                    ).length
                  }
                </p>
              </div>

            </div>
          </div>

          {/* CANCELLED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <XCircle className="text-red-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Cancelled
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {
                    deals.filter(
                      (deal) =>
                        deal.status === "CANCELLED"
                    ).length
                  }
                </p>
              </div>

            </div>
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
                Loading deals...
              </p>

            </div>

          </div>
        ) : filteredDeals.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <BriefcaseBusiness
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No deals found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No deals match your search or filter.
            </p>

          </div>
        ) : (

          /* ==========================================
             DEAL TABLE
          ========================================== */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Deal
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Deal Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Commission %
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Commission
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

                  {filteredDeals.map((deal) => (

                    <tr
                      key={deal.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* DEAL */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <BriefcaseBusiness
                              size={18}
                              className="text-slate-600"
                            />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              Deal #{deal.id}
                            </p>

                            <p className="text-xs text-slate-500">
                              Lead #{deal.leadId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PROPERTY */}

                      <td className="px-5 py-4">

                        <div>

                          <p className="max-w-[250px] truncate text-sm font-semibold text-slate-800">
                            {deal.propertyTitle ||
                              `Property #${deal.propertyId}`}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Property ID #{deal.propertyId}
                          </p>

                        </div>

                      </td>

                      {/* DEAL AMOUNT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">

                          <IndianRupee size={15} />

                          {formatCurrency(
                            deal.dealAmount
                          ).replace("₹", "")}

                        </div>

                      </td>

                      {/* COMMISSION % */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-medium text-slate-700">
                          {deal.commissionPercentage}%
                        </span>

                      </td>

                      {/* COMMISSION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm font-semibold text-green-700">

                          <IndianRupee size={15} />

                          {formatCurrency(
                            deal.commissionAmount
                          ).replace("₹", "")}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            deal.status
                          )}`}
                        >
                          {formatStatus(
                            deal.status
                          )}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <select
                          value={deal.status || ""}
                          disabled={
                            actionLoading === deal.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              deal.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 disabled:opacity-50"
                        >

                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="COMPLETED">
                            Completed
                          </option>

                          <option value="CANCELLED">
                            Cancelled
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

export default DealsManagement;