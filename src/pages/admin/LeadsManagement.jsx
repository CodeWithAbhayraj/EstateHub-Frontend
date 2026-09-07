import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Search,
  CalendarDays,
  IndianRupee,
  Building2,
  ChevronDown,
  Filter,
  AlertCircle,
  CheckCircle,
  UserRound,
  Clock3,
  ArrowRight,
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
// LEAD INFO BOX
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

function LeadsManagement() {
  const [leads, setLeads] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [remarks, setRemarks] =
    useState({});

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // FETCH LEADS
  // ==========================================

  const fetchLeads = async (
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
        await getAllLeads();

      setLeads(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Leads error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load leads."
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
    fetchLeads();
  }, []);


  // ==========================================
  // FILTER
  // ==========================================

  const filteredLeads = useMemo(() => {
    const searchValue =
      search
        .toLowerCase()
        .trim();

    return leads.filter(
      (lead) => {
        const matchesSearch =
          !searchValue ||
          String(
            lead.id || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            lead.propertyTitle || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            lead.propertyId || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            lead.message || ""
          )
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          statusFilter === "ALL" ||
          lead.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    leads,
    search,
    statusFilter,
  ]);


  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const handleStatusChange = async (
    leadId,
    status
  ) => {
    try {
      setUpdatingId(leadId);

      setError("");
      setSuccess("");

      const updatedLead =
        await updateLeadStatus(
          leadId,
          {
            status,
            remarks:
              remarks[leadId] ??
              "",
          }
        );

      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id) ===
          String(leadId)
            ? updatedLead
            : lead
        )
      );

      setSuccess(
        `Lead #${leadId} updated successfully.`
      );

    } catch (err) {
      console.error(
        "Update lead error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update lead status."
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // REMARKS
  // ==========================================

  const handleRemarksChange = (
    leadId,
    value
  ) => {
    setRemarks((prev) => ({
      ...prev,
      [leadId]: value,
    }));
  };


  // ==========================================
  // CURRENCY
  // ==========================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(
      value
    ).toLocaleString("en-IN")}`;
  };


  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Not specified";
    }
  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };


  // ==========================================
  // COUNTS
  // ==========================================

  const totalLeads =
    leads.length;

  const newLeads =
    leads.filter(
      (lead) =>
        lead.status === "NEW"
    ).length;

  const closedLeads =
    leads.filter(
      (lead) =>
        lead.status === "CLOSED"
    ).length;

  const negotiationLeads =
    leads.filter(
      (lead) =>
        lead.status ===
        "NEGOTIATION"
    ).length;

  const activeFilter =
    search.trim() !== "" ||
    statusFilter !== "ALL";


  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquare size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Leads Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage buyer enquiries and track lead progress.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchLeads(false)
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
                hover:shadow-md

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-fit
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
            Lead Activity
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Leads"
            value={totalLeads}
            description="All enquiries"
            icon={MessageSquare}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="New Leads"
            value={newLeads}
            description="Needs attention"
            icon={MessageSquare}
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Negotiation"
            value={negotiationLeads}
            description="Active discussions"
            icon={UserRound}
            valueClass="text-orange-600"
            iconClass="bg-orange-50 text-orange-600"
          />

          <StatCard
            label="Closed Leads"
            value={closedLeads}
            description="Successfully closed"
            icon={CheckCircle}
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
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
                  Find a lead
                </p>

              </div>

            </div>


            {activeFilter && (
              <button
                type="button"
                onClick={clearFilters}
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
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search lead, property or message..."
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


            {/* STATUS */}

            <div className="relative">

              <select
                value={
                  statusFilter
                }
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
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
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

          </div>


          {/* RESULT COUNT */}

          {!loading && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                {filteredLeads.length}{" "}
                {filteredLeads.length === 1
                  ? "lead"
                  : "leads"}{" "}
                found
              </span>

              {statusFilter !==
                "ALL" && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                  {statusFilter.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              )}

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
              Loading leads...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredLeads.length ===
        0 ? (

        /* ========================================
           EMPTY
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

              <MessageSquare
                size={30}
                className="text-blue-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No leads found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No leads match your current search or status filter.
            </p>

            {activeFilter && (
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

              <table className="w-full min-w-[1200px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Lead
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Budget
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Visit Date
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Message
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Remarks
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Update
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredLeads.map(
                    (lead) => (
                      <tr
                        key={lead.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* LEAD */}

                        <td className="px-5 py-5 align-top">

                          <p className="font-bold text-slate-900">
                            Lead #{lead.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(
                              lead.createdAt
                            )}
                          </p>

                        </td>


                        {/* PROPERTY */}

                        <td className="max-w-[220px] px-5 py-5 align-top">

                          <p className="truncate text-sm font-bold text-slate-900">
                            {lead.propertyTitle ||
                              "Property"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Property #{lead.propertyId}
                          </p>

                        </td>


                        {/* BUDGET */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-1 text-sm font-bold text-slate-800">

                            <IndianRupee
                              size={14}
                            />

                            {formatCurrency(
                              lead.budget
                            ).replace(
                              "₹",
                              ""
                            )}

                          </div>

                        </td>


                        {/* VISIT */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <CalendarDays
                              size={15}
                              className="text-slate-400"
                            />

                            {formatDate(
                              lead.preferredVisitDate
                            )}

                          </div>

                        </td>


                        {/* MESSAGE */}

                        <td className="max-w-[230px] px-5 py-5 align-top">

                          <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                            {lead.message ||
                              "—"}
                          </p>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-5 align-top">

                          <StatusBadge
                            status={
                              lead.status
                            }
                          />

                        </td>


                        {/* REMARKS */}

                        <td className="px-5 py-5 align-top">

                          <textarea
                            rows={2}
                            value={
                              remarks[
                                lead.id
                              ] ??
                              lead.remarks ??
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              handleRemarksChange(
                                lead.id,
                                event.target
                                  .value
                              )
                            }
                            placeholder="Add remarks..."
                            className="
                              w-48
                              resize-y
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2
                              text-xs
                              leading-5
                              text-slate-700
                              outline-none
                              transition

                              placeholder:text-slate-400

                              focus:border-slate-500
                              focus:ring-4
                              focus:ring-slate-100
                            "
                          />

                        </td>


                        {/* UPDATE */}

                        <td className="px-5 py-5 align-top">

                          <div className="relative">

                            <select
                              value={
                                lead.status ||
                                "NEW"
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  lead.id,
                                  event.target
                                    .value
                                )
                              }
                              disabled={
                                updatingId ===
                                lead.id
                              }
                              className="
                                min-h-10
                                w-44
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

                              {LEAD_STATUSES.map(
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
                                    {status.replaceAll(
                                      "_",
                                      " "
                                    )}
                                  </option>
                                )
                              )}

                            </select>

                            <ChevronDown
                              size={14}
                              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ======================================
              MOBILE / TABLET CARDS
          ====================================== */}

          <div className="grid gap-4 lg:hidden">

            {filteredLeads.map(
              (lead) => {

                const isUpdating =
                  updatingId ===
                  lead.id;

                return (
                  <article
                    key={lead.id}
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

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <MessageSquare
                            size={18}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900">
                            Lead #{lead.id}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {lead.propertyTitle ||
                              "Property"}
                          </p>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          lead.status
                        }
                      />

                    </div>


                    {/* INFO */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Property ID"
                        value={
                          lead.propertyId
                            ? `#${lead.propertyId}`
                            : "—"
                        }
                        icon={Building2}
                      />

                      <InfoBox
                        label="Budget"
                        value={formatCurrency(
                          lead.budget
                        )}
                        icon={
                          IndianRupee
                        }
                      />

                      <InfoBox
                        label="Visit Date"
                        value={formatDate(
                          lead.preferredVisitDate
                        )}
                        icon={
                          CalendarDays
                        }
                      />

                      <InfoBox
                        label="Created"
                        value={formatDate(
                          lead.createdAt
                        )}
                        icon={Clock3}
                      />

                    </div>


                    {/* MESSAGE */}

                    <div className="mt-3 rounded-xl bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Message
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {lead.message ||
                          "No message provided."}
                      </p>

                    </div>


                    {/* REMARKS */}

                    <div className="mt-4">

                      <label
                        htmlFor={`remarks-${lead.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Remarks
                      </label>

                      <textarea
                        id={`remarks-${lead.id}`}
                        rows={3}
                        value={
                          remarks[
                            lead.id
                          ] ??
                          lead.remarks ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleRemarksChange(
                            lead.id,
                            event.target
                              .value
                          )
                        }
                        placeholder="Add remarks..."
                        className="
                          w-full
                          resize-y
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-3
                          py-2.5
                          text-sm
                          leading-5
                          text-slate-700
                          shadow-sm
                          outline-none
                          transition

                          placeholder:text-slate-400

                          focus:border-slate-500
                          focus:ring-4
                          focus:ring-slate-100
                        "
                      />

                    </div>


                    {/* STATUS UPDATE */}

                    <div className="mt-4">

                      <label
                        htmlFor={`status-${lead.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Update Status
                      </label>

                      <div className="relative">

                        <select
                          id={`status-${lead.id}`}
                          value={
                            lead.status ||
                            "NEW"
                          }
                          onChange={(
                            event
                          ) =>
                            handleStatusChange(
                              lead.id,
                              event.target
                                .value
                            )
                          }
                          disabled={
                            isUpdating
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

                          {LEAD_STATUSES.map(
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
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                      </div>


                      {isUpdating && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600">

                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />

                          Updating lead...

                        </div>
                      )}

                    </div>


                    {/* PROPERTY LINK */}

                    {lead.propertyId && (
                      <a
                        href={`/properties/${lead.propertyId}`}
                        className="
                          mt-4
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          gap-2
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

                          active:scale-[0.98]
                        "
                      >
                        View Property
                        <ArrowRight
                          size={15}
                        />
                      </a>
                    )}

                  </article>
                );
              }
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default LeadsManagement;