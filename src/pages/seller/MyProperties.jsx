import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, CheckCircle, Clock, Edit, Eye, Plus, RefreshCw, Search, Send, XCircle } from "lucide-react";
import { getMyProperties, submitPropertyForApproval } from "../../api/propertyApi";

export default function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getMyProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your properties.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleRefresh = async () => fetchProperties(false);

  const handleSubmitForApproval = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");
      const updated = await submitPropertyForApproval(propertyId);
      setProperties(prev => prev.map(p => p.id === propertyId ? updated : p));
      setSuccess("Property submitted for approval.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit property.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return properties.filter(p => {
      const matchSearch = !term ||
        p.title?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term) ||
        p.areaName?.toLowerCase().includes(term) ||
        String(p.id).includes(term);
      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [properties, search, statusFilter]);

  const formatPrice = (price) => price ? `₹${Number(price).toLocaleString("en-IN")}` : "Price on request";
  const formatStatus = (s) => s?.replace("_", " ") || "UNKNOWN";

  const getStatusMeta = (status) => {
    const map = {
      DRAFT: { className: "bg-slate-100 text-slate-700", icon: Edit },
      PENDING_APPROVAL: { className: "bg-amber-100 text-amber-700", icon: Clock },
      PUBLISHED: { className: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
      REJECTED: { className: "bg-red-100 text-red-700", icon: XCircle },
    };
    return map[status] || { className: "bg-slate-100 text-slate-600", icon: Clock };
  };

  const total = properties.length;
  const draftCount = properties.filter(p => p.status === "DRAFT").length;
  const pendingCount = properties.filter(p => p.status === "PENDING_APPROVAL").length;
  const publishedCount = properties.filter(p => p.status === "PUBLISHED").length;
  const rejectedCount = properties.filter(p => p.status === "REJECTED").length;
  const isFilterActive = search || statusFilter !== "ALL";

  const clearFilters = () => { setSearch(""); setStatusFilter("ALL"); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/seller/dashboard")} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
            <p className="text-sm text-slate-500">Manage your listings and track approval status.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleRefresh} disabled={loading || refreshing} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link to="/seller/properties/add" className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">
            <Plus size={15} /> Add Property
          </Link>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      {/* Stats */}
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total" value={loading ? "..." : total} icon={Building2} iconClass="bg-blue-50 text-blue-600" />
          <StatCard label="Draft" value={loading ? "..." : draftCount} icon={Edit} iconClass="bg-slate-100 text-slate-600" />
          <StatCard label="Pending" value={loading ? "..." : pendingCount} icon={Clock} valueClass="text-amber-600" iconClass="bg-amber-50 text-amber-600" />
          <StatCard label="Published" value={loading ? "..." : publishedCount} icon={CheckCircle} valueClass="text-emerald-600" iconClass="bg-emerald-50 text-emerald-600" />
          <StatCard label="Rejected" value={loading ? "..." : rejectedCount} icon={XCircle} valueClass="text-red-600" iconClass="bg-red-50 text-red-600" />
        </div>
      </section>

      {/* Search & Filter */}
      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Search & Filter</span>
            </div>
            {isFilterActive && (
              <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Clear filters</button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, area or ID..."
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          {!loading && (
            <p className="text-xs text-slate-400">{filtered.length} property{filtered.length !== 1 ? "s" : ""} found</p>
          )}
        </div>
      </section>

      {/* Property Grid */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <p className="mt-3 text-sm text-slate-500">Loading properties...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center">
          <Building2 size={40} className="text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">No properties found</h3>
          <p className="text-sm text-slate-500">No property matches your current search.</p>
          {isFilterActive ? (
            <button onClick={clearFilters} className="mt-3 rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium hover:bg-slate-50">
              Clear Filters
            </button>
          ) : (
            <Link to="/seller/properties/add" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">
              <Plus size={16} /> Add Property
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(property => {
            const status = getStatusMeta(property.status);
            const StatusIcon = status.icon;
            const image = property.images?.length > 0 ? property.images[0] : null;
            const isSubmitting = actionLoading === property.id;

            return (
              <div key={property.id} className="rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-48 bg-slate-100">
                  {image ? (
                    <img src={image} alt={property.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <Building2 size={32} />
                      <span className="mt-1 text-xs">No image</span>
                    </div>
                  )}
                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase shadow-sm ${status.className}`}>
                    <StatusIcon size={13} /> {formatStatus(property.status)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="line-clamp-2 text-base font-bold text-slate-900">{property.title || "Untitled"}</h2>
                  <p className="mt-2 text-sm text-slate-500 flex items-start gap-1">
                    <Building2 size={14} className="mt-0.5" /> {property.areaName || "Unknown"}, {property.city || "Unknown"}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{formatPrice(property.price)}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded bg-slate-50 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">BHK</p>
                      <p className="font-bold">{property.bhk ?? "—"}</p>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Area</p>
                      <p className="font-bold">{property.area ? `${property.area} sq.ft` : "—"}</p>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Type</p>
                      <p className="font-bold truncate">{property.propertyType || "—"}</p>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">ID</p>
                      <p className="font-bold">#{property.id}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 space-y-2">
                    <Link to={`/properties/${property.id}`} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold hover:bg-slate-50">
                      <Eye size={16} /> View Property
                    </Link>

                    {property.status === "DRAFT" && (
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/seller/properties/${property.id}/edit`} className="rounded-lg bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
                          <Edit size={15} className="inline mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleSubmitForApproval(property.id)}
                          disabled={isSubmitting}
                          className="rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting..." : <><Send size={15} className="inline mr-1" /> Submit</>}
                        </button>
                      </div>
                    )}

                    {property.status === "REJECTED" && (
                      <div>
                        <Link to={`/seller/properties/${property.id}/edit`} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                          <Edit size={16} /> Edit Property
                        </Link>
                        {property.rejectionReason && (
                          <div className="mt-2 rounded-lg border border-red-100 bg-red-50 p-2 text-xs text-red-700">
                            <p className="font-bold uppercase text-red-500">Reason:</p>
                            <p>{property.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {property.status === "PENDING_APPROVAL" && (
                      <div className="rounded-lg bg-amber-50 p-3 text-center text-xs font-semibold text-amber-700">
                        Waiting for admin approval
                      </div>
                    )}

                    {property.status === "PUBLISHED" && (
                      <div className="rounded-lg bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700">
                        <CheckCircle size={14} className="inline mr-1" /> Property is live
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Stat Card
const StatCard = ({ label, value, icon: Icon, iconClass, valueClass = "text-slate-900" }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
        <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
      </div>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon size={16} />
      </div>
    </div>
  </div>
);