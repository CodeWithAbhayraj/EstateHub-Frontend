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
          properties: Array.isArray(properties) ? properties.length : 0,
          favorites: Array.isArray(favorites) ? favorites.length : 0,
          visits: Array.isArray(visits) ? visits.length : 0,
          notifications: Number(notificationCount) || 0,
        });
      } catch (err) {
        console.error("Buyer dashboard error:", err);

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

  const statCards = [
    {
      title: "Available Properties",
      value: stats.properties,
      icon: Building2,
      link: "/properties",
      description: "Explore published properties",
    },
    {
      title: "My Favorites",
      value: stats.favorites,
      icon: Heart,
      link: "/buyer/favorites",
      description: "Your saved properties",
    },
    {
      title: "My Visits",
      value: stats.visits,
      icon: CalendarDays,
      link: "/buyer/visits",
      description: "Scheduled property visits",
    },
    {
      title: "Notifications",
      value: stats.notifications,
      icon: Bell,
      link: "/buyer/notifications",
      description: "Unread notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Buyer Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Welcome, {user?.name || "Buyer"}!
              </h1>

              <p className="mt-2 text-slate-500">
                Find properties, manage favorites and track your visits.
              </p>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Search size={18} />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "..." : card.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {card.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  View
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <Link
              to="/properties"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                  <Search size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Find Property
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Search available properties
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/buyer/favorites"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-pink-50 p-3 text-pink-600">
                  <Heart size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Favorites
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage saved properties
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/buyer/visits"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-3 text-green-600">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    My Visits
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Check your scheduled visits
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Welcome Card */}
        <section className="mt-8 rounded-2xl bg-slate-900 p-8 text-white">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Home size={24} />
                <h2 className="text-2xl font-bold">
                  Find your next property
                </h2>
              </div>

              <p className="mt-2 max-w-2xl text-slate-300">
                Browse published properties, save the ones you like and
                schedule visits with EstateHub.
              </p>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BuyerDashboard;