import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { getPublishedProperties } from "../../api/propertyApi";
import { addFavorite, getMyFavorites, removeFavorite } from "../../api/favoriteApi";
import PropertySearch from "../../components/property/PropertySearch";
import PropertyFilter from "../../components/property/PropertyFilter";
import PropertyGrid from "../../components/property/PropertyGrid";

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ cityId: "", areaId: "", propertyTypeId: "" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  let user = null;
  try { user = savedUser ? JSON.parse(savedUser) : null; } catch {}
  const role = user?.role?.replace("ROLE_", "")?.trim()?.toUpperCase();
  const isBuyer = role === "BUYER";

  const loadProperties = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getPublishedProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load properties.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    if (!isBuyer) { setFavoriteIds([]); return; }
    try {
      const data = await getMyFavorites();
      setFavoriteIds(Array.isArray(data) ? data.map(f => f.propertyId) : []);
    } catch {
      setFavoriteIds([]);
    }
  };

  useEffect(() => {
    loadProperties();
    if (isBuyer) loadFavorites();
    else setFavoriteIds([]);
  }, [isBuyer]);

  const handleRefresh = async () => {
    await Promise.all([loadProperties(false), isBuyer ? loadFavorites() : Promise.resolve()]);
  };

  const handleFavorite = async (propertyId) => {
    if (!isBuyer) return;
    try {
      setError("");
      const isFav = favoriteIds.includes(propertyId);
      if (isFav) {
        await removeFavorite(propertyId);
        setFavoriteIds(prev => prev.filter(id => String(id) !== String(propertyId)));
      } else {
        await addFavorite(propertyId);
        setFavoriteIds(prev => [...prev, propertyId]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update favorite.");
    }
  };

  const filteredProperties = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    return properties.filter(p => {
      const matchSearch = !search ||
        p.title?.toLowerCase().includes(search) ||
        p.city?.toLowerCase().includes(search) ||
        p.areaName?.toLowerCase().includes(search) ||
        p.propertyType?.toLowerCase().includes(search);
      const matchCity = !filters.cityId || String(p.cityId) === String(filters.cityId);
      const matchArea = !filters.areaId || String(p.areaId) === String(filters.areaId);
      const matchType = !filters.propertyTypeId || String(p.propertyTypeId) === String(filters.propertyTypeId);
      return matchSearch && matchCity && matchArea && matchType;
    });
  }, [properties, searchText, filters]);

  const activeFilterCount = [filters.cityId, filters.areaId, filters.propertyTypeId].filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Search size={22} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Browse Properties</h1>
            <p className="text-sm text-slate-500">Find a property that fits your needs.</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <PropertySearch value={searchText} onChange={setSearchText} onSearch={setSearchText} />
      </div>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{loading ? "Loading..." : `${filteredProperties.length} properties found`}</span>
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
          </span>
        )}
        {searchText && (
          <button onClick={() => setSearchText("")} className="text-blue-600 hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <PropertyFilter onFilterChange={setFilters} />
        </aside>
        <section>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-white p-6">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
                <p className="mt-3 text-sm text-slate-500">Loading properties...</p>
              </div>
            </div>
          ) : (
            <PropertyGrid
              properties={filteredProperties}
              favoriteIds={favoriteIds}
              onFavorite={isBuyer ? handleFavorite : undefined}
            />
          )}
        </section>
      </div>
    </div>
  );
}