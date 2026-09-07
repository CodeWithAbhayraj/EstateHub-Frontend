import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CalendarDays,
  Clock,
  MapPin,
  Eye,
  RefreshCw,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { getMyVisits } from "../../api/visitApi";

function MyVisits() {
  const [visits, setVisits] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD VISITS
  // ==========================================

  const loadVisits = async (
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
        await getMyVisits();

      setVisits(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Visits error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your visits."
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
    loadVisits();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadVisits(false);
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    const normalized =
      String(status || "")
        .toUpperCase();

    switch (normalized) {
      case "CONFIRMED":
      case "APPROVED":
        return "bg-green-50 text-green-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "COMPLETED":
        return "bg-blue-50 text-blue-700";

      case "CANCELLED":
      case "REJECTED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full">
        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading visits...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Decoration */}

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
                  Buyer
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  My Visits
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage your scheduled property visits.
                </p>

              </div>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
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
          VISIT COUNT
      ========================================== */}

      {visits.length > 0 && (
        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Scheduled Visits
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {visits.length}{" "}
            {visits.length === 1
              ? "visit"
              : "visits"}
          </p>

        </div>
      )}


      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {visits.length === 0 ? (

        <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">

              <CalendarDays
                size={30}
                className="text-emerald-500"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No visits scheduled
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You don't have any property visits yet.
              Find a property and schedule a visit.
            </p>

            <Link
              to="/properties"
              className="
                mt-6
                inline-flex
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
              "
            >
              Find a Property
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      ) : (

        /* ==========================================
           VISITS
        ========================================== */

        <div className="space-y-4">

          {visits.map((visit) => (

            <article
              key={visit.id}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200

                hover:border-slate-300
                hover:shadow-md

                sm:p-6
              "
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* ==================================
                    VISIT INFO
                ================================== */}

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <CalendarDays
                        size={18}
                        className="text-slate-600"
                      />
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Property Visit
                      </p>

                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                        Visit #{visit.id}
                      </h2>

                    </div>

                    {visit.status && (
                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wide
                          ${getStatusClass(
                            visit.status
                          )}
                        `}
                      >
                        {String(
                          visit.status
                        ).replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    {/* DATE */}

                    <div className="rounded-xl bg-slate-50 p-3.5">

                      <div className="flex items-center gap-2">

                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Date
                        </p>

                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {visit.visitDate ||
                          "Date not available"}
                      </p>

                    </div>


                    {/* TIME */}

                    <div className="rounded-xl bg-slate-50 p-3.5">

                      <div className="flex items-center gap-2">

                        <Clock
                          size={16}
                          className="text-slate-400"
                        />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Time
                        </p>

                      </div>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {visit.visitTime ||
                          "Time not available"}
                      </p>

                    </div>


                    {/* PROPERTY */}

                    {visit.propertyId && (
                      <div className="rounded-xl bg-slate-50 p-3.5 sm:col-span-2">

                        <div className="flex items-center gap-2">

                          <MapPin
                            size={16}
                            className="text-slate-400"
                          />

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Property
                          </p>

                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          Property #
                          {visit.propertyId}
                        </p>

                      </div>
                    )}

                  </div>


                  {/* REMARKS */}

                  {visit.remarks && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Remarks
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        {visit.remarks}
                      </p>

                    </div>
                  )}


                  {/* COMPLETED INFO */}

                  {String(
                    visit.status || ""
                  ).toUpperCase() ===
                    "COMPLETED" && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">

                      <CheckCircle
                        size={15}
                      />

                      Visit completed

                    </div>
                  )}

                </div>


                {/* ==================================
                    ACTION
                ================================== */}

                {visit.propertyId && (
                  <div className="shrink-0">

                    <Link
                      to={`/properties/${visit.propertyId}`}
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

                        sm:w-fit
                      "
                    >

                      <Eye size={17} />

                      View Property

                      <ArrowRight
                        size={15}
                      />

                    </Link>

                  </div>
                )}

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyVisits;