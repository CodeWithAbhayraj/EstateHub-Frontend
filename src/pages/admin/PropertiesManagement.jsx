import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getAllPropertiesForAdmin,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

function PropertiesManagement() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // FETCH ALL PROPERTIES
  // ==========================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPropertiesForAdmin();

      const propertyList = Array.isArray(data) ? data : [];

      setProperties(propertyList);
      setFilteredProperties(propertyList);
    } catch (err) {
      console.error("Properties error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {
    const value = search.toLowerCase().trim();

    const result = properties.filter((property) => {
      const matchesSearch =
        !value ||
        String(property.title || "")
          .toLowerCase()
          .includes(value) ||
        String(property.city || "")
          .toLowerCase()
          .includes(value) ||
        String(property.areaName || "")
          .toLowerCase()
          .includes(value) ||
        String(property.id || "")
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "ALL" ||
        property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredProperties(result);
  }, [search, statusFilter, properties]);

  // ==========================================
  // PRICE FORMAT
  // ==========================================

  const formatPrice = (price) => {
    if (!price) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // APPROVE PROPERTY
  // ==========================================

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError("");

      const updatedProperty =
        await approveProperty(propertyId);

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? updatedProperty
            : property
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to approve property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // OPEN REJECT MODAL
  // ==========================================

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setRejectionReason("");
    setError("");
    setShowRejectModal(true);
  };

  // ==========================================
  // REJECT PROPERTY
  // ==========================================

  const handleReject = async () => {
    if (!selectedProperty) {
      return;
    }

    if (!rejectionReason.trim()) {
      setError("Please enter rejection reason.");
      return;
    }

    try {
      setActionLoading(selectedProperty.id);
      setError("");

      const updatedProperty = await rejectProperty(
        selectedProperty.id,
        rejectionReason.trim()
      );

      setProperties((prev) =>
        prev.map((property) =>
          property.id === selectedProperty.id
            ? updatedProperty
            : property
        )
      );

      setShowRejectModal(false);
      setSelectedProperty(null);
      setRejectionReason("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to reject property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATUS STYLES
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-700";

      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "DRAFT":
        return "bg-slate-100 text-slate-700";

      case "SOLD":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Properties Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review and manage all property listings.
            </p>
          </div>

          <button
            onClick={fetchProperties}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search property, city, area..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="DRAFT">
                DRAFT
              </option>

              <option value="PENDING_APPROVAL">
                PENDING APPROVAL
              </option>

              <option value="PUBLISHED">
                PUBLISHED
              </option>

              <option value="REJECTED">
                REJECTED
              </option>

              <option value="SOLD">
                SOLD
              </option>
            </select>
          </div>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Total Properties
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {properties.length}
                </p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-yellow-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Pending Approval
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {
                    properties.filter(
                      (property) =>
                        property.status ===
                        "PENDING_APPROVAL"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Published
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {
                    properties.filter(
                      (property) =>
                        property.status === "PUBLISHED"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {
                    properties.filter(
                      (property) =>
                        property.status === "REJECTED"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading properties...
              </p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          /* ==========================================
             EMPTY
          ========================================== */

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No properties found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No properties match your search or status
              filter.
            </p>
          </div>
        ) : (
          /* ==========================================
             PROPERTY GRID
          ========================================== */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >

                {/* Image */}
                <div className="h-52 bg-slate-100">
                  {property.images?.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title || "Property"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2
                        size={42}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">

                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-slate-900">
                        {property.title ||
                          "Untitled Property"}
                      </h2>

                      <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin size={15} />

                        <span className="truncate">
                          {property.areaName ||
                            "Unknown Area"}
                          ,{" "}
                          {property.city ||
                            "Unknown City"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        property.status
                      )}`}
                    >
                      {property.status?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex items-center gap-1 text-lg font-bold text-slate-900">
                    <IndianRupee size={18} />

                    <span>
                      {formatPrice(property.price).replace(
                        "₹",
                        ""
                      )}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        BHK
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {property.bhk || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Area
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {property.area
                          ? `${property.area} sq.ft`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Type
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {property.propertyType || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">
                        Property ID
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        #{property.id}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {property.description && (
                    <p className="mt-4 line-clamp-2 text-sm text-slate-500">
                      {property.description}
                    </p>
                  )}

                  {/* =====================================
                      ACTIONS
                  ===================================== */}

                  <div className="mt-5">

                    {property.status ===
                      "PENDING_APPROVAL" && (
                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            handleApprove(property.id)
                          }
                          disabled={
                            actionLoading === property.id
                          }
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle size={17} />

                          {actionLoading === property.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          onClick={() =>
                            openRejectModal(property)
                          }
                          disabled={
                            actionLoading === property.id
                          }
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Reject
                        </button>
                      </div>
                    )}

                    {property.status === "PUBLISHED" && (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                        <CheckCircle size={17} />
                        Property is live
                      </div>
                    )}

                    {property.status === "REJECTED" && (
                      <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        <p className="font-semibold">
                          Property rejected
                        </p>

                        {property.rejectionReason && (
                          <p className="mt-1">
                            Reason:{" "}
                            {property.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {property.status === "DRAFT" && (
                      <div className="rounded-xl bg-slate-50 p-3 text-center text-sm font-medium text-slate-500">
                        Draft property
                      </div>
                    )}

                    {property.status === "SOLD" && (
                      <div className="rounded-xl bg-purple-50 p-3 text-center text-sm font-semibold text-purple-700">
                        Property sold
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          REJECT MODAL
      ========================================== */}

      {showRejectModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-slate-900">
              Reject Property
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter the reason for rejecting this property.
            </p>

            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">
                {selectedProperty.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Property ID: #{selectedProperty.id}
              </p>
            </div>

            <textarea
              rows="4"
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(e.target.value)
              }
              placeholder="Enter rejection reason..."
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
            />

            <div className="mt-5 flex gap-3">

              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedProperty(null);
                  setRejectionReason("");
                  setError("");
                }}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={
                  actionLoading === selectedProperty.id
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === selectedProperty.id
                  ? "Rejecting..."
                  : "Reject Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertiesManagement;