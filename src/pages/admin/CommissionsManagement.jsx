import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Receipt,
  AlertCircle,
} from "lucide-react";

import { getAllCommissions, updatePaymentStatus } from "../../api/commissionApi";

const PAYMENT_STATUSES = ["PENDING", "PAID"];

// ==========================================
// STATUS BADGE
// ==========================================

function PaymentStatusBadge({ status }) {
  const statusClasses = {
    PENDING: "bg-amber-50 text-amber-700",
    PAID: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        statusClasses[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status === "PAID" ? <CheckCircle size={12} /> : <Clock size={12} />}
      {status || "UNKNOWN"}
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

function InfoBox({ label, value, icon: Icon, valueClass = "text-slate-700" }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className="shrink-0 text-slate-400" />}
        <p className="truncate text-[11px] font-medium text-slate-400">{label}</p>
      </div>
      <p className={`mt-1 truncate text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function CommissionsManagement() {
  const [commissions, setCommissions] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCommissions = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllCommissions();
      setCommissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Commission error:", err);
      setError(err.response?.data?.message || "Failed to load commissions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const filteredCommissions = useMemo(() => {
    const value = search.toLowerCase().trim();

    return commissions.filter((commission) => {
      const matchesSearch =
        !value ||
        [commission.propertyTitle, commission.id, commission.dealId, commission.leadId, commission.propertyId]
          .some((field) => String(field || "").toLowerCase().includes(value));

      const matchesPayment = paymentFilter === "ALL" || commission.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [commissions, search, paymentFilter]);

  const handlePaymentStatusChange = async (commissionId, paymentStatus) => {
    try {
      setActionLoading(commissionId);
      setError("");
      setSuccess("");

      const updatedCommission = await updatePaymentStatus(commissionId, paymentStatus);

      setCommissions((prev) =>
        prev.map((commission) =>
          String(commission.id) === String(commissionId) ? updatedCommission : commission
        )
      );

      setSuccess(`Commission #${commissionId} updated successfully.`);
    } catch (err) {
      console.error("Update payment status error:", err);
      setError(err.response?.data?.message || "Failed to update payment status.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const totalRecords = commissions.length;
  const pendingRecords = commissions.filter((c) => c.paymentStatus === "PENDING").length;
  const paidRecords = commissions.filter((c) => c.paymentStatus === "PAID").length;

  const totalCommission = commissions.reduce((total, c) => total + Number(c.commissionAmount || 0), 0);
  const pendingCommission = commissions
    .filter((c) => c.paymentStatus === "PENDING")
    .reduce((total, c) => total + Number(c.commissionAmount || 0), 0);
  const paidCommission = commissions
    .filter((c) => c.paymentStatus === "PAID")
    .reduce((total, c) => total + Number(c.commissionAmount || 0), 0);

  const activeFilter = search.trim() !== "" || paymentFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("ALL");
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Commission Management</h1>
          <p className="mt-1 text-sm text-slate-500">Track commission earnings and payment status.</p>
        </div>

        <button
          type="button"
          onClick={() => fetchCommissions(false)}
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
        <StatCard
          label="Total Records"
          value={totalRecords}
          description={`${pendingRecords} pending · ${paidRecords} paid`}
          icon={Receipt}
          iconClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Total Commission"
          value={formatCurrency(totalCommission)}
          description="All commission earnings"
          icon={IndianRupee}
          valueClass="text-violet-600"
          iconClass="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Pending Amount"
          value={formatCurrency(pendingCommission)}
          description="Awaiting payment"
          icon={Clock}
          valueClass="text-amber-600"
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Paid Amount"
          value={formatCurrency(paidCommission)}
          description="Payment received"
          icon={CheckCircle}
          valueClass="text-emerald-600"
          iconClass="bg-emerald-50 text-emerald-600"
        />
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
              placeholder="Search property, commission ID, deal ID..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {!loading && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>
              {filteredCommissions.length} {filteredCommissions.length === 1 ? "record" : "records"} found
            </span>
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
            <p className="mt-3 text-sm text-slate-500">Loading commissions...</p>
          </div>
        </div>
      ) : filteredCommissions.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Receipt size={28} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No commissions found</h3>
          <p className="mt-1 text-sm text-slate-500">No commission records match your search or filter.</p>
          {activeFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {["Commission", "Deal", "Property", "Deal Amount", "Commission %", "Commission Amount", "Payment", "Update"].map(
                      (heading) => (
                        <th key={heading} className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCommissions.map((commission) => {
                    const isUpdating = actionLoading === commission.id;

                    return (
                      <tr key={commission.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 align-top">
                          <p className="font-semibold text-slate-900">#{commission.id}</p>
                          <p className="mt-0.5 text-xs text-slate-400">Lead #{commission.leadId || "—"}</p>
                        </td>

                        <td className="px-4 py-4 align-top text-sm">
                          <p className="font-medium text-slate-800">Deal #{commission.dealId || "—"}</p>
                          <p className="mt-0.5 text-xs text-slate-400">Property #{commission.propertyId || "—"}</p>
                        </td>

                        <td className="max-w-[200px] px-4 py-4 align-top">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {commission.propertyTitle || `Property #${commission.propertyId}`}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top text-sm font-semibold text-slate-900">
                          {formatCurrency(commission.dealAmount)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span className="rounded bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                            {commission.commissionPercentage ?? 0}%
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-sm font-semibold text-emerald-700">
                          {formatCurrency(commission.commissionAmount)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <PaymentStatusBadge status={commission.paymentStatus} />
                        </td>

                        <td className="px-4 py-4 align-top">
                          <select
                            value={commission.paymentStatus || "PENDING"}
                            disabled={isUpdating}
                            onChange={(event) => handlePaymentStatusChange(commission.id, event.target.value)}
                            className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE / TABLET CARDS */}
          <div className="grid gap-3 lg:hidden">
            {filteredCommissions.map((commission) => {
              const isUpdating = actionLoading === commission.id;

              return (
                <article key={commission.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Commission #{commission.id}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Deal #{commission.dealId || "—"}</p>
                    </div>
                    <PaymentStatusBadge status={commission.paymentStatus} />
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-400">Property</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {commission.propertyTitle || `Property #${commission.propertyId}`}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <InfoBox label="Deal Amount" value={formatCurrency(commission.dealAmount)} icon={IndianRupee} />
                    <InfoBox label="Commission" value={`${commission.commissionPercentage ?? 0}%`} icon={Receipt} />
                    <InfoBox
                      label="Commission Amount"
                      value={formatCurrency(commission.commissionAmount)}
                      icon={IndianRupee}
                      valueClass="text-emerald-700"
                    />
                    <InfoBox label="Lead" value={commission.leadId ? `#${commission.leadId}` : "—"} icon={Receipt} />
                  </div>

                  <div className="mt-3">
                    <label htmlFor={`payment-status-${commission.id}`} className="mb-1.5 block text-[11px] font-medium text-slate-400">
                      Payment Status
                    </label>
                    <select
                      id={`payment-status-${commission.id}`}
                      value={commission.paymentStatus || "PENDING"}
                      disabled={isUpdating}
                      onChange={(event) => handlePaymentStatusChange(commission.id, event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {isUpdating && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <RefreshCw size={12} className="animate-spin" />
                        Updating payment status...
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default CommissionsManagement;