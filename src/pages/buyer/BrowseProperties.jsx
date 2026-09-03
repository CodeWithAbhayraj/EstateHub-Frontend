import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

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
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    cityId: "",
    areaId: "",
    propertyTypeId: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPublishedProperties();

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Property loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await getMyFavorites();

      if (Array.isArray(data)) {
        setFavoriteIds(
          data.map((favorite) => favorite.propertyId)
        );
      }
    } catch (err) {
      // Guest users or backend authorization failure
      // should not stop property listing.
      console.log("Favorites not loaded:", err);
    }
  };

  const handleFavorite = async (propertyId) => {
    try {
      if (favoriteIds.includes(propertyId)) {
        await removeFavorite(propertyId);

        setFavoriteIds((prev) =>
          prev.filter((id) => id !== propertyId)
        );
      } else {
        await addFavorite(propertyId);

        setFavoriteIds((prev) => [
          ...prev,
          propertyId,
        ]);
      }
    } catch (err) {
      console.error("Favorite error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search
      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        property.title?.toLowerCase().includes(search) ||
        property.cityName?.toLowerCase().includes(search) ||
        property.areaName?.toLowerCase().includes(search) ||
        property.propertyTypeName
          ?.toLowerCase()
          .includes(search);

      // City
      const matchesCity =
        !filters.cityId ||
        String(property.cityId) === String(filters.cityId);

      // Area
      const matchesArea =
        !filters.areaId ||
        String(property.areaId) === String(filters.areaId);

      // Property Type
      const matchesPropertyType =
        !filters.propertyTypeId ||
        String(property.propertyTypeId) ===
          String(filters.propertyTypeId);

      return (
        matchesSearch &&
        matchesCity &&
        matchesArea &&
        matchesPropertyType
      );
    });
  }, [properties, searchText, filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Search size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Browse Properties
              </h1>

              <p className="mt-1 text-slate-500">
                Find your perfect property on EstateHub.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <PropertySearch
              value={searchText}
              onChange={setSearchText}
              onSearch={(value) => setSearchText(value)}
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter */}
          <aside>
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <SlidersHorizontal size={20} />
              <h2 className="font-bold text-slate-900">
                Filters
              </h2>
            </div>

            <PropertyFilter
              onFilterChange={setFilters}
            />
          </aside>

          {/* Properties */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Available Properties
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Loading..."
                    : `${filteredProperties.length} properties found`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading properties...
                  </p>
                </div>
              </div>
            ) : (
              <PropertyGrid
                properties={filteredProperties}
                favoriteIds={favoriteIds}
                onFavorite={handleFavorite}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default BrowseProperties;