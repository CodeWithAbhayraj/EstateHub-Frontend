import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  IndianRupee,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";

import { getAllDeals, updateDealStatus } from "../../api/dealApi";
import { getAllLeads } from "../../api/leadApi";
import api from "../../api/axios";

const DEAL_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"];

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusClasses = {
    PENDING: "bg-amber-50 text-amber-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
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

function DealsManagement() {
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [closedLeads, setClosedLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    leadId: "",
    dealAmount: "",
    commissionPercentage: "2",
  });

  const fetchDeals = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllDeals();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Deals error:", err);
      setError(err.response?.data?.message || "Failed to load deals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    const value = search.toLowerCase().trim();

    return deals.filter((deal) => {
      const matchesSearch =
        !value ||
        [deal.propertyTitle, deal.id, deal.leadId, deal.propertyId].some((field) =>
          String(field || "").toLowerCase().includes(value)
        );

      const matchesStatus = statusFilter === "ALL" || deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deals, search, statusFilter]);

  const fetchClosedLeads = async () => {
    try {
      setLeadsLoading(true);
      setError("");

      const data = await getAllLeads();
      const leads = Array.isArray(data) ? data : [];
      const closed = leads.filter((lead) => lead.status === "CLOSED");

      const existingLeadIds = new Set(deals.map((deal) => String(deal.leadId)));
      const availableClosedLeads = closed.filter((lead) => !existingLeadIds.has(String(lead.id)));

      setClosedLeads(availableClosedLeads);
    } catch (err) {
      console.error("Closed leads error:", err);
      setError(err.response?.data?.message || "Failed to load closed leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const openCreateModal = async () => {
    setError("");
    setSuccess("");
    setFormData({ leadId: "", dealAmount: "", commissionPercentage: "2" });
    setShowCreateModal(true);
    await fetchClosedLeads();
  };

  const closeCreateModal = () => {
    if (createLoading) return;
    setShowCreateModal(false);
    setFormData({ leadId: "", dealAmount: "", commissionPercentage: "2" });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleCreateDeal = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.leadId) return setError("Please select a closed lead.");
    if (!formData.dealAmount || Number(formData.dealAmount) <= 0) return setError("Deal amount must be greater than 0.");
    if (!formData.commissionPercentage || Number(formData.commissionPercentage) <= 0)
      return setError("Commission percentage must be greater than 0.");
    if (Number(formData.commissionPercentage) > 100) return setError("Commission percentage cannot exceed 100.");

    try {
      setCreateLoading(true);

      const payload = {
        leadId: Number(formData.leadId),
        dealAmount: Number(formData.dealAmount),
        commissionPercentage: Number(formData.commissionPercentage),
      };

      const response = await api.post("/deals", payload);
      const createdDeal = response.data;

      setDeals((prev) => [createdDeal, ...prev]);
      setSuccess("Deal created successfully.");
      closeCreateModal();
    } catch (err) {
      console.error("Create deal error:", err);
      setError(err.response?.data?.message || "Failed to create deal.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (dealId, status) => {
    try {
      setActionLoading(dealId);
      setError("");
      setSuccess("");

      const updatedDeal = await updateDealStatus(dealId, status);

      setDeals((prev) => prev.map((deal) => (String(deal.id) === String(dealId) ? updatedDeal : deal)));
      setSuccess("Deal status updated successfully.");
    } catch (err) {
      console.error("Update deal status error:", err);
      setError(err.response?.data?.message || "Failed to update deal status.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const commissionPreview = useMemo(() => {
    const amount = Number(formData.dealAmount);
    const percentage = Number(formData.commissionPercentage);
    if (!amount || !percentage) return 0;
    return (amount * percentage) / 100;
  }, [formData.dealAmount, formData.commissionPercentage]);

  const totalDeals = deals.length;
  const pendingDeals = deals.filter((d) => d.status === "PENDING").length;
  const completedDeals = deals.filter((d) => d.status === "COMPLETED").length;
  const cancelledDeals = deals.filter((d) => d.status === "CANCELLED").length;
  const totalDealValue = deals.reduce((total, deal) => total + Number(deal.dealAmount || 0), 0);

  const activeFilter = search.trim() !== "" || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Deals Management</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor deals, amounts, commissions and business status.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Create Deal
          </button>

          <button
            type="button"
            onClick={() => fetchDeals(false)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
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
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total Deals" value={totalDeals} description="All deals" icon={BriefcaseBusiness} iconClass="bg-blue-50 text-blue-600" />
        <StatCard label="Pending" value={pendingDeals} description="In progress" icon={Clock} valueClass="text-amber-600" iconClass="bg-amber-50 text-amber-600" />
        <StatCard label="Completed" value={completedDeals} description="Successful deals" icon={CheckCircle} valueClass="text-emerald-600" iconClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Cancelled" value={cancelledDeals} description="Cancelled deals" icon={XCircle} valueClass="text-red-600" iconClass="bg-red-50 text-red-600" />
        <StatCard label="Deal Value" value={formatCurrency(totalDealValue)} description="Total transaction value" icon={IndianRupee} valueClass="text-violet-600" iconClass="bg-violet-50 text-violet-600" />
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
              placeholder="Search property, deal ID, lead ID..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="ALL">All Statuses</option>
            {DEAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {!loading && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>{filteredDeals.length} {filteredDeals.length === 1 ? "deal" : "deals"} found</span>
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
            <p className="mt-3 text-sm text-slate-500">Loading deals...</p>
          </div>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
          <BriefcaseBusiness size={28} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No deals found</h3>
          <p className="mt-1 text-sm text-slate-500">No deals match your search or status filter.</p>
          {activeFilter ? (
            <button type="button" onClick={clearFilters} className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Clear Filters
            </button>
          ) : (
            <button type="button" onClick={openCreateModal} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Plus size={16} />
              Create Deal
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {["Deal", "Property", "Deal Amount", "Commission", "Commission Amount", "Status", "Update"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.map((deal) => {
                    const isUpdating = actionLoading === deal.id;

                    return (
                      <tr key={deal.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 align-top">
                          <p className="font-semibold text-slate-900">Deal #{deal.id}</p>
                          <p className="mt-0.5 text-xs text-slate-400">Lead #{deal.leadId || "—"}</p>
                        </td>

                        <td className="max-w-[200px] px-4 py-4 align-top">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {deal.propertyTitle || `Property #${deal.propertyId}`}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top text-sm font-semibold text-slate-900">
                          {formatCurrency(deal.dealAmount)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span className="rounded bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                            {deal.commissionPercentage}%
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-sm font-semibold text-emerald-700">
                          {formatCurrency(deal.commissionAmount)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <StatusBadge status={deal.status} />
                        </td>

                        <td className="px-4 py-4 align-top">
                          <select
                            value={deal.status || "PENDING"}
                            disabled={isUpdating}
                            onChange={(event) => handleStatusChange(deal.id, event.target.value)}
                            className="w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                          >
                            {DEAL_STATUSES.map((status) => (
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
            {filteredDeals.map((deal) => {
              const isUpdating = actionLoading === deal.id;

              return (
                <article key={deal.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Deal #{deal.id}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Lead #{deal.leadId || "—"}</p>
                    </div>
                    <StatusBadge status={deal.status} />
                  </div>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-400">Property</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {deal.propertyTitle || `Property #${deal.propertyId}`}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <InfoBox label="Deal Amount" value={formatCurrency(deal.dealAmount)} icon={IndianRupee} />
                    <InfoBox label="Commission" value={`${deal.commissionPercentage ?? 0}%`} icon={BriefcaseBusiness} />
                    <InfoBox label="Commission Amount" value={formatCurrency(deal.commissionAmount)} icon={IndianRupee} />
                    <InfoBox label="Lead" value={deal.leadId ? `#${deal.leadId}` : "—"} icon={BriefcaseBusiness} />
                  </div>

                  <div className="mt-3">
                    <label htmlFor={`deal-status-${deal.id}`} className="mb-1.5 block text-[11px] font-medium text-slate-400">
                      Update Status
                    </label>
                    <select
                      id={`deal-status-${deal.id}`}
                      value={deal.status || "PENDING"}
                      disabled={isUpdating}
                      onChange={(event) => handleStatusChange(deal.id, event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400 disabled:opacity-50"
                    >
                      {DEAL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {isUpdating && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                        <RefreshCw size={12} className="animate-spin" />
                        Updating deal...
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* CREATE DEAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={closeCreateModal}>
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Deal</h2>
                <p className="mt-1 text-sm text-slate-500">Create a deal from a closed lead.</p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={createLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleCreateDeal} className="p-5">
              <div className="space-y-4">
                {/* CLOSED LEAD */}
                <div>
                  <label htmlFor="closed-lead" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Closed Lead
                  </label>

                  {leadsLoading ? (
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                      <RefreshCw size={14} className="animate-spin" />
                      Loading closed leads...
                    </div>
                  ) : closedLeads.length === 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-sm font-medium text-amber-800">No available closed leads</p>
                      <p className="mt-1 text-xs text-amber-700">
                        Only CLOSED leads without an existing deal can be selected.
                      </p>
                    </div>
                  ) : (
                    <select
                      id="closed-lead"
                      name="leadId"
                      value={formData.leadId}
                      onChange={handleFormChange}
                      disabled={createLoading}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                    >
                      <option value="">Select closed lead</option>
                      {closedLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          Lead #{lead.id}
                          {lead.propertyTitle ? ` - ${lead.propertyTitle}` : lead.property?.title ? ` - ${lead.property.title}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* DEAL AMOUNT */}
                <div>
                  <label htmlFor="deal-amount" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Deal Amount
                  </label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="deal-amount"
                      type="number"
                      name="dealAmount"
                      value={formData.dealAmount}
                      onChange={handleFormChange}
                      min="1"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 10000000"
                      disabled={createLoading}
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* COMMISSION */}
                <div>
                  <label htmlFor="commission-percentage" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Commission Percentage
                  </label>
                  <div className="relative">
                    <input
                      id="commission-percentage"
                      type="number"
                      name="commissionPercentage"
                      value={formData.commissionPercentage}
                      onChange={handleFormChange}
                      min="0.01"
                      max="100"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 2"
                      disabled={createLoading}
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-9 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">%</span>
                  </div>
                </div>

                {/* PREVIEW */}
                <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Commission Preview</p>
                    <p className="mt-0.5 text-xs text-slate-400">Based on entered deal amount.</p>
                  </div>
                  <p className="text-base font-bold text-emerald-700">{formatCurrency(commissionPreview)}</p>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createLoading || closedLeads.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Deal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DealsManagement;