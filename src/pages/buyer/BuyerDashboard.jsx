import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Heart, CalendarDays, Bell, ArrowRight, Search, Home, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPublishedProperties } from "../../api/propertyApi";
import { getMyFavorites } from "../../api/favoriteApi";
import { getMyVisits } from "../../api/visitApi";
import { getUnreadNotificationCount } from "../../api/notificationApi";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ properties: 0, favorites: 0, visits: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [properties, favorites, visits, count] = await Promise.all([
          getPublishedProperties(),
          getMyFavorites(),
          getMyVisits(),
          getUnreadNotificationCount(),
        ]);
        setStats({
          properties: Array.isArray(properties) ? properties.length : 0,
          favorites: Array.isArray(favorites) ? favorites.length : 0,
          visits: Array.isArray(visits) ? visits.length : 0,
          notifications: Number(count) || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { title: "Available Properties", value: stats.properties, icon: Building2, link: "/properties", color: "bg-blue-50 text-blue-600" },
    { title: "My Favorites", value: stats.favorites, icon: Heart, link: "/buyer/favorites", color: "bg-rose-50 text-rose-600" },
    { title: "My Visits", value: stats.visits, icon: CalendarDays, link: "/buyer/visits", color: "bg-emerald-50 text-emerald-600" },
    { title: "Notifications", value: stats.notifications, icon: Bell, link: "/buyer/notifications", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700">Buyer Dashboard</span>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Welcome, {user?.name || "Buyer"}!</h1>
          <p className="text-sm text-slate-500">Find properties, manage favorites and visits.</p>
        </div>
        <Link to="/properties" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Search size={16} /> Browse Properties <ArrowRight size={16} />
        </Link>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Stats */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} to={card.link} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">{card.title}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? "..." : card.value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-500">View →</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Find Property", desc: "Search available properties", link: "/properties", icon: Search, color: "bg-blue-50 text-blue-600" },
            { title: "Favorites", desc: "Manage saved properties", link: "/buyer/favorites", icon: Heart, color: "bg-rose-50 text-rose-600" },
            { title: "My Visits", desc: "Check your scheduled visits", link: "/buyer/visits", icon: CalendarDays, color: "bg-emerald-50 text-emerald-600" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.link} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg bg-slate-900 p-6 text-white">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Home size={20} />
              <h2 className="text-xl font-bold">Find your next property</h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">Browse published properties, save favorites, and schedule visits.</p>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> Verified listings</span>
              <span className="flex items-center gap-1">✓ Easy discovery</span>
            </div>
          </div>
          <Link to="/properties" className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            Explore Properties <ArrowRight size={16} className="inline" />
          </Link>
        </div>
      </section>
    </div>
  );
}