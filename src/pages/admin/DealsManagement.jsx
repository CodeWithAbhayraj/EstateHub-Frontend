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
  Filter,
  AlertCircle,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

import {
  getAllDeals,
  updateDealStatus,
} from "../../api/dealApi";

import { getAllLeads } from "../../api/leadApi";

import api from "../../api/axios";

const DEAL_STATUSES = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
];

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusClasses = {
    PENDING:
      "bg-amber-50 text-amber-700",

    COMPLETED:
      "bg-emerald-50 text-emerald-700",

    CANCELLED:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        ${
          statusClasses[status] ||
          "bg-slate-100 text-slate-600"
        }
      `}
    >
      {String(
        status || "UNKNOWN"
      ).replaceAll("_", " ")}
    </span>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
  valueClass = "text-slate-900",
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md

        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>

          <p
            className={`
              mt-2
              text-2xl
              font-bold
              tracking-tight
              sm:text-3xl
              ${valueClass}
            `}
          >
            {value}
          </p>

          <p className="mt-1 line-clamp-1 text-[11px] text-slate-400 sm:text-xs">
            {description}
          </p>

        </div>

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-200

            group-hover:scale-105

            sm:h-11
            sm:w-11

            ${iconClass}
          `}
        >
          <Icon size={19} />
        </div>

      </div>
    </div>
  );
}


// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">

      <div className="flex items-center gap-2">

        {Icon && (
          <Icon
            size={14}
            className="shrink-0 text-slate-400"
          />
        )}

        <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

      </div>

      <p className="mt-1 truncate text-xs font-bold text-slate-700 sm:text-sm">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// MAIN COMPONENT
// ==========================================

function DealsManagement() {

  // ==========================================
  // DEAL STATES
  // ==========================================

  const [deals, setDeals] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ==========================================
  // CLOSED LEADS
  // ==========================================

  const [closedLeads, setClosedLeads] =
    useState([]);

  // ==========================================
  // UI STATES
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [leadsLoading, setLeadsLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [createLoading, setCreateLoading] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // CREATE DEAL FORM
  // ==========================================

  const [formData, setFormData] =
    useState({
      leadId: "",
      dealAmount: "",
      commissionPercentage: "2",
    });


  // ==========================================
  // FETCH DEALS
  // ==========================================

  const fetchDeals = async (
    showFullLoader = true
  ) => {

    try {

      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data =
        await getAllDeals();

      setDeals(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Deals error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load deals."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchDeals();
  }, []);


  // ==========================================
  // FILTERED DEALS
  // ==========================================

  const filteredDeals =
    useMemo(() => {

      const value =
        search
          .toLowerCase()
          .trim();

      return deals.filter(
        (deal) => {

          const matchesSearch =
            !value ||
            String(
              deal.propertyTitle ||
                ""
            )
              .toLowerCase()
              .includes(value) ||
            String(
              deal.id || ""
            )
              .toLowerCase()
              .includes(value) ||
            String(
              deal.leadId || ""
            )
              .toLowerCase()
              .includes(value) ||
            String(
              deal.propertyId || ""
            )
              .toLowerCase()
              .includes(value);

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            deal.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      deals,
      search,
      statusFilter,
    ]);


  // ==========================================
  // FETCH CLOSED LEADS
  // ==========================================

  const fetchClosedLeads = async () => {

    try {

      setLeadsLoading(true);
      setError("");

      const data =
        await getAllLeads();

      const leads =
        Array.isArray(data)
          ? data
          : [];

      const closed =
        leads.filter(
          (lead) =>
            lead.status ===
            "CLOSED"
        );

      const existingLeadIds =
        new Set(
          deals.map(
            (deal) =>
              String(
                deal.leadId
              )
          )
        );

      const availableClosedLeads =
        closed.filter(
          (lead) =>
            !existingLeadIds.has(
              String(lead.id)
            )
        );

      setClosedLeads(
        availableClosedLeads
      );

    } catch (err) {

      console.error(
        "Closed leads error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load closed leads."
      );

    } finally {

      setLeadsLoading(false);

    }
  };


  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openCreateModal =
    async () => {

      setError("");
      setSuccess("");

      setFormData({
        leadId: "",
        dealAmount: "",
        commissionPercentage:
          "2",
      });

      setShowCreateModal(
        true
      );

      await fetchClosedLeads();
    };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeCreateModal = () => {

    if (createLoading) {
      return;
    }

    setShowCreateModal(
      false
    );

    setFormData({
      leadId: "",
      dealAmount: "",
      commissionPercentage:
        "2",
    });
  };


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };


  // ==========================================
  // CREATE DEAL
  // ==========================================

  const handleCreateDeal =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      // ======================================
      // VALIDATION
      // ======================================

      if (!formData.leadId) {

        setError(
          "Please select a closed lead."
        );

        return;
      }

      if (
        !formData.dealAmount ||
        Number(
          formData.dealAmount
        ) <= 0
      ) {

        setError(
          "Deal amount must be greater than 0."
        );

        return;
      }

      if (
        !formData.commissionPercentage ||
        Number(
          formData.commissionPercentage
        ) <= 0
      ) {

        setError(
          "Commission percentage must be greater than 0."
        );

        return;
      }

      if (
        Number(
          formData.commissionPercentage
        ) > 100
      ) {

        setError(
          "Commission percentage cannot exceed 100."
        );

        return;
      }


      try {

        setCreateLoading(true);

        const payload = {
          leadId:
            Number(
              formData.leadId
            ),

          dealAmount:
            Number(
              formData.dealAmount
            ),

          commissionPercentage:
            Number(
              formData.commissionPercentage
            ),
        };

        const response =
          await api.post(
            "/deals",
            payload
          );

        const createdDeal =
          response.data;

        setDeals(
          (prev) => [
            createdDeal,
            ...prev,
          ]
        );

        setSuccess(
          "Deal created successfully."
        );

        closeCreateModal();

      } catch (err) {

        console.error(
          "Create deal error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to create deal."
        );

      } finally {

        setCreateLoading(
          false
        );

      }
    };


  // ==========================================
  // UPDATE DEAL STATUS
  // ==========================================

  const handleStatusChange =
    async (
      dealId,
      status
    ) => {

      try {

        setActionLoading(
          dealId
        );

        setError("");
        setSuccess("");

        const updatedDeal =
          await updateDealStatus(
            dealId,
            status
          );

        setDeals(
          (prev) =>
            prev.map(
              (deal) =>
                String(
                  deal.id
                ) ===
                String(
                  dealId
                )
                  ? updatedDeal
                  : deal
            )
        );

        setSuccess(
          "Deal status updated successfully."
        );

      } catch (err) {

        console.error(
          "Update deal status error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to update deal status."
        );

      } finally {

        setActionLoading(
          null
        );

      }
    };


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(
      value
    ).toLocaleString(
      "en-IN"
    )}`;
  };


  // ==========================================
  // COMMISSION PREVIEW
  // ==========================================

  const commissionPreview =
    useMemo(() => {

      const amount =
        Number(
          formData.dealAmount
        );

      const percentage =
        Number(
          formData.commissionPercentage
        );

      if (
        !amount ||
        !percentage
      ) {
        return 0;
      }

      return (
        amount *
        percentage
      ) / 100;

    }, [
      formData.dealAmount,
      formData.commissionPercentage,
    ]);


  // ==========================================
  // STATS
  // ==========================================

  const totalDeals =
    deals.length;

  const pendingDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        "PENDING"
    ).length;

  const completedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        "COMPLETED"
    ).length;

  const cancelledDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        "CANCELLED"
    ).length;

  const totalDealValue =
    deals.reduce(
      (total, deal) =>
        total +
        Number(
          deal.dealAmount || 0
        ),
      0
    );

  const activeFilter =
    search.trim() !== "" ||
    statusFilter !== "ALL";


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };


  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BriefcaseBusiness
                  size={21}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Deals Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Monitor deals, amounts, commissions and business status.
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition

                  hover:bg-blue-700
                  hover:shadow-md

                  active:scale-[0.98]

                  sm:w-auto
                "
              >
                <Plus size={16} />
                Create Deal
              </button>


              <button
                type="button"
                onClick={() =>
                  fetchDeals(false)
                }
                disabled={
                  loading ||
                  refreshing
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition

                  hover:bg-slate-800

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:w-auto
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-medium
            leading-5
            text-red-600
          "
          role="alert"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}


      {success && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            font-medium
            leading-5
            text-emerald-700
          "
          role="status"
        >
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}


      {/* ==========================================
          STATS
      ========================================== */}

      <section className="mb-6">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Deal Activity
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            label="Total Deals"
            value={
              totalDeals
            }
            description="All deals"
            icon={
              BriefcaseBusiness
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Pending"
            value={
              pendingDeals
            }
            description="In progress"
            icon={Clock}
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Completed"
            value={
              completedDeals
            }
            description="Successful deals"
            icon={
              CheckCircle
            }
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Cancelled"
            value={
              cancelledDeals
            }
            description="Cancelled deals"
            icon={XCircle}
            valueClass="text-red-600"
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            label="Deal Value"
            value={formatCurrency(
              totalDealValue
            )}
            description="Total transaction value"
            icon={IndianRupee}
            valueClass="text-violet-600"
            iconClass="bg-violet-50 text-violet-600"
          />

        </div>

      </section>


      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Filter size={17} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Search & Filter
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  Find a deal
                </p>

              </div>

            </div>


            {activeFilter && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-right"
              >
                Clear filters
              </button>
            )}

          </div>


          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search property, deal ID, lead ID..."
                className="
                  min-h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  font-medium
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition

                  placeholder:text-slate-400

                  hover:border-slate-400

                  focus:border-slate-500
                  focus:ring-4
                  focus:ring-slate-100
                "
              />

            </div>


            {/* FILTER */}

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                min-h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-800
                shadow-sm
                outline-none
                transition

                hover:border-slate-400

                focus:border-slate-500
                focus:ring-4
                focus:ring-slate-100
              "
            >

              <option value="ALL">
                All Statuses
              </option>

              {DEAL_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>


          {!loading && (
            <div className="text-xs font-medium text-slate-400">

              {filteredDeals.length}{" "}
              {filteredDeals.length ===
              1
                ? "deal"
                : "deals"}{" "}
              found

            </div>
          )}

        </div>

      </section>


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading ? (

        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading deals...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredDeals.length ===
        0 ? (

        /* ========================================
           EMPTY STATE
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">

              <BriefcaseBusiness
                size={30}
                className="text-violet-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No deals found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No deals match your current search or status filter.
            </p>

            {activeFilter ? (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition

                  hover:bg-slate-50
                "
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition

                  hover:bg-blue-700
                "
              >
                <Plus size={16} />
                Create Deal
              </button>
            )}

          </div>

        </div>

      ) : (

        <>
          {/* ======================================
              DESKTOP TABLE
          ====================================== */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Deal
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Deal Amount
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Commission
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Commission Amount
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Update
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredDeals.map(
                    (deal) => {

                      const isUpdating =
                        actionLoading ===
                        deal.id;

                      return (
                        <tr
                          key={
                            deal.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* DEAL */}

                          <td className="px-5 py-5 align-top">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                <BriefcaseBusiness
                                  size={18}
                                />

                              </div>

                              <div>

                                <p className="font-bold text-slate-900">
                                  Deal #
                                  {deal.id}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  Lead #
                                  {deal.leadId ||
                                    "—"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* PROPERTY */}

                          <td className="max-w-[230px] px-5 py-5 align-top">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {deal.propertyTitle ||
                                `Property #${deal.propertyId}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Property #
                              {deal.propertyId ||
                                "—"}
                            </p>

                          </td>


                          {/* DEAL AMOUNT */}

                          <td className="px-5 py-5 align-top">

                            <p className="text-sm font-bold text-slate-900">
                              {formatCurrency(
                                deal.dealAmount
                              )}
                            </p>

                          </td>


                          {/* COMMISSION */}

                          <td className="px-5 py-5 align-top">

                            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                              {
                                deal.commissionPercentage
                              }
                              %
                            </span>

                          </td>


                          {/* COMMISSION AMOUNT */}

                          <td className="px-5 py-5 align-top">

                            <p className="text-sm font-bold text-emerald-700">
                              {formatCurrency(
                                deal.commissionAmount
                              )}
                            </p>

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-5 align-top">

                            <StatusBadge
                              status={
                                deal.status
                              }
                            />

                          </td>


                          {/* UPDATE */}

                          <td className="px-5 py-5 align-top">

                            <div className="relative">

                              <select
                                value={
                                  deal.status ||
                                  "PENDING"
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleStatusChange(
                                    deal.id,
                                    event.target
                                      .value
                                  )
                                }
                                className="
                                  min-h-10
                                  w-40
                                  appearance-none
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  px-3
                                  py-2
                                  pr-8
                                  text-xs
                                  font-semibold
                                  text-slate-700
                                  shadow-sm
                                  outline-none
                                  transition

                                  focus:border-slate-500
                                  focus:ring-4
                                  focus:ring-slate-100

                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {DEAL_STATUSES.map(
                                  (
                                    status
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {status}
                                    </option>
                                  )
                                )}

                              </select>

                              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">

                                {isUpdating ? (
                                  <RefreshCw
                                    size={13}
                                    className="animate-spin text-slate-400"
                                  />
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    ▼
                                  </span>
                                )}

                              </span>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ======================================
              MOBILE / TABLET CARDS
          ====================================== */}

          <div className="grid gap-4 lg:hidden">

            {filteredDeals.map(
              (deal) => {

                const isUpdating =
                  actionLoading ===
                  deal.id;

                return (
                  <article
                    key={
                      deal.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-sm
                      transition

                      hover:border-slate-300
                      hover:shadow-md

                      sm:p-5
                    "
                  >

                    {/* HEADER */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                          <BriefcaseBusiness
                            size={18}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900">
                            Deal #
                            {deal.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Lead #
                            {deal.leadId ||
                              "—"}
                          </p>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          deal.status
                        }
                      />

                    </div>


                    {/* PROPERTY */}

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Property
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {deal.propertyTitle ||
                          `Property #${deal.propertyId}`}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Property #
                        {deal.propertyId ||
                          "—"}
                      </p>

                    </div>


                    {/* INFO */}

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Deal Amount"
                        value={formatCurrency(
                          deal.dealAmount
                        )}
                        icon={
                          IndianRupee
                        }
                      />

                      <InfoBox
                        label="Commission"
                        value={`${deal.commissionPercentage ?? 0}%`}
                        icon={
                          FileCheck2
                        }
                      />

                      <InfoBox
                        label="Commission Amount"
                        value={formatCurrency(
                          deal.commissionAmount
                        )}
                        icon={
                          IndianRupee
                        }
                      />

                      <InfoBox
                        label="Lead"
                        value={
                          deal.leadId
                            ? `#${deal.leadId}`
                            : "—"
                        }
                        icon={
                          BriefcaseBusiness
                        }
                      />

                    </div>


                    {/* STATUS UPDATE */}

                    <div className="mt-4">

                      <label
                        htmlFor={`deal-status-${deal.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Update Status
                      </label>

                      <div className="relative">

                        <select
                          id={`deal-status-${deal.id}`}
                          value={
                            deal.status ||
                            "PENDING"
                          }
                          disabled={
                            isUpdating
                          }
                          onChange={(
                            event
                          ) =>
                            handleStatusChange(
                              deal.id,
                              event.target
                                .value
                            )
                          }
                          className="
                            min-h-11
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            pr-10
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            outline-none

                            focus:border-slate-500
                            focus:ring-4
                            focus:ring-slate-100

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >

                          {DEAL_STATUSES.map(
                            (
                              status
                            ) => (
                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                        <Chevron
                          isLoading={
                            isUpdating
                          }
                        />

                      </div>

                      {isUpdating && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600">

                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />

                          Updating deal...

                        </div>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        </>
      )}


      {/* ==========================================
          CREATE DEAL MODAL
      ========================================== */}

      {showCreateModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-[2px]
          "
          onClick={closeCreateModal}
        >

          <div
            className="
              max-h-[92vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="border-b border-slate-200 p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Plus size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      New Transaction
                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                      Create Deal
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Create a deal from a closed lead.
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    createLoading
                  }
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    text-slate-500
                    transition

                    hover:bg-slate-200
                    hover:text-slate-900

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  aria-label="Close"
                >
                  <X size={17} />
                </button>

              </div>

            </div>


            {/* MODAL BODY */}

            <form
              onSubmit={
                handleCreateDeal
              }
              className="p-5 sm:p-6"
            >

              <div className="space-y-5">

                {/* CLOSED LEAD */}

                <div>

                  <label
                    htmlFor="closed-lead"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Closed Lead
                  </label>

                  {leadsLoading ? (

                    <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">

                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Loading closed leads...

                    </div>

                  ) : closedLeads.length ===
                    0 ? (

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                      <div className="flex items-start gap-3">

                        <Clock
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <div>

                          <p className="text-sm font-semibold text-amber-800">
                            No available closed leads
                          </p>

                          <p className="mt-1 text-xs leading-5 text-amber-700">
                            Only CLOSED leads without an existing deal can be selected.
                          </p>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <select
                      id="closed-lead"
                      name="leadId"
                      value={
                        formData.leadId
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={
                        createLoading
                      }
                      className="
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-800
                        shadow-sm
                        outline-none
                        transition

                        hover:border-slate-400

                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-50

                        disabled:bg-slate-100
                      "
                    >

                      <option value="">
                        Select closed lead
                      </option>

                      {closedLeads.map(
                        (lead) => (
                          <option
                            key={
                              lead.id
                            }
                            value={
                              lead.id
                            }
                          >
                            Lead #
                            {lead.id}

                            {lead.propertyTitle
                              ? ` - ${lead.propertyTitle}`
                              : lead.property?.title
                              ? ` - ${lead.property.title}`
                              : ""}
                          </option>
                        )
                      )}

                    </select>

                  )}

                </div>


                {/* DEAL AMOUNT */}

                <div>

                  <label
                    htmlFor="deal-amount"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Deal Amount
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="deal-amount"
                      type="number"
                      name="dealAmount"
                      value={
                        formData.dealAmount
                      }
                      onChange={
                        handleFormChange
                      }
                      min="1"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 10000000"
                      disabled={
                        createLoading
                      }
                      className="
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-2.5
                        pl-10
                        pr-4
                        text-sm
                        font-medium
                        text-slate-800
                        shadow-sm
                        outline-none
                        transition

                        placeholder:text-slate-400

                        hover:border-slate-400

                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-50

                        disabled:bg-slate-100
                      "
                    />

                  </div>

                </div>


                {/* COMMISSION */}

                <div>

                  <label
                    htmlFor="commission-percentage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Commission Percentage
                  </label>

                  <div className="relative">

                    <input
                      id="commission-percentage"
                      type="number"
                      name="commissionPercentage"
                      value={
                        formData.commissionPercentage
                      }
                      onChange={
                        handleFormChange
                      }
                      min="0.01"
                      max="100"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="e.g. 2"
                      disabled={
                        createLoading
                      }
                      className="
                        min-h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-2.5
                        pl-4
                        pr-10
                        text-sm
                        font-medium
                        text-slate-800
                        shadow-sm
                        outline-none
                        transition

                        placeholder:text-slate-400

                        hover:border-slate-400

                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-50

                        disabled:bg-slate-100
                      "
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      %
                    </span>

                  </div>

                </div>


                {/* PREVIEW */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Commission Preview
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Based on entered deal amount.
                      </p>

                    </div>

                    <p className="text-lg font-bold text-emerald-700">
                      {formatCurrency(
                        commissionPreview
                      )}
                    </p>

                  </div>

                </div>

              </div>


              {/* MODAL ACTIONS */}

              <div className="mt-6 grid gap-2 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    createLoading
                  }
                  className="
                    min-h-11
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-700
                    transition

                    hover:bg-slate-50

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    createLoading ||
                    closedLeads.length ===
                      0
                  }
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition

                    hover:bg-blue-700

                    active:scale-[0.98]

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {createLoading ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={16}
                      />

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


// ==========================================
// CHEVRON
// ==========================================

function Chevron({
  isLoading,
}) {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">

      {isLoading ? (
        <RefreshCw
          size={15}
          className="animate-spin"
        />
      ) : (
        <span className="text-xs">
          ▼
        </span>
      )}

    </span>
  );
}

export default DealsManagement;