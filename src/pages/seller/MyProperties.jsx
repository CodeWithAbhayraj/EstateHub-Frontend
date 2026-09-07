import { useEffect, useMemo, useState } from "react";
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

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // LOAD PROPERTIES
  // ==========================================

  const fetchProperties = async (
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
        await getMyProperties();

      setProperties(
        Array.isArray(data)
          ? data
          : []
      );
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
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProperties();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await fetchProperties(false);
  };

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
          String(property.id) ===
          String(propertyId)
            ? updatedProperty
            : property
        )
      );

      setSuccess(
        "Property submitted for approval successfully."
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
  // SEARCH + FILTER
  // ==========================================

  const filteredProperties = useMemo(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    return properties.filter(
      (property) => {
        const matchesSearch =
          !value ||
          String(
            property.title || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            property.city || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            property.areaName || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            property.id || ""
          ).includes(value);

        const matchesStatus =
          statusFilter === "ALL" ||
          property.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    properties,
    search,
    statusFilter,
  ]);

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

    return `₹${Number(
      price
    ).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusMeta = (status) => {
    switch (status) {
      case "DRAFT":
        return {
          className:
            "bg-slate-100 text-slate-700",
          icon: Edit,
        };

      case "PENDING_APPROVAL":
        return {
          className:
            "bg-amber-50 text-amber-700",
          icon: Clock,
        };

      case "PUBLISHED":
        return {
          className:
            "bg-emerald-50 text-emerald-700",
          icon: CheckCircle,
        };

      case "REJECTED":
        return {
          className:
            "bg-red-50 text-red-700",
          icon: XCircle,
        };

      default:
        return {
          className:
            "bg-slate-100 text-slate-600",
          icon: Clock,
        };
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const total =
    properties.length;

  const draftCount =
    properties.filter(
      (property) =>
        property.status === "DRAFT"
    ).length;

  const pendingCount =
    properties.filter(
      (property) =>
        property.status ===
        "PENDING_APPROVAL"
    ).length;

  const publishedCount =
    properties.filter(
      (property) =>
        property.status ===
        "PUBLISHED"
    ).length;

  const rejectedCount =
    properties.filter(
      (property) =>
        property.status ===
        "REJECTED"
    ).length;

  const activeFilterCount =
    statusFilter !== "ALL"
      ? 1
      : 0;

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Decoration */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="flex min-w-0 items-start gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/seller/dashboard"
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  transition

                  hover:bg-slate-50
                  hover:text-slate-900

                  active:scale-95
                "
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  EstateHub Seller
                </p>

                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  My Properties
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage your listings and track approval status.
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

              <button
                type="button"
                onClick={
                  handleRefresh
                }
                disabled={
                  loading ||
                  refreshing
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition

                  hover:border-slate-300
                  hover:bg-slate-50

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:w-auto
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
                  : "Refresh"}
              </button>


              <Link
                to="/seller/properties/add"
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
                  transition

                  hover:bg-slate-800
                  hover:shadow-md

                  active:scale-[0.98]

                  sm:w-auto
                "
              >
                <Plus size={17} />
                Add Property
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium leading-5 text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium leading-5 text-green-700"
          role="status"
        >
          {success}
        </div>
      )}


      {/* ==========================================
          STATS
      ========================================== */}

      <section className="mb-6">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Property Status
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">

          {/* TOTAL */}

          <StatCard
            label="Total"
            value={
              loading
                ? "..."
                : total
            }
            description="All listings"
            icon={Building2}
            iconClass="bg-blue-50 text-blue-600"
          />


          {/* DRAFT */}

          <StatCard
            label="Draft"
            value={
              loading
                ? "..."
                : draftCount
            }
            description="Not submitted"
            icon={Edit}
            iconClass="bg-slate-100 text-slate-600"
          />


          {/* PENDING */}

          <StatCard
            label="Pending"
            value={
              loading
                ? "..."
                : pendingCount
            }
            description="Awaiting approval"
            icon={Clock}
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />


          {/* PUBLISHED */}

          <StatCard
            label="Published"
            value={
              loading
                ? "..."
                : publishedCount
            }
            description="Live on EstateHub"
            icon={CheckCircle}
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />


          {/* REJECTED */}

          <StatCard
            label="Rejected"
            value={
              loading
                ? "..."
                : rejectedCount
            }
            description="Needs changes"
            icon={XCircle}
            valueClass="text-red-600"
            iconClass="bg-red-50 text-red-600"
          />

        </div>

      </section>


      {/* ==========================================
          FILTER AREA
      ========================================== */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Search & Filter
              </p>

              <h2 className="mt-1 text-base font-bold text-slate-900">
                Find your property
              </h2>

            </div>


            {(search ||
              activeFilterCount >
                0) && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-right"
              >
                Clear filters
              </button>
            )}

          </div>


          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by title, city, area or property ID..."
                className="
                  min-h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  font-medium
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition

                  placeholder:text-slate-400

                  hover:border-slate-400

                  focus:border-slate-500
                  focus:ring-4
                  focus:ring-slate-100
                "
              />

            </div>


            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                min-h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-800
                shadow-sm
                outline-none
                transition

                hover:border-slate-400

                focus:border-slate-500
                focus:ring-4
                focus:ring-slate-100
              "
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="DRAFT">
                Draft
              </option>

              <option value="PENDING_APPROVAL">
                Pending Approval
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="REJECTED">
                Rejected
              </option>
            </select>

          </div>


          {/* RESULT COUNT */}

          {!loading && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                {filteredProperties.length}{" "}
                {filteredProperties.length ===
                1
                  ? "property"
                  : "properties"}{" "}
                found
              </span>

              {activeFilterCount >
                0 && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                  Filter active
                </span>
              )}

            </div>
          )}

        </div>

      </section>


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading ? (

        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading your properties...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredProperties.length ===
        0 ? (

        /* ========================================
           EMPTY STATE
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

              <Building2
                size={30}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No properties found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No property matches your current search or status filter.
            </p>


            {search ||
            statusFilter !==
              "ALL" ? (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/seller/properties/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />
                Add Property
              </Link>
            )}

          </div>

        </div>

      ) : (

        /* ========================================
           PROPERTY GRID
        ======================================== */

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredProperties.map(
            (property) => {

              const status =
                getStatusMeta(
                  property.status
                );

              const StatusIcon =
                status.icon;

              const imageUrl =
                Array.isArray(
                  property.images
                ) &&
                property.images
                  .length > 0
                  ? property.images[0]
                  : null;

              const isSubmitting =
                actionLoading ===
                property.id;

              return (
                <article
                  key={property.id}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-lg
                  "
                >

                  {/* ==================================
                      IMAGE
                  ================================== */}

                  <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          property.title ||
                          "Property"
                        }
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">

                          <Building2
                            size={27}
                            className="text-slate-300"
                          />

                        </div>

                        <p className="mt-3 text-xs font-medium text-slate-400">
                          No image available
                        </p>

                      </div>
                    )}


                    {/* STATUS */}

                    <div
                      className={`
                        absolute
                        left-3
                        top-3
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        shadow-sm
                        ${status.className}
                      `}
                    >
                      <StatusIcon size={13} />

                      {formatStatus(
                        property.status
                      )}
                    </div>

                  </div>


                  {/* ==================================
                      CONTENT
                  ================================== */}

                  <div className="flex flex-1 flex-col p-4 sm:p-5">

                    {/* TITLE */}

                    <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 tracking-tight text-slate-900 sm:text-lg">
                      {property.title ||
                        "Untitled Property"}
                    </h2>


                    {/* LOCATION */}

                    <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">

                      <Building2
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span className="line-clamp-2">
                        {property.areaName ||
                          "Unknown Area"}
                        {property.areaName &&
                          property.city
                          ? ", "
                          : ""}
                        {property.city ||
                          "Unknown City"}
                      </span>

                    </p>


                    {/* PRICE */}

                    <p className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                      {formatPrice(
                        property.price
                      )}
                    </p>


                    {/* PROPERTY DETAILS */}

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="BHK"
                        value={
                          property.bhk ??
                          "—"
                        }
                      />

                      <InfoBox
                        label="Area"
                        value={
                          property.area
                            ? `${property.area} sq.ft`
                            : "—"
                        }
                      />

                      <InfoBox
                        label="Type"
                        value={
                          property.propertyType ||
                          "—"
                        }
                      />

                      <InfoBox
                        label="ID"
                        value={`#${property.id}`}
                      />

                    </div>


                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="mt-auto space-y-2.5 pt-5">

                      {/* VIEW */}

                      <Link
                        to={`/properties/${property.id}`}
                        className="
                          flex
                          min-h-10
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-slate-700
                          transition

                          hover:bg-slate-50
                          hover:text-slate-900

                          active:scale-[0.98]
                        "
                      >
                        <Eye size={16} />
                        View Property
                        <ArrowRight
                          size={15}
                          className="text-slate-400"
                        />
                      </Link>


                      {/* DRAFT */}

                      {property.status ===
                        "DRAFT" && (
                        <div className="grid grid-cols-2 gap-2">

                          <Link
                            to={`/seller/properties/${property.id}/edit`}
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              bg-blue-600
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-white
                              transition

                              hover:bg-blue-700
                              active:scale-[0.98]

                              sm:text-sm
                            "
                          >
                            <Edit
                              size={15}
                            />
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
                              isSubmitting
                            }
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              bg-slate-900
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-white
                              transition

                              hover:bg-slate-800
                              active:scale-[0.98]

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              sm:text-sm
                            "
                          >

                            {isSubmitting ? (
                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Send
                                size={15}
                              />
                            )}

                            {isSubmitting
                              ? "Submitting..."
                              : "Submit"}

                          </button>

                        </div>
                      )}


                      {/* REJECTED */}

                      {property.status ===
                        "REJECTED" && (
                        <div>

                          <Link
                            to={`/seller/properties/${property.id}/edit`}
                            className="
                              flex
                              min-h-10
                              w-full
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-blue-600
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              text-white
                              transition

                              hover:bg-blue-700
                              active:scale-[0.98]
                            "
                          >
                            <Edit size={16} />
                            Edit Property
                          </Link>

                          {property.rejectionReason && (
                            <div className="mt-2 rounded-xl border border-red-100 bg-red-50 p-3">

                              <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">
                                Rejection Reason
                              </p>

                              <p className="mt-1 text-xs leading-5 text-red-700">
                                {property.rejectionReason}
                              </p>

                            </div>
                          )}

                        </div>
                      )}


                      {/* PENDING */}

                      {property.status ===
                        "PENDING_APPROVAL" && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">

                          <p className="text-xs font-semibold text-amber-700">
                            Waiting for admin approval
                          </p>

                          <p className="mt-1 text-[11px] text-amber-600">
                            Your property has been submitted for review.
                          </p>

                        </div>
                      )}


                      {/* PUBLISHED */}

                      {property.status ===
                        "PUBLISHED" && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">

                          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">

                            <CheckCircle
                              size={14}
                            />

                            Property is live

                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                </article>
              )
            }
          )}

        </div>

      )}

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
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
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>

          <p
            className={`
              mt-2
              text-2xl
              font-bold
              tracking-tight
              sm:text-3xl
              ${valueClass}
            `}
          >
            {value}
          </p>

          <p className="mt-1 line-clamp-1 text-[11px] text-slate-400 sm:text-xs">
            {description}
          </p>

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
// INFO BOX
// ==========================================

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-700 sm:text-sm">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// STATUS FORMAT
// ==========================================

function formatStatus(status) {
  if (!status) {
    return "UNKNOWN";
  }

  return String(status).replaceAll(
    "_",
    " "
  );
}

export default MyProperties;