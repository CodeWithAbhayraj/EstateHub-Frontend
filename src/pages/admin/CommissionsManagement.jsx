import { useEffect, useState } from "react";
import {
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Receipt,
} from "lucide-react";

import {
  getAllCommissions,
  updatePaymentStatus,
} from "../../api/commissionApi";

function CommissionManagement() {
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL COMMISSIONS
  // ==========================================

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCommissions();

      const commissionList = Array.isArray(data) ? data : [];

      setCommissions(commissionList);
      setFilteredCommissions(commissionList);
    } catch (err) {
      console.error("Commission error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load commissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {
    const value = search.toLowerCase().trim();

    const result = commissions.filter((commission) => {
      const matchesSearch =
        !value ||
        String(commission.propertyTitle || "")
          .toLowerCase()
          .includes(value) ||
        String(commission.id || "")
          .toLowerCase()
          .includes(value) ||
        String(commission.dealId || "")
          .toLowerCase()
          .includes(value) ||
        String(commission.leadId || "")
          .toLowerCase()
          .includes(value) ||
        String(commission.propertyId || "")
          .toLowerCase()
          .includes(value);

      const matchesPayment =
        paymentFilter === "ALL" ||
        commission.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });

    setFilteredCommissions(result);
  }, [search, paymentFilter, commissions]);

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const handlePaymentStatusChange = async (
    commissionId,
    paymentStatus
  ) => {
    try {
      setActionLoading(commissionId);
      setError("");

      const updatedCommission =
        await updatePaymentStatus(
          commissionId,
          paymentStatus
        );

      setCommissions((prev) =>
        prev.map((commission) =>
          commission.id === commissionId
            ? updatedCommission
            : commission
        )
      );
    } catch (err) {
      console.error(
        "Update payment status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update payment status."
      );
    } finally {
      setActionLoading(null);
    }
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

  // ==========================================
  // PAYMENT STATUS STYLE
  // ==========================================

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==========================================
  // TOTAL COMMISSION
  // ==========================================

  const totalCommission = commissions.reduce(
    (total, commission) =>
      total + Number(commission.commissionAmount || 0),
    0
  );

  const pendingCommission = commissions
    .filter(
      (commission) =>
        commission.paymentStatus === "PENDING"
    )
    .reduce(
      (total, commission) =>
        total + Number(commission.commissionAmount || 0),
      0
    );

  const paidCommission = commissions
    .filter(
      (commission) =>
        commission.paymentStatus === "PAID"
    )
    .reduce(
      (total, commission) =>
        total + Number(commission.commissionAmount || 0),
      0
    );

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
              Commission Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track commission amounts and payment status.
            </p>
          </div>

          <button
            onClick={fetchCommissions}
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

            {/* Search */}

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

            {/* Payment filter */}

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value="ALL">
                All Payment Statuses
              </option>

              <option value="PENDING">
                PENDING
              </option>

              <option value="PAID">
                PAID
              </option>
            </select>

          </div>

        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total records */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <Receipt className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Total Commissions
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {commissions.length}
                </p>
              </div>

            </div>
          </div>

          {/* Total amount */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <IndianRupee className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Total Commission
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(totalCommission)}
                </p>
              </div>

            </div>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <Clock className="text-yellow-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Pending Amount
                </p>

                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(pendingCommission)}
                </p>
              </div>

            </div>
          </div>

          {/* Paid */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <CheckCircle className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Paid Amount
                </p>

                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(paidCommission)}
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
                Loading commissions...
              </p>

            </div>

          </div>

        ) : filteredCommissions.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <Receipt
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No commissions found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No commission records match your search
              or filter.
            </p>

          </div>

        ) : (

          /* ==========================================
             TABLE
          ========================================== */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Commission
                    </th>

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
                      Commission Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Payment Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredCommissions.map((commission) => (

                    <tr
                      key={commission.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Commission ID */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <Receipt
                              size={18}
                              className="text-slate-600"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              #{commission.id}
                            </p>

                            <p className="text-xs text-slate-500">
                              Lead #{commission.leadId}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Deal */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-800">
                          Deal #{commission.dealId}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Property ID #{commission.propertyId}
                        </p>

                      </td>

                      {/* Property */}

                      <td className="px-5 py-4">

                        <p className="max-w-[240px] truncate text-sm font-semibold text-slate-800">
                          {commission.propertyTitle ||
                            `Property #${commission.propertyId}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {commission.type
                            ? commission.type.replaceAll(
                                "_",
                                " "
                              )
                            : "—"}
                        </p>

                      </td>

                      {/* Deal Amount */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">

                          <IndianRupee size={15} />

                          {formatCurrency(
                            commission.dealAmount
                          ).replace("₹", "")}

                        </div>

                      </td>

                      {/* Commission Percentage */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-medium text-slate-700">
                          {commission.commissionPercentage}%
                        </span>

                      </td>

                      {/* Commission Amount */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm font-bold text-green-700">

                          <IndianRupee size={15} />

                          {formatCurrency(
                            commission.commissionAmount
                          ).replace("₹", "")}

                        </div>

                      </td>

                      {/* Payment Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                            commission.paymentStatus
                          )}`}
                        >
                          {commission.paymentStatus}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <select
                          value={
                            commission.paymentStatus || ""
                          }
                          disabled={
                            actionLoading ===
                            commission.id
                          }
                          onChange={(e) =>
                            handlePaymentStatusChange(
                              commission.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 disabled:opacity-50"
                        >

                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="PAID">
                            Paid
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

export default CommissionManagement;