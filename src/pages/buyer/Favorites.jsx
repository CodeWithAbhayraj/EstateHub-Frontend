import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Heart,
  Trash2,
  Eye,
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import {
  getMyFavorites,
  removeFavorite,
} from "../../api/favoriteApi";

import { getPropertyById } from "../../api/propertyApi";

function Favorites() {
  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [removingId, setRemovingId] =
    useState(null);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD FAVORITES
  // ==========================================

  const loadFavorites = async (
    showFullLoader = true
  ) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const favoriteData =
        await getMyFavorites();

      if (!Array.isArray(favoriteData)) {
        setProperties([]);
        return;
      }

      const propertyData =
        await Promise.all(
          favoriteData.map(
            (favorite) =>
              getPropertyById(
                favorite.propertyId
              )
          )
        );

      setProperties(propertyData);

    } catch (err) {
      console.error(
        "Favorites error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your favorite properties."
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
    loadFavorites();
  }, []);


  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await loadFavorites(false);
  };


  // ==========================================
  // REMOVE FAVORITE
  // ==========================================

  const handleRemoveFavorite = async (
    propertyId
  ) => {
    try {
      setRemovingId(propertyId);
      setError("");

      await removeFavorite(
        propertyId
      );

      setProperties((prev) =>
        prev.filter(
          (property) =>
            String(property.id) !==
            String(propertyId)
        )
      );

    } catch (err) {
      console.error(
        "Remove favorite error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to remove property from favorites."
      );

    } finally {
      setRemovingId(null);
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
              Loading your favorites...
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

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-rose-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">

                <Heart
                  size={21}
                  fill="currentColor"
                />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-500">
                  Buyer
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  My Favorites
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Properties you have saved for later.
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
          COUNT
      ========================================== */}

      {properties.length > 0 && (
        <div className="mb-5 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              Saved Properties
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {properties.length}{" "}
              {properties.length === 1
                ? "property"
                : "properties"}
            </p>

          </div>

        </div>
      )}


      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {properties.length === 0 ? (

        <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">

              <Heart
                size={30}
                className="text-rose-400"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No favorite properties
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You haven't saved any properties yet.
              Start exploring and save the ones you like.
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
              Browse Properties
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      ) : (

        /* ==========================================
           PROPERTY GRID
        ========================================== */

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {properties.map(
            (property) => {

              const imageUrl =
                property.images?.length > 0
                  ? property.images[0]
                  : null;

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
                    duration-200

                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-lg
                  "
                >

                  {/* IMAGE */}

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
                      <div className="flex h-full flex-col items-center justify-center text-slate-400">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">

                          <Building2 size={24} />

                        </div>

                        <span className="mt-2 text-xs font-medium">
                          No image available
                        </span>

                      </div>
                    )}


                    {/* FAVORITE BADGE */}

                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm backdrop-blur">

                      <Heart
                        size={13}
                        fill="currentColor"
                      />

                      Saved

                    </div>

                  </div>


                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col p-4 sm:p-5">

                    {/* TITLE */}

                    <h2 className="line-clamp-2 text-base font-bold leading-6 tracking-tight text-slate-900 sm:text-lg">
                      {property.title ||
                        "Untitled Property"}
                    </h2>


                    {/* PRICE */}

                    <p className="mt-2 text-xl font-bold tracking-tight text-blue-600">
                      ₹
                      {Number(
                        property.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>


                    {/* LOCATION */}

                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">

                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span className="line-clamp-2 leading-5">
                        {property.areaName ||
                          "Unknown Area"}
                        ,{" "}
                        {property.city ||
                          property.cityName ||
                          "Unknown City"}
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">

                      {property.bhk !==
                        null &&
                        property.bhk !==
                          undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">

                            <BedDouble
                              size={14}
                              className="text-slate-400"
                            />

                            {property.bhk} BHK

                          </span>
                        )}


                      {property.area !==
                        null &&
                        property.area !==
                          undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">

                            <Ruler
                              size={14}
                              className="text-slate-400"
                            />

                            {property.area} sq.ft

                          </span>
                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-auto flex gap-2 pt-5">

                      <Link
                        to={`/properties/${property.id}`}
                        className="
                          inline-flex
                          min-h-10
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-slate-900
                          px-3
                          py-2.5
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-slate-800
                          active:scale-[0.98]
                        "
                      >

                        <Eye size={16} />

                        View

                      </Link>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFavorite(
                            property.id
                          )
                        }
                        disabled={
                          removingId ===
                          property.id
                        }
                        className="
                          inline-flex
                          min-h-10
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          bg-white
                          px-3
                          py-2.5
                          text-sm
                          font-semibold
                          text-red-600
                          transition

                          hover:bg-red-50

                          active:scale-[0.98]

                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        <Trash2 size={16} />

                        <span className="hidden sm:inline">
                          {removingId ===
                          property.id
                            ? "Removing..."
                            : "Remove"}
                        </span>

                      </button>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}

export default Favorites;