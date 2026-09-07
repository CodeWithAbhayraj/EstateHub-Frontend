import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Building2,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye,
} from "lucide-react";

import { getMyProperties } from "../../api/propertyApi";

function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // SELLER NAME
  // ==========================================

  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (err) {
    console.error(
      "Invalid user data:",
      err
    );
  }

  const userName =
    user?.name ||
    localStorage.getItem("name") ||
    "Seller";

  // ==========================================
  // LOAD SELLER PROPERTIES
  // ==========================================

  const loadProperties = async (
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
        "Seller properties error:",
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
    loadProperties();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadProperties(false);
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const totalProperties =
    properties.length;

  const draftProperties =
    properties.filter(
      (property) =>
        property.status === "DRAFT"
    ).length;

  const pendingProperties =
    properties.filter(
      (property) =>
        property.status ===
        "PENDING_APPROVAL"
    ).length;

  const publishedProperties =
    properties.filter(
      (property) =>
        property.status === "PUBLISHED"
    ).length;

  const rejectedProperties =
    properties.filter(
      (property) =>
        property.status === "REJECTED"
    ).length;

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-600";

      case "PENDING_APPROVAL":
        return "bg-amber-50 text-amber-700";

      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700";

      case "REJECTED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ==========================================
  // STATUS FORMAT
  // ==========================================

  const formatStatus = (status) => {
    if (!status) {
      return "UNKNOWN";
    }

    return String(status).replaceAll(
      "_",
      " "
    );
  };

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-slate-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="min-w-0">

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                EstateHub Seller
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Welcome, {userName}!
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your properties and track their approval status.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

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
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition-all
                  duration-200

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
                  transition-all
                  duration-200

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
          OVERVIEW
      ========================================== */}

      <section className="mb-8">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Property Status
          </h2>

        </div>


        {/* ========================================
            RESPONSIVE STATS
        ======================================== */}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* TOTAL */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
                  Total Properties
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {loading
                    ? "..."
                    : totalProperties}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All your listings
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-11 sm:w-11">
                <Building2 size={20} />
              </div>

            </div>

          </div>


          {/* DRAFT */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
                  Draft
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {loading
                    ? "..."
                    : draftProperties}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Not submitted
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:h-11 sm:w-11">
                <Clock size={20} />
              </div>

            </div>

          </div>


          {/* PENDING */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 sm:text-3xl">
                  {loading
                    ? "..."
                    : pendingProperties}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Awaiting approval
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 sm:h-11 sm:w-11">
                <Clock size={20} />
              </div>

            </div>

          </div>


          {/* PUBLISHED */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
                  Published
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl">
                  {loading
                    ? "..."
                    : publishedProperties}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Live on EstateHub
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-11 sm:w-11">
                <CheckCircle size={20} />
              </div>

            </div>

          </div>


          {/* REJECTED */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-sm">
                  Rejected
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-red-600 sm:text-3xl">
                  {loading
                    ? "..."
                    : rejectedProperties}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Needs changes
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 sm:h-11 sm:w-11">
                <XCircle size={20} />
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          RECENT PROPERTIES
      ========================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              Listings
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              My Properties
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest property listings.
            </p>

          </div>

          <Link
            to="/seller/properties"
            className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:text-slate-900
            "
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>


        {/* ========================================
            LOADING
        ======================================== */}

        {loading ? (

          <div className="flex min-h-56 items-center justify-center p-6">

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

        ) : properties.length === 0 ? (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="p-8 text-center sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

              <Building2
                size={29}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No properties yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Start by adding your first property to EstateHub.
            </p>

            <Link
              to="/seller/properties/add"
              className="
                mt-6
                inline-flex
                items-center
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
              "
            >
              <Plus size={17} />
              Add Property
            </Link>

          </div>

        ) : (

          /* ======================================
             PROPERTY LIST
          ====================================== */

          <div className="divide-y divide-slate-100">

            {properties
              .slice(0, 5)
              .map((property) => (

                <div
                  key={property.id}
                  className="
                    flex
                    flex-col
                    gap-4
                    p-5
                    transition
                    hover:bg-slate-50
                    sm:p-6
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >

                  {/* PROPERTY INFO */}

                  <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:h-12 sm:w-12">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {property.title ||
                          "Untitled Property"}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                        {property.areaName ||
                          "—"}
                        {property.areaName &&
                          property.city
                          ? ", "
                          : ""}
                        {property.city ||
                          "—"}
                      </p>

                      {property.price !==
                        null &&
                        property.price !==
                          undefined && (
                          <p className="mt-1 text-xs font-semibold text-blue-600 sm:text-sm">
                            ₹
                            {Number(
                              property.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}

                    </div>

                  </div>


                  {/* STATUS + ACTION */}

                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        sm:text-xs
                        ${getStatusClass(
                          property.status
                        )}
                      `}
                    >
                      {formatStatus(
                        property.status
                      )}
                    </span>


                    <Link
                      to={`/properties/${property.id}`}
                      className="
                        inline-flex
                        min-h-9
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        sm:text-sm
                      "
                    >
                      <Eye size={15} />
                      View
                    </Link>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>


      {/* ==========================================
          SELLER FLOW
      ========================================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            How it works
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            Property Listing Process
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Follow these steps to get your property published.
          </p>

        </div>


        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {/* STEP 1 */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
              01
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Add Property
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter property information and details.
            </p>

          </div>


          {/* STEP 2 */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
              02
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Submit for Approval
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Complete the required property information and submit it.
            </p>

          </div>


          {/* STEP 3 */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
              03
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Admin Verification
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Our admin reviews your submitted property.
            </p>

          </div>


          {/* STEP 4 */}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm">
              04
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Property Goes Live
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Approved properties become visible to buyers.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SellerDashboard;