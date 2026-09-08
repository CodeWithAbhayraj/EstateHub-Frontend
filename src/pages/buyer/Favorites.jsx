import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Eye, MapPin, BedDouble, Ruler, Building2, ArrowRight, RefreshCw } from "lucide-react";
import { getMyFavorites, removeFavorite } from "../../api/favoriteApi";
import { getPropertyById } from "../../api/propertyApi";

export default function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadFavorites = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const favData = await getMyFavorites();
      if (!Array.isArray(favData)) { setProperties([]); return; }
      const props = await Promise.all(favData.map(f => getPropertyById(f.propertyId)));
      setProperties(props);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load favorites.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleRefresh = async () => loadFavorites(false);

  const handleRemove = async (propertyId) => {
    try {
      setRemovingId(propertyId);
      await removeFavorite(propertyId);
      setProperties(prev => prev.filter(p => String(p.id) !== String(propertyId)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          <p className="mt-3 text-sm text-slate-500">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Heart size={24} className="text-rose-600" fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
            <p className="text-sm text-slate-500">Properties you have saved for later.</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {properties.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center">
          <Heart size={40} className="text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">No favorite properties</h3>
          <p className="text-sm text-slate-500">Start exploring and save properties you like.</p>
          <Link to="/properties" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Browse Properties <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => {
            const image = property.images?.length > 0 ? property.images[0] : null;
            return (
              <div key={property.id} className="rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="relative h-48 bg-slate-100">
                  {image ? (
                    <img src={image} alt={property.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <Building2 size={32} />
                      <span className="mt-1 text-xs">No image</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-rose-600 shadow">
                    <Heart size={12} fill="currentColor" /> Saved
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-2 text-base font-bold text-slate-900">{property.title || "Untitled"}</h2>
                  <p className="mt-1 text-xl font-bold text-blue-600">
                    ₹{Number(property.price || 0).toLocaleString("en-IN")}
                  </p>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{property.areaName || "Unknown"}, {property.city || "Unknown"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    {property.bhk != null && (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold">
                        <BedDouble size={14} /> {property.bhk} BHK
                      </span>
                    )}
                    {property.area != null && (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold">
                        <Ruler size={14} /> {property.area} sq.ft
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/properties/${property.id}`} className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800">
                      <Eye size={16} className="inline mr-1" /> View
                    </Link>
                    <button
                      onClick={() => handleRemove(property.id)}
                      disabled={removingId === property.id}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} className="inline" />
                      {removingId === property.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}