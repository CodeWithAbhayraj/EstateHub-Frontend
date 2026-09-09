import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserRoundCheck,
  UserRoundCog,
  MessageSquare,
  CalendarDays,
  Handshake,
  IndianRupee,
  Clock3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { getDashboardStats } from "../../api/dashboardApi";


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClass = "bg-slate-100 text-slate-700",
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

        {/* CONTENT */}

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {title}
          </p>

          <h3
            className={`
              mt-2
              break-words
              text-2xl
              font-bold
              tracking-tight
              sm:text-3xl
              ${valueClass}
            `}
          >
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-400 sm:text-xs">
              {description}
            </p>
          )}

        </div>

        {/* ICON */}

        {Icon && (
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
        )}

      </div>
    </div>
  );
}


// ==========================================
// SUMMARY ITEM
// ==========================================

function SummaryItem({
  label,
  value,
  icon: Icon,
  iconClass = "bg-slate-100 text-slate-600",
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        {Icon && (
          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              ${iconClass}
            `}
          >
            <Icon size={16} />
          </div>
        )}

        <div className="min-w-0">

          <p className="truncate text-xs font-medium text-slate-400">
            {label}
          </p>

          <p
            className={`
              mt-1
              truncate
              text-lg
              font-bold
              ${valueClass}
            `}
          >
            {value ?? 0}
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// MAIN COMPONENT
// ==========================================

function AdminDashboard() {
  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async (
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
        await getDashboardStats();

      setStats(data);
    } catch (err) {
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load admin dashboard."
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
    fetchDashboard();
  }, []);


  // ==========================================
  // CURRENCY FORMAT
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

    const number =
      Number(value);

    if (Number.isNaN(number)) {
      return "₹0";
    }

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;
  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="px-4 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading admin dashboard...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching latest business data.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error && !stats) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle size={20} />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-red-800">
                Dashboard Error
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-600">
                {error}
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              fetchDashboard()
            }
            className="
              mt-5
              inline-flex
              min-h-11
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
              transition

              hover:bg-slate-800

              active:scale-[0.98]
            "
          >
            <RefreshCw size={16} />
            Retry
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <UserRoundCog size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Admin Dashboard
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Monitor properties, users, leads, visits and business performance.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchDashboard(false)
              }
              disabled={refreshing}
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
          ERROR BANNER
      ========================================== */}

      {error && stats && (
        <div
          className="
            mb-5
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
            text-red-600
          "
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}


      {/* ==========================================
          PROPERTY OVERVIEW
      ========================================== */}

      <section>

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Properties
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Property Overview
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

          <StatCard
            title="Total Properties"
            value={
              stats?.totalProperties
            }
            icon={Building2}
            description="All properties in the system"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Pending Approval"
            value={
              stats?.pendingProperties
            }
            icon={Clock3}
            description="Waiting for verification"
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Published"
            value={
              stats?.publishedProperties
            }
            icon={CheckCircle}
            description="Currently live properties"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

      </section>


      {/* ==========================================
          USER OVERVIEW
      ========================================== */}

      <section className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Users
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            User Overview
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

          <StatCard
            title="Total Buyers"
            value={
              stats?.totalBuyers
            }
            icon={Users}
            description="Registered buyers"
            valueClass="text-blue-600"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Total Sellers"
            value={
              stats?.totalSellers
            }
            icon={UserRoundCheck}
            description="Registered sellers"
            valueClass="text-orange-600"
            iconClass="bg-orange-50 text-orange-600"
          />

          <StatCard
            title="Total Users"
            value={
              (Number(
                stats?.totalBuyers || 0
              ) +
                Number(
                  stats?.totalSellers || 0
                ))
            }
            icon={Users}
            description="Buyers + sellers"
            iconClass="bg-violet-50 text-violet-600"
          />

        </div>

      </section>


      {/* ==========================================
          LEADS & VISITS
      ========================================== */}

      <section className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Engagement
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Leads & Visits
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            title="Total Leads"
            value={
              stats?.totalLeads
            }
            icon={MessageSquare}
            description="All buyer enquiries"
            valueClass="text-blue-600"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="New Leads"
            value={
              stats?.newLeads
            }
            icon={MessageSquare}
            description="Needs attention"
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Total Visits"
            value={
              stats?.totalVisits
            }
            icon={CalendarDays}
            description="All property visits"
            valueClass="text-violet-600"
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Upcoming Visits"
            value={
              stats?.upcomingVisits
            }
            icon={CalendarDays}
            description="Upcoming scheduled visits"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

      </section>


      {/* ==========================================
          BUSINESS OVERVIEW
      ========================================== */}

      <section className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Business
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Business Overview
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            title="Total Deals"
            value={
              stats?.totalDeals
            }
            icon={Handshake}
            description="All recorded deals"
            valueClass="text-violet-600"
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Total Commission"
            value={formatCurrency(
              stats?.totalCommission
            )}
            icon={IndianRupee}
            description="Generated commission"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Pending Commission"
            value={formatCurrency(
              stats?.pendingCommission
            )}
            icon={Clock3}
            description="Awaiting payment"
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Paid Commission"
            value={formatCurrency(
              stats?.paidCommission
            )}
            icon={CheckCircle}
            description="Commission received"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

      </section>


      {/* ==========================================
          QUICK SUMMARY
      ========================================== */}

      <section className="mt-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          {/* Header */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <UserRoundCog size={19} />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Snapshot
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                Admin Summary
              </h2>

            </div>

          </div>


          {/* Summary */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <SummaryItem
              label="Properties waiting"
              value={
                stats?.pendingProperties
              }
              icon={Clock3}
              iconClass="bg-amber-50 text-amber-600"
              valueClass="text-amber-600"
            />

            <SummaryItem
              label="New enquiries"
              value={
                stats?.newLeads
              }
              icon={MessageSquare}
              iconClass="bg-blue-50 text-blue-600"
              valueClass="text-blue-600"
            />

            <SummaryItem
              label="Upcoming visits"
              value={
                stats?.upcomingVisits
              }
              icon={CalendarDays}
              iconClass="bg-emerald-50 text-emerald-600"
              valueClass="text-emerald-600"
            />

          </div>

        </div>

      </section>


      {/* ==========================================
          REFRESH FOOTER
      ========================================== */}

      <div className="mt-6 text-center">

        <p className="text-xs text-slate-400">
          Dashboard data is loaded from the latest available system records.
        </p>

      </div>

    </div>
  );
}

export default AdminDashboard;