import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Building2,
  Heart,
  CalendarDays,
  Bell,
  ArrowRight,
  Search,
  Home,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getPublishedProperties } from "../../api/propertyApi";
import { getMyFavorites } from "../../api/favoriteApi";
import { getMyVisits } from "../../api/visitApi";
import { getUnreadNotificationCount } from "../../api/notificationApi";

function BuyerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    favorites: 0,
    visits: 0,
    notifications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          properties,
          favorites,
          visits,
          notificationCount,
        ] = await Promise.all([
          getPublishedProperties(),
          getMyFavorites(),
          getMyVisits(),
          getUnreadNotificationCount(),
        ]);

        setStats({
          properties: Array.isArray(properties)
            ? properties.length
            : 0,

          favorites: Array.isArray(favorites)
            ? favorites.length
            : 0,

          visits: Array.isArray(visits)
            ? visits.length
            : 0,

          notifications:
            Number(notificationCount) || 0,
        });
      } catch (err) {
        console.error(
          "Buyer dashboard error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [
    {
      title: "Available Properties",
      value: stats.properties,
      icon: Building2,
      link: "/properties",
      description: "Explore published properties",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      title: "My Favorites",
      value: stats.favorites,
      icon: Heart,
      link: "/buyer/favorites",
      description: "Your saved properties",
      iconBg: "bg-rose-50",
      iconText: "text-rose-600",
    },
    {
      title: "My Visits",
      value: stats.visits,
      icon: CalendarDays,
      link: "/buyer/visits",
      description: "Scheduled property visits",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      title: "Notifications",
      value: stats.notifications,
      icon: Bell,
      link: "/buyer/notifications",
      description: "Unread notifications",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
  ];

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions = [
    {
      title: "Find Property",
      description: "Search available properties",
      link: "/properties",
      icon: Search,
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      title: "Favorites",
      description: "Manage saved properties",
      link: "/buyer/favorites",
      icon: Heart,
      iconBg: "bg-rose-50",
      iconText: "text-rose-600",
    },
    {
      title: "My Visits",
      description: "Check your scheduled visits",
      link: "/buyer/visits",
      icon: CalendarDays,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
  ];

  return (
    <div className="w-full">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-slate-50 blur-3xl" />


          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">

              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                Buyer Dashboard
              </span>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Welcome, {user?.name || "Buyer"}!
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Find properties, manage your favorites and keep track
                of your scheduled visits.
              </p>

            </div>


            <Link
              to="/properties"
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

                sm:w-fit
              "
            >
              <Search size={17} />
              Browse Properties
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>
      </section>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="
            mb-6
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
          {error}
        </div>
      )}


      {/* ==========================================
          STATS
      ========================================== */}

      <section>

        <div className="mb-4 flex items-end justify-between gap-3">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Your activity
            </h2>
          </div>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:shadow-md

                  active:scale-[0.99]
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {loading ? "..." : card.value}
                    </p>

                  </div>


                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${card.iconBg}
                      ${card.iconText}
                    `}
                  >
                    <Icon size={21} />
                  </div>

                </div>


                <p className="mt-4 text-sm leading-5 text-slate-500">
                  {card.description}
                </p>


                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition group-hover:text-blue-600">

                  View

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />

                </div>

              </Link>
            );
          })}

        </div>

      </section>


      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <section className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Shortcuts
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Quick Actions
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.link}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:shadow-md
                "
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${action.iconBg}
                        ${action.iconText}
                      `}
                    >
                      <Icon size={20} />
                    </div>


                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {action.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {action.description}
                      </p>

                    </div>

                  </div>


                  <ArrowRight
                    size={17}
                    className="shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-700"
                  />

                </div>

              </Link>
            );
          })}

        </div>

      </section>


      {/* ==========================================
          FEATURE / CTA
      ========================================== */}

      <section className="mt-8 overflow-hidden rounded-2xl bg-slate-900">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Decoration */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />


          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Home size={21} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    EstateHub
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Find your next property
                  </h2>

                </div>

              </div>


              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                Browse published properties, save the ones you like,
                contact the agent and schedule your next visit.
              </p>


              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <ShieldCheck
                    size={15}
                    className="text-emerald-400"
                  />
                  Verified listings
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckMark />
                  Easy property discovery
                </div>

              </div>

            </div>


            <Link
              to="/properties"
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-900
                transition
                hover:bg-slate-100
                active:scale-[0.98]

                sm:w-fit
              "
            >
              Explore Properties
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

// ==========================================
// SMALL CHECK ICON
// ==========================================

function CheckMark() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
      <span className="text-[10px]">✓</span>
    </span>
  );
}

export default BuyerDashboard;