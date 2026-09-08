import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Clock, CheckCircle, XCircle, ArrowRight, RefreshCw, Eye } from "lucide-react";
import { getMyProperties } from "../../api/propertyApi";

export default function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");
  let user = null;
  try { user = savedUser ? JSON.parse(savedUser) : null; } catch {}
  const userName = user?.name || localStorage.getItem("name") || "Seller";

  const loadProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getMyProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load properties.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadProperties(); }, []);

  const handleRefresh = async () => loadProperties(false);

  const totalProperties = properties.length;
  const draftProperties = properties.filter(p => p.status === "DRAFT").length;
  const pendingProperties = properties.filter(p => p.status === "PENDING_APPROVAL").length;
  const publishedProperties = properties.filter(p => p.status === "PUBLISHED").length;
  const rejectedProperties = properties.filter(p => p.status === "REJECTED").length;

  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT": return "bg-slate-100 text-slate-600";
      case "PENDING_APPROVAL": return "bg-amber-100 text-amber-700";
      case "PUBLISHED": return "bg-emerald-100 text-emerald-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const formatStatus = (status) => status?.replace("_", " ") || "UNKNOWN";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-blue-600">EstateHub Seller</p>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {userName}!</h1>
          <p className="text-sm text-slate-500">Manage your properties and track approval status.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link
            to="/seller/properties/add"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={15} /> Add Property
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total" value={loading ? "..." : totalProperties} icon={Building2} color="bg-blue-50 text-blue-600" />
          <StatCard label="Draft" value={loading ? "..." : draftProperties} icon={Clock} color="bg-slate-100 text-slate-600" />
          <StatCard label="Pending" value={loading ? "..." : pendingProperties} icon={Clock} color="bg-amber-50 text-amber-600" valueColor="text-amber-600" />
          <StatCard label="Published" value={loading ? "..." : publishedProperties} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" valueColor="text-emerald-600" />
          <StatCard label="Rejected" value={loading ? "..." : rejectedProperties} icon={XCircle} color="bg-red-50 text-red-600" valueColor="text-red-600" />
        </div>
      </section>

      {/* Recent Properties */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Listings</p>
            <h2 className="text-lg font-bold text-slate-900">My Properties</h2>
            <p className="text-sm text-slate-500">Your latest property listings.</p>
          </div>
          <Link to="/seller/properties" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
              <p className="mt-3 text-sm text-slate-500">Loading properties...</p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center sm:p-10">
            <Building2 size={32} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-900">No properties yet</h3>
            <p className="text-sm text-slate-500">Start by adding your first property.</p>
            <Link to="/seller/properties/add" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <Plus size={16} /> Add Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex flex-col gap-3 p-4 hover:bg-slate-50 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900">{property.title || "Untitled"}</h3>
                    <p className="truncate text-xs text-slate-500">{property.areaName || "—"}, {property.city || "—"}</p>
                    <p className="text-xs font-semibold text-blue-600">
                      ₹{Number(property.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusClass(property.status)}`}>
                    {formatStatus(property.status)}
                  </span>
                  <Link to={`/properties/${property.id}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Eye size={14} /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase text-slate-400">How it works</p>
          <h2 className="text-lg font-bold text-slate-900">Property Listing Process</h2>
          <p className="text-sm text-slate-500">Follow these steps to get your property published.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { num: "01", title: "Add Property", desc: "Enter property information." },
            { num: "02", title: "Submit for Approval", desc: "Complete and submit." },
            { num: "03", title: "Admin Verification", desc: "Admin reviews your property." },
            { num: "04", title: "Property Goes Live", desc: "Approved properties become visible." },
          ].map((step) => (
            <div key={step.num} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
                {step.num}
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800">{step.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Stat Card helper
const StatCard = ({ label, value, icon: Icon, color, valueColor = "text-slate-900" }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
        <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
      </div>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
        <Icon size={16} />
      </div>
    </div>
  </div>
);