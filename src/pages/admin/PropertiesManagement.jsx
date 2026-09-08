import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Clock3,
  Eye,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getAllPropertiesForAdmin, approveProperty, rejectProperty } from "../../api/propertyApi";

function PropertiesManagement() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchProperties = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoading(true) : setRefreshing(true);
      setError("");

      const data = await getAllPropertiesForAdmin();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Properties error:", err);
      setError(err.response?.data?.message || "Failed to load properties.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRefresh = async () => {
    await fetchProperties(false);
  };

  const filteredProperties = useMemo(() => {
    const value = search.toLowerCase().trim();

    return properties.filter((property) => {
      const matchesSearch =
        !value ||
        [property.title, property.city, property.areaName, property.id].some((field) =>
          String(field || "").toLowerCase().includes(value)
        );

      const matchesStatus = statusFilter === "ALL" || property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, statusFilter]);

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "Price on request";
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");

      const updatedProperty = await approveProperty(propertyId);

      setProperties((prev) =>
        prev.map((property) => (String(property.id) === String(propertyId) ? updatedProperty : property))
      );

      setSuccess("Property approved successfully.");
    } catch (err) {
      console.error("Approve property error:", err);
      setError(err.response?.data?.message || "Failed to approve property.");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setRejectionReason("");
    setError("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    if (actionLoading !== null) return;
    setShowRejectModal(false);
    setSelectedProperty(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedProperty) return;

    const reason = rejectionReason.trim();
    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading(selectedProperty.id);
      setError("");
      setSuccess("");

      const updatedProperty = await rejectProperty(selectedProperty.id, reason);

      setProperties((prev) =>
        prev.map((property) =>
          String(property.id) === String(selectedProperty.id) ? updatedProperty : property
        )
      );

      setSuccess("Property rejected successfully.");
      setShowRejectModal(false);
      setSelectedProperty(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Reject property error:", err);
      setError(err.response?.data?.message || "Failed to reject property.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case "DRAFT":
        return { label: "Draft", className: "bg-slate-100 text-slate-700", icon: Building2 };
      case "PENDING_APPROVAL":
        return { label: "Pending", className: "bg-amber-50 text-amber-700", icon: Clock3 };
      case "PUBLISHED":
        return { label: "Published", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle };
      case "REJECTED":
        return { label: "Rejected", className: "bg-red-50 text-red-700", icon: XCircle };
      case "SOLD":
        return { label: "Sold", className: "bg-violet-50 text-violet-700", icon: CheckCircle };
      default:
        return { label: status || "Unknown", className: "bg-slate-100 text-slate-600", icon: Building2 };
    }
  };

  const totalCount = properties.length;
  const pendingCount = properties.filter((p) => p.status === "PENDING_APPROVAL").length;
  const publishedCount = properties.filter((p) => p.status === "PUBLISHED").length;
  const rejectedCount = properties.filter((p) => p.status === "REJECTED").length;

  const activeFilter = statusFilter !== "ALL" || search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Properties Management</h1>
          <p className="mt-1 text-sm text-slate-500">Review, approve and manage all property listings.</p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={totalCount} description="All properties" icon={Building2} iconClass="bg-blue-50 text-blue-600" />
        <StatCard label="Pending" value={pendingCount} description="Need review" icon={Clock3} valueClass="text-amber-600" iconClass="bg-amber-50 text-amber-600" />
        <StatCard label="Published" value={publishedCount} description="Live listings" icon={CheckCircle} valueClass="text-emerald-600" iconClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Rejected" value={rejectedCount} description="Need changes" icon={XCircle} valueClass="text-red-600" iconClass="bg-red-50 text-red-600" />
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, city, area or property ID..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>
            {loading ? "Loading..." : `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"} found`}
          </span>
          {activeFilter && (
            <button type="button" onClick={clearFilters} className="font-medium text-blue-600 hover:text-blue-700">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            <p className="mt-3 text-sm text-slate-500">Loading properties...</p>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Building2 size={28} className="text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No properties found</h3>
          <p className="mt-1 text-sm text-slate-500">No properties match your search or status filter.</p>
          {activeFilter && (
            <button type="button" onClick={clearFilters} className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => {
            const statusMeta = getStatusMeta(property.status);
            const StatusIcon = statusMeta.icon;
            const imageUrl = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
            const isActionLoading = actionLoading === property.id;

            return (
              <article key={property.id} className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* IMAGE */}
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  {imageUrl ? (
                    <img src={imageUrl} alt={property.title || "Property"} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-300">
                      <Building2 size={26} />
                      <p className="mt-2 text-xs font-medium">No image</p>
                    </div>
                  )}

                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                    <StatusIcon size={12} />
                    {statusMeta.label}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
                    {property.title || "Untitled Property"}
                  </h2>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} className="shrink-0 text-slate-400" />
                    <span className="line-clamp-1">
                      {property.areaName || "Unknown Area"}{property.areaName && property.city ? ", " : ""}{property.city || "Unknown City"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                    <IndianRupee size={16} className="text-slate-500" />
                    {formatPrice(property.price).replace("₹", "")}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <InfoBox label="BHK" value={property.bhk ?? "—"} />
                    <InfoBox label="Area" value={property.area ? `${property.area} sq.ft` : "—"} />
                    <InfoBox label="Type" value={property.propertyType || "—"} />
                    <InfoBox label="ID" value={`#${property.id}`} />
                  </div>

                  {property.description && (
                    <p className="line-clamp-2 text-xs text-slate-500">{property.description}</p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto space-y-2 pt-2">
                    <Link
                      to={`/properties/${property.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Eye size={15} />
                      View Property
                      <ArrowRight size={14} className="text-slate-400" />
                    </Link>

                    {property.status === "PENDING_APPROVAL" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(property.id)}
                          disabled={isActionLoading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 sm:text-sm"
                        >
                          {isActionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                          {isActionLoading ? "Processing..." : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() => openRejectModal(property)}
                          disabled={isActionLoading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 sm:text-sm"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}

                    {property.status === "PUBLISHED" && (
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle size={14} />
                        Property is live
                      </div>
                    )}

                    {property.status === "REJECTED" && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                          <XCircle size={14} />
                          Property Rejected
                        </div>
                        {property.rejectionReason && (
                          <p className="mt-1 text-xs text-red-600">{property.rejectionReason}</p>
                        )}
                      </div>
                    )}

                    {property.status === "DRAFT" && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-center text-xs font-semibold text-slate-500">
                        Draft property
                      </div>
                    )}

                    {property.status === "SOLD" && (
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 p-2.5 text-xs font-semibold text-violet-700">
                        <CheckCircle size={14} />
                        Property Sold
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={closeRejectModal}>
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white" onClick={(event) => event.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900">Reject Property</h2>
              <p className="mt-1 text-sm text-slate-500">Provide a clear reason for rejecting this listing.</p>
            </div>

            {/* MODAL BODY */}
            <div className="p-5">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-400">Property</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {selectedProperty.title || "Untitled Property"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Property ID: #{selectedProperty.id}</p>
              </div>

              <label htmlFor="rejection-reason" className="mt-4 block text-sm font-medium text-slate-700">
                Rejection Reason
              </label>

              <textarea
                id="rejection-reason"
                rows={5}
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Enter the reason for rejection..."
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />

              <p className="mt-1.5 text-xs text-slate-400">A rejection reason will be visible to the seller.</p>

              {/* MODAL ACTIONS */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={actionLoading !== null}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={actionLoading === selectedProperty.id}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === selectedProperty.id ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Reject Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, description, icon: Icon, iconClass = "", valueClass = "text-slate-900" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          <p className={`mt-1 text-xl font-bold sm:text-2xl ${valueClass}`}>{value}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{description}</p>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

export default PropertiesManagement;