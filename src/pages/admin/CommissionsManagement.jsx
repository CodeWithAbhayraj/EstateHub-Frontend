import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Receipt,
  Filter,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  getAllCommissions,
  updatePaymentStatus,
} from "../../api/commissionApi";

// ==========================================
// PAYMENT STATUSES
// ==========================================

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
];

// ==========================================
// STATUS BADGE
// ==========================================

function PaymentStatusBadge({ status }) {
  const statusClasses = {
    PENDING:
      "bg-amber-50 text-amber-700",

    PAID:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
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
      {status === "PAID" ? (
        <CheckCircle size={12} />
      ) : (
        <Clock size={12} />
      )}

      {status || "UNKNOWN"}
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
              break-words
              text-xl
              font-bold
              tracking-tight
              sm:text-2xl
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
  valueClass = "text-slate-700",
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

      <p
        className={`
          mt-1
          truncate
          text-xs
          font-bold
          sm:text-sm
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>
  );
}


// ==========================================
// MAIN COMPONENT
// ==========================================

function CommissionsManagement() {
  const [commissions, setCommissions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
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
  // FETCH COMMISSIONS
  // ==========================================

  const fetchCommissions = async (
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
        await getAllCommissions();

      setCommissions(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Commission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load commissions."
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
    fetchCommissions();
  }, []);


  // ==========================================
  // FILTERED COMMISSIONS
  // ==========================================

  const filteredCommissions = useMemo(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    return commissions.filter(
      (commission) => {

        const matchesSearch =
          !value ||
          String(
            commission.propertyTitle ||
              ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            commission.id || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            commission.dealId || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            commission.leadId || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            commission.propertyId || ""
          )
            .toLowerCase()
            .includes(value);

        const matchesPayment =
          paymentFilter === "ALL" ||
          commission.paymentStatus ===
            paymentFilter;

        return (
          matchesSearch &&
          matchesPayment
        );
      }
    );
  }, [
    commissions,
    search,
    paymentFilter,
  ]);


  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const handlePaymentStatusChange =
    async (
      commissionId,
      paymentStatus
    ) => {
      try {
        setActionLoading(
          commissionId
        );

        setError("");
        setSuccess("");

        const updatedCommission =
          await updatePaymentStatus(
            commissionId,
            paymentStatus
          );

        setCommissions((prev) =>
          prev.map(
            (commission) =>
              String(
                commission.id
              ) ===
              String(
                commissionId
              )
                ? updatedCommission
                : commission
          )
        );

        setSuccess(
          `Commission #${commissionId} updated successfully.`
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
    ).toLocaleString("en-IN")}`;
  };


  // ==========================================
  // STATS
  // ==========================================

  const totalRecords =
    commissions.length;

  const pendingRecords =
    commissions.filter(
      (commission) =>
        commission.paymentStatus ===
        "PENDING"
    ).length;

  const paidRecords =
    commissions.filter(
      (commission) =>
        commission.paymentStatus ===
        "PAID"
    ).length;

  const totalCommission =
    commissions.reduce(
      (total, commission) =>
        total +
        Number(
          commission.commissionAmount ||
            0
        ),
      0
    );

  const pendingCommission =
    commissions
      .filter(
        (commission) =>
          commission.paymentStatus ===
          "PENDING"
      )
      .reduce(
        (total, commission) =>
          total +
          Number(
            commission.commissionAmount ||
              0
          ),
        0
      );

  const paidCommission =
    commissions
      .filter(
        (commission) =>
          commission.paymentStatus ===
          "PAID"
      )
      .reduce(
        (total, commission) =>
          total +
          Number(
            commission.commissionAmount ||
              0
          ),
        0
      );

  const activeFilter =
    search.trim() !== "" ||
    paymentFilter !== "ALL";


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("ALL");
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
                <Receipt size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Commission Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Track commission earnings and payment status.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchCommissions(false)
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
            Commission Activity
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Records"
            value={totalRecords}
            description={`${pendingRecords} pending · ${paidRecords} paid`}
            icon={Receipt}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Total Commission"
            value={formatCurrency(
              totalCommission
            )}
            description="All commission earnings"
            icon={IndianRupee}
            valueClass="text-violet-600"
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Pending Amount"
            value={formatCurrency(
              pendingCommission
            )}
            description="Awaiting payment"
            icon={Clock}
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Paid Amount"
            value={formatCurrency(
              paidCommission
            )}
            description="Payment received"
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
                  Find a commission
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
                placeholder="Search property, commission ID, deal ID..."
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


            {/* PAYMENT FILTER */}

            <select
              value={
                paymentFilter
              }
              onChange={(event) =>
                setPaymentFilter(
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
                All Payment Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="PAID">
                Paid
              </option>

            </select>

          </div>


          {!loading && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                {filteredCommissions.length}{" "}
                {filteredCommissions.length ===
                1
                  ? "record"
                  : "records"}{" "}
                found
              </span>

              {paymentFilter !==
                "ALL" && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                  {paymentFilter}
                </span>
              )}

            </div>
          )}

        </div>

      </section>


      {/* ==========================================
          CONTENT
      ========================================== */}

      {loading ? (

        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading commissions...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredCommissions.length ===
        0 ? (

        /* ========================================
           EMPTY STATE
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">

              <Receipt
                size={30}
                className="text-emerald-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No commissions found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No commission records match your current search or filter.
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
                      Commission
                    </th>

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
                      Commission %
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Commission Amount
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Update
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredCommissions.map(
                    (commission) => {

                      const isUpdating =
                        actionLoading ===
                        commission.id;

                      return (
                        <tr
                          key={
                            commission.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* COMMISSION */}

                          <td className="px-5 py-5 align-top">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <Receipt
                                  size={18}
                                />

                              </div>

                              <div>

                                <p className="font-bold text-slate-900">
                                  #
                                  {
                                    commission.id
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  Lead #
                                  {
                                    commission.leadId ||
                                      "—"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* DEAL */}

                          <td className="px-5 py-5 align-top">

                            <p className="text-sm font-semibold text-slate-800">
                              Deal #
                              {
                                commission.dealId ||
                                  "—"
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Property #
                              {
                                commission.propertyId ||
                                  "—"
                              }
                            </p>

                          </td>


                          {/* PROPERTY */}

                          <td className="max-w-[230px] px-5 py-5 align-top">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {commission.propertyTitle ||
                                `Property #${commission.propertyId}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {commission.type
                                ? String(
                                    commission.type
                                  ).replaceAll(
                                    "_",
                                    " "
                                  )
                                : "Commission record"}
                            </p>

                          </td>


                          {/* DEAL AMOUNT */}

                          <td className="px-5 py-5 align-top">

                            <p className="text-sm font-bold text-slate-900">
                              {formatCurrency(
                                commission.dealAmount
                              )}
                            </p>

                          </td>


                          {/* PERCENTAGE */}

                          <td className="px-5 py-5 align-top">

                            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                              {commission.commissionPercentage ??
                                0}
                              %
                            </span>

                          </td>


                          {/* AMOUNT */}

                          <td className="px-5 py-5 align-top">

                            <p className="text-sm font-bold text-emerald-700">
                              {formatCurrency(
                                commission.commissionAmount
                              )}
                            </p>

                          </td>


                          {/* PAYMENT */}

                          <td className="px-5 py-5 align-top">

                            <PaymentStatusBadge
                              status={
                                commission.paymentStatus
                              }
                            />

                          </td>


                          {/* UPDATE */}

                          <td className="px-5 py-5 align-top">

                            <select
                              value={
                                commission.paymentStatus ||
                                "PENDING"
                              }
                              disabled={
                                isUpdating
                              }
                              onChange={(
                                event
                              ) =>
                                handlePaymentStatusChange(
                                  commission.id,
                                  event.target
                                    .value
                                )
                              }
                              className="
                                min-h-10
                                w-32
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
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

                              {PAYMENT_STATUSES.map(
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

            {filteredCommissions.map(
              (commission) => {

                const isUpdating =
                  actionLoading ===
                  commission.id;

                return (
                  <article
                    key={
                      commission.id
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

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                          <Receipt
                            size={18}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-900">
                            Commission #
                            {
                              commission.id
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Deal #
                            {
                              commission.dealId ||
                                "—"
                            }
                          </p>

                        </div>

                      </div>

                      <PaymentStatusBadge
                        status={
                          commission.paymentStatus
                        }
                      />

                    </div>


                    {/* PROPERTY */}

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Property
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-800">
                        {commission.propertyTitle ||
                          `Property #${commission.propertyId}`}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Property #
                        {
                          commission.propertyId ||
                            "—"
                        }
                      </p>

                    </div>


                    {/* INFO */}

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Deal Amount"
                        value={formatCurrency(
                          commission.dealAmount
                        )}
                        icon={
                          IndianRupee
                        }
                      />

                      <InfoBox
                        label="Commission"
                        value={`${commission.commissionPercentage ?? 0}%`}
                        icon={Receipt}
                      />

                      <InfoBox
                        label="Commission Amount"
                        value={formatCurrency(
                          commission.commissionAmount
                        )}
                        icon={
                          IndianRupee
                        }
                        valueClass="text-emerald-700"
                      />

                      <InfoBox
                        label="Lead"
                        value={
                          commission.leadId
                            ? `#${commission.leadId}`
                            : "—"
                        }
                        icon={
                          Receipt
                        }
                      />

                    </div>


                    {/* PAYMENT UPDATE */}

                    <div className="mt-4">

                      <label
                        htmlFor={`payment-status-${commission.id}`}
                        className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400"
                      >
                        Payment Status
                      </label>

                      <select
                        id={`payment-status-${commission.id}`}
                        value={
                          commission.paymentStatus ||
                          "PENDING"
                        }
                        disabled={
                          isUpdating
                        }
                        onChange={(
                          event
                        ) =>
                          handlePaymentStatusChange(
                            commission.id,
                            event.target
                              .value
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

                        {PAYMENT_STATUSES.map(
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

                      {isUpdating && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600">

                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />

                          Updating payment status...

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

export default CommissionsManagement;
