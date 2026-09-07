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
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllPropertiesForAdmin,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

function PropertiesManagement() {
  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  // ==========================================
  // FETCH ALL PROPERTIES
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
        await getAllPropertiesForAdmin();

      setProperties(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Properties error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load properties."
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
  // SEARCH + FILTER
  // ==========================================

  const filteredProperties = useMemo(() => {
    const value =
      search.toLowerCase().trim();

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
  // APPROVE
  // ==========================================

  const handleApprove = async (
    propertyId
  ) => {
    try {
      setActionLoading(propertyId);
      setError("");
      setSuccess("");

      const updatedProperty =
        await approveProperty(
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
        "Property approved successfully."
      );
    } catch (err) {
      console.error(
        "Approve property error:",
        err
      );

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

  const openRejectModal = (
    property
  ) => {
    setSelectedProperty(
      property
    );

    setRejectionReason("");
    setError("");
    setShowRejectModal(true);
  };

  // ==========================================
  // CLOSE REJECT MODAL
  // ==========================================

  const closeRejectModal = () => {
    if (actionLoading !== null) {
      return;
    }

    setShowRejectModal(false);
    setSelectedProperty(null);
    setRejectionReason("");
  };

  // ==========================================
  // REJECT
  // ==========================================

  const handleReject = async () => {
    if (!selectedProperty) {
      return;
    }

    const reason =
      rejectionReason.trim();

    if (!reason) {
      setError(
        "Please enter a rejection reason."
      );
      return;
    }

    try {
      setActionLoading(
        selectedProperty.id
      );

      setError("");
      setSuccess("");

      const updatedProperty =
        await rejectProperty(
          selectedProperty.id,
          reason
        );

      setProperties((prev) =>
        prev.map((property) =>
          String(property.id) ===
          String(
            selectedProperty.id
          )
            ? updatedProperty
            : property
        )
      );

      setSuccess(
        "Property rejected successfully."
      );

      setShowRejectModal(false);
      setSelectedProperty(null);
      setRejectionReason("");
    } catch (err) {
      console.error(
        "Reject property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to reject property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATUS META
  // ==========================================

  const getStatusMeta = (
    status
  ) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "Draft",
          className:
            "bg-slate-100 text-slate-700",
          icon: Building2,
        };

      case "PENDING_APPROVAL":
        return {
          label: "Pending",
          className:
            "bg-amber-50 text-amber-700",
          icon: Clock3,
        };

      case "PUBLISHED":
        return {
          label: "Published",
          className:
            "bg-emerald-50 text-emerald-700",
          icon: CheckCircle,
        };

      case "REJECTED":
        return {
          label: "Rejected",
          className:
            "bg-red-50 text-red-700",
          icon: XCircle,
        };

      case "SOLD":
        return {
          label: "Sold",
          className:
            "bg-violet-50 text-violet-700",
          icon: CheckCircle,
        };

      default:
        return {
          label:
            status || "Unknown",
          className:
            "bg-slate-100 text-slate-600",
          icon: Building2,
        };
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalCount =
    properties.length;

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

  const activeFilter =
    statusFilter !== "ALL" ||
    search.trim() !== "";

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

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Properties Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Review, approve and manage all property listings.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
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

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-fit
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

          </div>

        </div>

      </section>


      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
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
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            font-medium
            leading-5
            text-emerald-700
          "
          role="status"
        >
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
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


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

          <StatCard
            label="Total"
            value={totalCount}
            description="All properties"
            icon={Building2}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            description="Need review"
            icon={Clock3}
            valueClass="text-amber-600"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Published"
            value={publishedCount}
            description="Live listings"
            icon={CheckCircle}
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Rejected"
            value={rejectedCount}
            description="Need changes"
            icon={XCircle}
            valueClass="text-red-600"
            iconClass="bg-red-50 text-red-600"
          />

        </div>

      </section>


      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Filter size={17} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Search & Filter
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  Find a property
                </p>

              </div>

            </div>


            {activeFilter && (
              <button
                type="button"
                onClick={clearFilters}
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
                placeholder="Search title, city, area or property ID..."
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

              <option value="SOLD">
                Sold
              </option>

            </select>

          </div>


          {/* RESULT */}

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

            <span>
              {loading
                ? "Loading..."
                : `${filteredProperties.length} ${
                    filteredProperties.length ===
                    1
                      ? "property"
                      : "properties"
                  } found`}
            </span>

            {statusFilter !==
              "ALL" && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                {statusFilter.replaceAll(
                  "_",
                  " "
                )}
              </span>
            )}

          </div>

        </div>

      </section>


      {/* ==========================================
          CONTENT
      ========================================== */}

      {loading ? (

        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading properties...
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
              No properties match your current search or status filter.
            </p>

            {activeFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  mt-5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition

                  hover:bg-slate-50
                "
              >
                Clear Filters
              </button>
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

              const statusMeta =
                getStatusMeta(
                  property.status
                );

              const StatusIcon =
                statusMeta.icon;

              const imageUrl =
                Array.isArray(
                  property.images
                ) &&
                property.images.length >
                  0
                  ? property.images[0]
                  : null;

              const isActionLoading =
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

                    <span
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
                        ${statusMeta.className}
                      `}
                    >
                      <StatusIcon size={13} />

                      {statusMeta.label}

                    </span>

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

                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">

                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span className="line-clamp-2 leading-5">
                        {property.areaName ||
                          "Unknown Area"}
                        {property.areaName &&
                          property.city
                          ? ", "
                          : ""}
                        {property.city ||
                          "Unknown City"}
                      </span>

                    </div>


                    {/* PRICE */}

                    <div className="mt-4 flex items-center gap-1.5">

                      <IndianRupee
                        size={18}
                        className="text-slate-500"
                      />

                      <span className="text-xl font-bold tracking-tight text-slate-900">
                        {formatPrice(
                          property.price
                        ).replace(
                          "₹",
                          ""
                        )}
                      </span>

                    </div>


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


                    {/* DESCRIPTION */}

                    {property.description && (
                      <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">
                        {property.description}
                      </p>
                    )}


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


                      {/* PENDING */}

                      {property.status ===
                        "PENDING_APPROVAL" && (
                        <div className="grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(
                                property.id
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              bg-emerald-600
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-white
                              transition

                              hover:bg-emerald-700

                              active:scale-[0.98]

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              sm:text-sm
                            "
                          >

                            {isActionLoading ? (
                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle
                                size={15}
                              />
                            )}

                            {isActionLoading
                              ? "Processing..."
                              : "Approve"}

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              openRejectModal(
                                property
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              gap-1.5
                              rounded-xl
                              bg-red-600
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-white
                              transition

                              hover:bg-red-700

                              active:scale-[0.98]

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              sm:text-sm
                            "
                          >

                            <XCircle
                              size={15}
                            />

                            Reject

                          </button>

                        </div>
                      )}


                      {/* PUBLISHED */}

                      {property.status ===
                        "PUBLISHED" && (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">

                          <CheckCircle
                            size={15}
                          />

                          Property is live

                        </div>
                      )}


                      {/* REJECTED */}

                      {property.status ===
                        "REJECTED" && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">

                          <div className="flex items-center gap-2 text-xs font-bold text-red-700">

                            <XCircle
                              size={15}
                            />

                            Property Rejected

                          </div>

                          {property.rejectionReason && (
                            <p className="mt-1.5 text-xs leading-5 text-red-600">
                              {property.rejectionReason}
                            </p>
                          )}

                        </div>
                      )}


                      {/* DRAFT */}

                      {property.status ===
                        "DRAFT" && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500">
                          Draft property
                        </div>
                      )}


                      {/* SOLD */}

                      {property.status ===
                        "SOLD" && (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs font-semibold text-violet-700">

                          <CheckCircle
                            size={15}
                          />

                          Property Sold

                        </div>
                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}


      {/* ==========================================
          REJECT MODAL
      ========================================== */}

      {showRejectModal &&
        selectedProperty && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/50
              p-4
              backdrop-blur-[2px]
            "
            onClick={closeRejectModal}
          >

            <div
              className="
                w-full
                max-w-md
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="border-b border-slate-200 p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <XCircle size={20} />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Reject Property
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Provide a clear reason for rejecting this listing.
                    </p>

                  </div>

                </div>

              </div>


              {/* MODAL BODY */}

              <div className="p-5 sm:p-6">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Property
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedProperty.title ||
                      "Untitled Property"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Property ID: #
                    {selectedProperty.id}
                  </p>

                </div>


                <label
                  htmlFor="rejection-reason"
                  className="mt-5 block text-sm font-semibold text-slate-700"
                >
                  Rejection Reason
                </label>

                <textarea
                  id="rejection-reason"
                  rows={5}
                  value={
                    rejectionReason
                  }
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value
                    )
                  }
                  placeholder="Enter the reason for rejection..."
                  className="
                    mt-2
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    leading-6
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

                <p className="mt-2 text-xs text-slate-400">
                  A rejection reason will be visible to the seller.
                </p>


                {/* MODAL ACTIONS */}

                <div className="mt-5 grid gap-2 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={
                      closeRejectModal
                    }
                    disabled={
                      actionLoading !==
                      null
                    }
                    className="
                      min-h-11
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-slate-700
                      transition

                      hover:bg-slate-50

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    disabled={
                      actionLoading ===
                      selectedProperty.id
                    }
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-600
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition

                      hover:bg-red-700

                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {actionLoading ===
                    selectedProperty.id ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />

                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={16}
                        />

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

export default PropertiesManagement;