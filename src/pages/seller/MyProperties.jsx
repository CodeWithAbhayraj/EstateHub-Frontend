import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";

import {
  getMyProperties,
  submitPropertyForApproval,
} from "../../api/propertyApi";

function MyProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] =
    useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD MY PROPERTIES
  // ==========================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProperties();

      const propertyList = Array.isArray(data)
        ? data
        : [];

      setProperties(propertyList);
      setFilteredProperties(propertyList);
    } catch (err) {
      console.error(
        "My properties error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load your properties."
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
    const value = search
      .toLowerCase()
      .trim();

    const result = properties.filter(
      (property) => {
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
            .includes(value);

        const matchesStatus =
          statusFilter === "ALL" ||
          property.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

    setFilteredProperties(result);
  }, [
    search,
    statusFilter,
    properties,
  ]);

  // ==========================================
  // SUBMIT FOR APPROVAL
  // ==========================================

  const handleSubmitForApproval = async (
    propertyId
  ) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");

      const updatedProperty =
        await submitPropertyForApproval(
          propertyId
        );

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? updatedProperty
            : property
        )
      );

      setSuccess(
        "Property submitted for approval."
      );
    } catch (err) {
      console.error(
        "Submit property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // PRICE FORMAT
  // ==========================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================
  // STATUS STYLES
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "DRAFT":
        return {
          className:
            "bg-slate-100 text-slate-700",
          icon: <Edit size={13} />,
        };

      case "PENDING_APPROVAL":
        return {
          className:
            "bg-yellow-100 text-yellow-700",
          icon: <Clock size={13} />,
        };

      case "PUBLISHED":
        return {
          className:
            "bg-green-100 text-green-700",
          icon: <CheckCircle size={13} />,
        };

      case "REJECTED":
        return {
          className:
            "bg-red-100 text-red-700",
          icon: <XCircle size={13} />,
        };

      default:
        return {
          className:
            "bg-slate-100 text-slate-700",
          icon: null,
        };
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const total = properties.length;

  const draftCount = properties.filter(
    (property) =>
      property.status === "DRAFT"
  ).length;

  const pendingCount = properties.filter(
    (property) =>
      property.status === "PENDING_APPROVAL"
  ).length;

  const publishedCount = properties.filter(
    (property) =>
      property.status === "PUBLISHED"
  ).length;

  const rejectedCount = properties.filter(
    (property) =>
      property.status === "REJECTED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/seller/dashboard"
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <p className="text-sm font-medium text-slate-500">
                EstateHub Seller
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                My Properties
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your property listings and approval status.
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={fetchProperties}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <Link
              to="/seller/properties/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Property
            </Link>

          </div>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            SUCCESS
        ========================================== */}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Draft
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-700">
              {draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Published
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Rejected
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>

        </div>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search title, city, area..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-500"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
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
            </select>

          </div>

        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (

          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading your properties...
              </p>

            </div>

          </div>

        ) : filteredProperties.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <Building2
              size={44}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No properties found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You haven't added any property matching the current filter.
            </p>

            <Link
              to="/seller/properties/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Property
            </Link>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredProperties.map(
              (property) => {

                const status =
                  getStatusStyle(
                    property.status
                  );

                return (
                  <div
                    key={property.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* IMAGE */}

                    <div className="h-52 bg-slate-100">

                      {property.images &&
                      property.images.length > 0 ? (
                        <img
                          src={
                            property.images[0]
                          }
                          alt={
                            property.title ||
                            "Property"
                          }
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

                    {/* CONTENT */}

                    <div className="p-5">

                      {/* TITLE + STATUS */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h2 className="truncate font-bold text-slate-900">
                            {property.title ||
                              "Untitled Property"}
                          </h2>

                          <p className="mt-2 text-sm text-slate-500">
                            {property.areaName ||
                              "Unknown Area"}
                            ,{" "}
                            {property.city ||
                              "Unknown City"}
                          </p>

                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {property.status ||
                            "UNKNOWN"}
                        </span>

                      </div>

                      {/* PRICE */}

                      <p className="mt-4 text-xl font-bold text-slate-900">
                        {formatPrice(
                          property.price
                        )}
                      </p>

                      {/* DETAILS */}

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-400">
                            BHK
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.bhk ??
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-400">
                            Area
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.area
                              ? `${property.area} sq.ft`
                              : "—"}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-400">
                            Type
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                            {property.propertyType ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-400">
                            Property ID
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            #{property.id}
                          </p>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 space-y-2">

                        {/* VIEW */}

                        <Link
                          to={`/properties/${property.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye size={16} />
                          View Property
                        </Link>

                        {/* DRAFT ACTIONS */}

                        {property.status ===
                          "DRAFT" && (
                          <div className="grid grid-cols-2 gap-2">

                            <Link
                              to={`/seller/properties/${property.id}/edit`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleSubmitForApproval(
                                  property.id
                                )
                              }
                              disabled={
                                actionLoading ===
                                property.id
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                              <Send size={16} />

                              {actionLoading ===
                              property.id
                                ? "Submitting..."
                                : "Submit"}
                            </button>

                          </div>
                        )}

                        {/* REJECTED */}

                        {property.status ===
                          "REJECTED" && (
                          <Link
                            to={`/seller/properties/${property.id}/edit`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            <Edit size={16} />
                            Edit Property
                          </Link>
                        )}

                        {/* PENDING */}

                        {property.status ===
                          "PENDING_APPROVAL" && (
                          <div className="rounded-xl bg-yellow-50 p-3 text-center text-xs font-semibold text-yellow-700">
                            Waiting for admin approval
                          </div>
                        )}

                        {/* PUBLISHED */}

                        {property.status ===
                          "PUBLISHED" && (
                          <div className="rounded-xl bg-green-50 p-3 text-center text-xs font-semibold text-green-700">
                            Property is live
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
}

export default MyProperties;