import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

import { getPublishedProperties } from "../../api/propertyApi";

import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../../api/favoriteApi";

import PropertySearch from "../../components/property/PropertySearch";
import PropertyFilter from "../../components/property/PropertyFilter";
import PropertyGrid from "../../components/property/PropertyGrid";

function BrowseProperties() {
  const [properties, setProperties] =
    useState([]);

  const [favoriteIds, setFavoriteIds] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [filters, setFilters] = useState({
    cityId: "",
    areaId: "",
    propertyTypeId: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  // ==========================================
  // AUTH / ROLE
  // ==========================================

  const token =
    localStorage.getItem("token");

  const savedUser =
    localStorage.getItem("user");

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

  const role = user?.role
    ?.replace("ROLE_", "")
    ?.trim()
    ?.toUpperCase();

  const isBuyer =
    role === "BUYER";

  // ==========================================
  // LOAD PROPERTIES
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
        await getPublishedProperties();

      setProperties(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Property loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // LOAD FAVORITES
  // ==========================================

  const loadFavorites = async () => {
    if (!isBuyer) {
      setFavoriteIds([]);
      return;
    }

    try {
      const data =
        await getMyFavorites();

      if (Array.isArray(data)) {
        setFavoriteIds(
          data.map(
            (favorite) =>
              favorite.propertyId
          )
        );
      } else {
        setFavoriteIds([]);
      }
    } catch (err) {
      console.error(
        "Favorites loading error:",
        err
      );

      // Do not break property listing
      setFavoriteIds([]);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProperties();

    if (isBuyer) {
      loadFavorites();
    } else {
      setFavoriteIds([]);
    }
  }, [isBuyer]);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await Promise.all([
      loadProperties(false),
      isBuyer
        ? loadFavorites()
        : Promise.resolve(),
    ]);
  };

  // ==========================================
  // FAVORITE TOGGLE
  // ==========================================

  const handleFavorite = async (
    propertyId
  ) => {
    if (!isBuyer) {
      return;
    }

    try {
      setError("");

      const isCurrentlyFavorite =
        favoriteIds.includes(
          propertyId
        );

      if (isCurrentlyFavorite) {
        await removeFavorite(
          propertyId
        );

        setFavoriteIds((prev) =>
          prev.filter(
            (id) =>
              String(id) !==
              String(propertyId)
          )
        );
      } else {
        await addFavorite(
          propertyId
        );

        setFavoriteIds((prev) => [
          ...prev,
          propertyId,
        ]);
      }
    } catch (err) {
      console.error(
        "Favorite error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    }
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredProperties = useMemo(() => {
    const search =
      searchText
        .trim()
        .toLowerCase();

    return properties.filter(
      (property) => {
        // Search
        const matchesSearch =
          !search ||
          String(
            property.title || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            property.city || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            property.areaName || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            property.propertyType || ""
          )
            .toLowerCase()
            .includes(search);

        // City
        const matchesCity =
          !filters.cityId ||
          String(
            property.cityId
          ) ===
            String(
              filters.cityId
            );

        // Area
        const matchesArea =
          !filters.areaId ||
          String(
            property.areaId
          ) ===
            String(
              filters.areaId
            );

        // Property Type
        const matchesPropertyType =
          !filters.propertyTypeId ||
          String(
            property.propertyTypeId
          ) ===
            String(
              filters.propertyTypeId
            );

        return (
          matchesSearch &&
          matchesCity &&
          matchesArea &&
          matchesPropertyType
        );
      }
    );
  }, [
    properties,
    searchText,
    filters,
  ]);

  // ==========================================
  // ACTIVE FILTER COUNT
  // ==========================================

  const activeFilterCount = [
    filters.cityId,
    filters.areaId,
    filters.propertyTypeId,
  ].filter(Boolean).length;

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="w-full">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-40 w-40 rounded-full bg-slate-50 blur-3xl" />

          <div className="relative">

            {/* HEADER */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex min-w-0 items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Search size={21} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                    EstateHub
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Browse Properties
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                    Find a property that fits your needs.
                  </p>

                </div>

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={handleRefresh}
                disabled={
                  loading || refreshing
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
                  hover:text-slate-900

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


            {/* SEARCH */}

            <div className="mt-6">

              <PropertySearch
                value={searchText}
                onChange={setSearchText}
                onSearch={setSearchText}
              />

            </div>


            {/* SEARCH META */}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400 sm:text-sm">

              <span>
                {loading
                  ? "Loading properties..."
                  : `${filteredProperties.length} ${
                      filteredProperties.length ===
                      1
                        ? "property"
                        : "properties"
                    } found`}
              </span>

              {activeFilterCount >
                0 && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  {activeFilterCount} filter
                  {activeFilterCount > 1
                    ? "s"
                    : ""}{" "}
                  active
                </span>
              )}

              {searchText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}

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
          CONTENT
      ========================================== */}

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

        {/* ========================================
            FILTER
        ======================================== */}

        <aside className="min-w-0">

          {/* MOBILE FILTER LABEL */}

          <div className="mb-3 flex items-center justify-between lg:hidden">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <SlidersHorizontal
                  size={17}
                  className="text-slate-600"
                />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  Filters
                </h2>

                <p className="text-xs text-slate-400">
                  Refine your search
                </p>

              </div>

            </div>

            {activeFilterCount >
              0 && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                {activeFilterCount}
              </span>
            )}

          </div>

          <PropertyFilter
            onFilterChange={
              setFilters
            }
          />

        </aside>


        {/* ========================================
            PROPERTY RESULTS
        ======================================== */}

        <section className="min-w-0">

          {/* RESULTS HEADER */}

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Properties
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Available Properties
              </h2>

            </div>

            {!loading && (
              <p className="text-sm text-slate-500">
                {filteredProperties.length}{" "}
                {filteredProperties.length ===
                1
                  ? "result"
                  : "results"}
              </p>
            )}

          </div>


          {/* ======================================
              LOADING
          ====================================== */}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm sm:p-14">

              <div className="flex flex-col items-center justify-center text-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
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
          ) : (

            <PropertyGrid
              properties={
                filteredProperties
              }
              favoriteIds={
                favoriteIds
              }
              onFavorite={
                isBuyer
                  ? handleFavorite
                  : undefined
              }
            />

          )}

        </section>

      </div>

    </div>
  );
}

export default BrowseProperties;