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
} from "lucide-react";

import { getDashboardStats } from "../../api/dashboardApi";

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <Icon size={21} className="text-slate-700" />
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Dashboard Error
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor properties, users, leads, visits and business
              performance.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Property Stats */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Property Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Properties"
              value={stats?.totalProperties}
              icon={Building2}
              description="All properties in system"
            />

            <StatCard
              title="Pending Approval"
              value={stats?.pendingProperties}
              icon={Clock3}
              description="Waiting for admin approval"
            />

            <StatCard
              title="Published Properties"
              value={stats?.publishedProperties}
              icon={Building2}
              description="Live properties"
            />
          </div>
        </section>

        {/* User Stats */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Users
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Total Buyers"
              value={stats?.totalBuyers}
              icon={Users}
              description="Registered buyers"
            />

            <StatCard
              title="Total Sellers"
              value={stats?.totalSellers}
              icon={UserRoundCheck}
              description="Registered sellers"
            />
          </div>
        </section>

        {/* Lead & Visit Stats */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Leads & Visits
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={stats?.totalLeads}
              icon={MessageSquare}
              description="All enquiries"
            />

            <StatCard
              title="New Leads"
              value={stats?.newLeads}
              icon={MessageSquare}
              description="Needs attention"
            />

            <StatCard
              title="Total Visits"
              value={stats?.totalVisits}
              icon={CalendarDays}
              description="All property visits"
            />

            <StatCard
              title="Upcoming Visits"
              value={stats?.upcomingVisits}
              icon={CalendarDays}
              description="Visits scheduled today"
            />
          </div>
        </section>

        {/* Business Stats */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Business Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Deals"
              value={stats?.totalDeals}
              icon={Handshake}
              description="All deals"
            />

            <StatCard
              title="Total Commission"
              value={formatCurrency(stats?.totalCommission)}
              icon={IndianRupee}
              description="Generated commission"
            />

            <StatCard
              title="Pending Commission"
              value={formatCurrency(stats?.pendingCommission)}
              icon={Clock3}
              description="Awaiting payment"
            />

            <StatCard
              title="Paid Commission"
              value={formatCurrency(stats?.paidCommission)}
              icon={IndianRupee}
              description="Commission received"
            />
          </div>
        </section>

        {/* Quick Summary */}
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UserRoundCog
                size={22}
                className="text-slate-700"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Admin Summary
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Properties waiting
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {stats?.pendingProperties ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  New enquiries
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {stats?.newLeads ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Today's visits
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {stats?.upcomingVisits ?? 0}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;