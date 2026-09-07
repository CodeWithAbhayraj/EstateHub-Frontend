import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { getDashboardStats } from "../../api/dashboardApi";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

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
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await fetchDashboard(false);
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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="w-full">

        <div className="flex min-h-[65vh] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading admin dashboard...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !stats) {
    return (
      <div className="w-full">

        <div className="flex min-h-[65vh] items-center justify-center">

          <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Dashboard Error
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchDashboard()
              }
              className="
                mt-6
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

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-slate-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="min-w-0">

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                EstateHub Administration
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Monitor properties, users, leads, visits and business performance from one place.
              </p>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
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
                transition-all
                duration-200

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
                : "Refresh Dashboard"}
            </button>

          </div>

        </div>

      </section>


      {/* ==========================================
          ERROR BANNER
      ========================================== */}

      {error && (
        <div
          className="
            mb-6
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


      {/* ==========================================
          PROPERTY OVERVIEW
      ========================================== */}

      <DashboardSection
        eyebrow="Overview"
        title="Property Overview"
        description="Track the current state of property listings."
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            title="Total Properties"
            value={
              stats?.totalProperties
            }
            icon={Building2}
            description="All properties in system"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Pending Approval"
            value={
              stats?.pendingProperties
            }
            icon={Clock3}
            description="Waiting for admin approval"
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Published Properties"
            value={
              stats?.publishedProperties
            }
            icon={CheckCircle}
            description="Live properties"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

      </DashboardSection>


      {/* ==========================================
          USER OVERVIEW
      ========================================== */}

      <DashboardSection
        eyebrow="Users"
        title="User Overview"
        description="Monitor buyer and seller registrations."
        className="mt-8"
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <StatCard
            title="Total Buyers"
            value={
              stats?.totalBuyers
            }
            icon={Users}
            description="Registered buyers"
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Total Sellers"
            value={
              stats?.totalSellers
            }
            icon={UserRoundCheck}
            description="Registered sellers"
            iconClass="bg-indigo-50 text-indigo-600"
          />

        </div>

      </DashboardSection>


      {/* ==========================================
          LEADS + VISITS
      ========================================== */}

      <DashboardSection
        eyebrow="Operations"
        title="Leads & Visits"
        description="Keep track of customer activity and scheduled visits."
        className="mt-8"
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Leads"
            value={
              stats?.totalLeads
            }
            icon={MessageSquare}
            description="All enquiries"
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
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Upcoming Visits"
            value={
              stats?.upcomingVisits
            }
            icon={CalendarDays}
            description="Scheduled visits"
            valueClass="text-blue-600"
            iconClass="bg-blue-50 text-blue-600"
          />

        </div>

      </DashboardSection>


      {/* ==========================================
          BUSINESS OVERVIEW
      ========================================== */}

      <DashboardSection
        eyebrow="Business"
        title="Business Overview"
        description="Monitor deals and commission performance."
        className="mt-8"
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Deals"
            value={
              stats?.totalDeals
            }
            icon={Handshake}
            description="All deals"
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
            currency
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
            currency
          />

          <StatCard
            title="Paid Commission"
            value={formatCurrency(
              stats?.paidCommission
            )}
            icon={IndianRupee}
            description="Commission received"
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
            currency
          />

        </div>

      </DashboardSection>


      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <DashboardSection
        eyebrow="Management"
        title="Quick Actions"
        description="Jump directly to the areas you manage most."
        className="mt-8"
      >

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            to="/admin/properties"
            icon={Building2}
            title="Properties"
            description="Review and manage listings"
            iconClass="bg-blue-50 text-blue-600"
          />

          <QuickAction
            to="/admin/leads"
            icon={MessageSquare}
            title="Leads"
            description="Manage customer enquiries"
            iconClass="bg-violet-50 text-violet-600"
          />

          <QuickAction
            to="/admin/visits"
            icon={CalendarDays}
            title="Visits"
            description="Manage scheduled visits"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <QuickAction
            to="/admin/deals"
            icon={Handshake}
            title="Deals"
            description="Track completed business"
            iconClass="bg-amber-50 text-amber-600"
          />

        </div>

      </DashboardSection>


      {/* ==========================================
          ADMIN SUMMARY
      ========================================== */}

      <section className="mt-8 overflow-hidden rounded-2xl bg-slate-900 shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Decoration */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">

            {/* HEADER */}

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <UserRoundCog size={20} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Admin Summary
                </p>

                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  Attention needed
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  A quick snapshot of areas that may require your attention.
                </p>

              </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <SummaryItem
                label="Properties Waiting"
                value={
                  stats?.pendingProperties ??
                  0
                }
                icon={Clock3}
                href="/admin/properties"
              />

              <SummaryItem
                label="New Enquiries"
                value={
                  stats?.newLeads ?? 0
                }
                icon={MessageSquare}
                href="/admin/leads"
              />

              <SummaryItem
                label="Upcoming Visits"
                value={
                  stats?.upcomingVisits ??
                  0
                }
                icon={CalendarDays}
                href="/admin/visits"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          FOOTER SPACE
      ========================================== */}

      <div className="h-4" />

    </div>
  );
}


// ==========================================
// DASHBOARD SECTION
// ==========================================

function DashboardSection({
  eyebrow,
  title,
  description,
  className = "",
  children,
}) {
  return (
    <section className={className}>

      <div className="mb-4">

        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClass = "",
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

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {title}
          </p>

          <p
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
          </p>

          {description && (
            <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-slate-400 sm:text-xs">
              {description}
            </p>
          )}

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
// QUICK ACTION
// ==========================================

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  iconClass = "",
}) {
  return (
    <Link
      to={to}
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

      <div className="flex items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconClass}
            `}
          >
            <Icon size={19} />
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-sm font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>


        <ArrowRight
          size={16}
          className="
            shrink-0
            text-slate-300
            transition-all
            duration-200

            group-hover:translate-x-1
            group-hover:text-slate-700
          "
        />

      </div>

    </Link>
  );
}


// ==========================================
// SUMMARY ITEM
// ==========================================

function SummaryItem({
  label,
  value,
  icon: Icon,
  href,
}) {
  return (
    <Link
      to={href}
      className="
        group
        rounded-xl
        border
        border-white/10
        bg-white/5
        p-4
        transition

        hover:bg-white/10
      "
    >

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>

        </div>


        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300">
          <Icon size={17} />
        </div>

      </div>


      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-white">

        View

        <ArrowRight
          size={13}
          className="transition-transform group-hover:translate-x-1"
        />

      </div>

    </Link>
  );
}

export default AdminDashboard;