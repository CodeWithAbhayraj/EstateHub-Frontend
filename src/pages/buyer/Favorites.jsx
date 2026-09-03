import { useEffect, useState } from "react";
import { Heart, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getMyFavorites,
  removeFavorite,
} from "../../api/favoriteApi";

import { getPropertyById } from "../../api/propertyApi";

function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const favoriteData = await getMyFavorites();

      if (!Array.isArray(favoriteData)) {
        setProperties([]);
        return;
      }

      const propertyData = await Promise.all(
        favoriteData.map((favorite) =>
          getPropertyById(favorite.propertyId)
        )
      );

      setProperties(propertyData);
    } catch (err) {
      console.error("Favorites error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your favorite properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      setRemovingId(propertyId);

      await removeFavorite(propertyId);

      setProperties((prev) =>
        prev.filter((property) => property.id !== propertyId)
      );
    } catch (err) {
      console.error("Remove favorite error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to remove property from favorites."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading favorites...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
              <Heart size={26} fill="currentColor" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Favorites
              </h1>

              <p className="mt-1 text-slate-500">
                Properties you have saved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Heart
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No favorite properties
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't saved any properties yet.
            </p>

            <Link
              to="/properties"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-44 items-center justify-center bg-slate-100">
                  <span className="text-slate-400">
                    Property Image
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {property.title}
                  </h2>

                  <p className="mt-2 text-xl font-bold text-blue-600">
                    ₹
                    {Number(
                      property.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-slate-500">
                    <p>
                      Area: {property.area} sq.ft
                    </p>

                    <p>
                      BHK: {property.bhk}
                    </p>

                    <p>
                      City: {property.cityName}
                    </p>

                    <p>
                      Area: {property.areaName}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      to={`/properties/${property.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                      <Eye size={17} />
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFavorite(property.id)
                      }
                      disabled={
                        removingId === property.id
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={17} />

                      {removingId === property.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Favorites;