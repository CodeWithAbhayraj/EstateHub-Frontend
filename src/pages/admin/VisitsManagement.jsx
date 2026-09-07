import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  RefreshCw,
  Search,
  User,
  Building2,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowRight,
  XCircle,
} from "lucide-react";

import {
  getAllVisits,
  updateVisitStatus,
} from "../../api/visitApi";

// ==========================================
// VISIT STATUSES
// ==========================================

const VISIT_STATUSES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
];

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  const statusClasses = {
    SCHEDULED:
      "bg-blue-50 text-blue-700",

    COMPLETED:
      "bg-emerald-50 text-emerald-700",

    CANCELLED:
      "bg-red-50 text-red-700",

    RESCHEDULED:
      "bg-amber-50 text-amber-700",
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

function VisitsManagement() {
  const [visits, setVisits] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // FETCH VISITS
  // ==========================================

  const fetchVisits = async (
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
        await getAllVisits();

      setVisits(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Visits error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load visits."
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
    fetchVisits();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredVisits = useMemo(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    return visits.filter(
      (visit) => {
        const matchesSearch =
          !value ||
          String(
            visit.propertyTitle || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            visit.buyerName || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            visit.id || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            visit.propertyId || ""
          )
            .toLowerCase()
            .includes(value);

        const matchesStatus =
          statusFilter === "ALL" ||
          visit.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    visits,
    search,
    statusFilter,
  ]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (
    visitId,
    status
  ) => {
    try {
      setActionLoading(visitId);
      setError("");
      setSuccess("");

      const updatedVisit =
        await updateVisitStatus(
          visitId,
          {
            status,
          }
        );

      setVisits((prev) =>
        prev.map((visit) =>
          String(visit.id) ===
          String(visitId)
            ? updatedVisit
            : visit
        )
      );

      setSuccess(
        `Visit #${visitId} updated successfully.`
      );
    } catch (err) {
      console.error(
        "Update visit status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update visit status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return date;
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalVisits =
    visits.length;

  const scheduledVisits =
    visits.filter(
      (visit) =>
        visit.status ===
        "SCHEDULED"
    ).length;

  const completedVisits =
    visits.filter(
      (visit) =>
        visit.status ===
        "COMPLETED"
    ).length;

  const cancelledVisits =
    visits.filter(
      (visit) =>
        visit.status ===
        "CANCELLED"
    ).length;

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

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Visits Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage property visits and update their status.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchVisits(false)
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
            Visit Activity
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Visits"
            value={totalVisits}
            description="All property visits"
            icon={CalendarDays}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Scheduled"
            value={scheduledVisits}
            description="Upcoming visits"
            icon={Clock}
            valueClass="text-blue-600"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Completed"
            value={completedVisits}
            description="Completed visits"
            icon={CheckCircle}
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Cancelled"
            value={cancelledVisits}
            description="Cancelled visits"
            icon={XCircle}
            valueClass="text-red-600"
            iconClass="bg-red-50 text-red-600"
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
                  Find a visit
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
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search property, buyer or visit ID..."
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

                {VISIT_STATUSES.map(
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


          {!loading && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                {filteredVisits.length}{" "}
                {filteredVisits.length ===
                1
                  ? "visit"
                  : "visits"}{" "}
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
              Loading visits...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredVisits.length ===
        0 ? (

        /* ========================================
           EMPTY
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">

              <CalendarDays
                size={30}
                className="text-emerald-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No visits found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No visits match your current search or status filter.
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

              <table className="w-full min-w-[1000px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Visit
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Buyer
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Property
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Time
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

                  {filteredVisits.map(
                    (visit) => (
                      <tr
                        key={visit.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* VISIT */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                              <CalendarDays
                                size={18}
                              />
                            </div>

                            <div>

                              <p className="font-bold text-slate-900">
                                Visit #{visit.id}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Lead #{visit.leadId}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* BUYER */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <User
                                size={15}
                              />
                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[160px] truncate text-sm font-semibold text-slate-700">
                                {visit.buyerName ||
                                  `Buyer #${visit.buyerId}`}
                              </p>

                              <p className="text-xs text-slate-400">
                                Buyer
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PROPERTY */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-start gap-2">

                            <Building2
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <div className="min-w-0">

                              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-700">
                                {visit.propertyTitle ||
                                  `Property #${visit.propertyId}`}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Property #
                                {visit.propertyId}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <CalendarDays
                              size={15}
                              className="text-slate-400"
                            />

                            {formatDate(
                              visit.visitDate
                            )}

                          </div>

                        </td>


                        {/* TIME */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Clock
                              size={15}
                              className="text-slate-400"
                            />

                            {visit.visitTime ||
                              "Not specified"}

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-5 align-top">

                          <StatusBadge
                            status={
                              visit.status
                            }
                          />

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-5 align-top">

                          <div className="relative">

                            <select
                              value={
                                visit.status ||
                                "SCHEDULED"
                              }
                              disabled={
                                actionLoading ===
                                visit.id
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  visit.id,
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

                              {VISIT_STATUSES.map(
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

            {filteredVisits.map(
              (visit) => {

                const isUpdating =
                  actionLoading ===
                  visit.id;

                return (
                  <article
                    key={visit.id}
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

                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <CalendarDays
                            size={18}
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900">
                            Visit #{visit.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Lead #{visit.leadId}
                          </p>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          visit.status
                        }
                      />

                    </div>


                    {/* INFO GRID */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Buyer"
                        value={
                          visit.buyerName ||
                          `Buyer #${visit.buyerId || "—"}`
                        }
                        icon={User}
                      />

                      <InfoBox
                        label="Property"
                        value={
                          visit.propertyId
                            ? `#${visit.propertyId}`
                            : "—"
                        }
                        icon={
                          Building2
                        }
                      />

                      <InfoBox
                        label="Date"
                        value={formatDate(
                          visit.visitDate
                        )}
                        icon={
                          CalendarDays
                        }
                      />

                      <InfoBox
                        label="Time"
                        value={
                          visit.visitTime ||
                          "Not specified"
                        }
                        icon={Clock}
                      />

                    </div>


                    {/* PROPERTY NAME */}

                    {visit.propertyTitle && (
                      <div className="mt-3 rounded-xl bg-slate-50 p-4">

                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Property
                        </p>

                        <div className="mt-2 flex items-start gap-2">

                          <Building2
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <p className="text-sm font-semibold leading-5 text-slate-700">
                            {visit.propertyTitle}
                          </p>

                        </div>

                      </div>
                    )}


                    {/* UPDATE STATUS */}

                    <div className="mt-4">

                      <label
                        htmlFor={`visit-status-${visit.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Update Status
                      </label>

                      <div className="relative">

                        <select
                          id={`visit-status-${visit.id}`}
                          value={
                            visit.status ||
                            "SCHEDULED"
                          }
                          onChange={(
                            event
                          ) =>
                            handleStatusChange(
                              visit.id,
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
                            transition

                            focus:border-slate-500
                            focus:ring-4
                            focus:ring-slate-100

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >

                          {VISIT_STATUSES.map(
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

                          Updating visit...

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

    </div>
  );
}

export default VisitsManagement;