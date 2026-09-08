import { Link } from "react-router-dom";
import { Heart, MapPin, BedDouble, Ruler, Building2 } from "lucide-react";

function PropertyCard({ property, isFavorite = false, onFavorite }) {
  if (!property) return null;

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "Price on request";
    }
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const formatStatus = (status) =>
    status ? String(status).replaceAll("_", " ") : "";

  const imageUrl = property.images?.length > 0 ? property.images[0] : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title || "Property"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Building2 size={28} />
            <span className="mt-2 text-xs font-medium">No image</span>
          </div>
        )}

        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(property.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}
            />
          </button>
        )}

        {property.status && (
          <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
            {formatStatus(property.status)}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
          {property.title || "Untitled Property"}
        </h2>

        <p className="text-lg font-bold text-blue-600 sm:text-xl">
          {formatPrice(property.price)}
        </p>

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="shrink-0 text-slate-400" />
          <span className="line-clamp-1">
            {property.areaName || "Unknown Area"}, {property.city || "Unknown City"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {property.bhk != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={15} className="text-slate-400" />
              {property.bhk} BHK
            </span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1">
              <Ruler size={15} className="text-slate-400" />
              {property.area} sq.ft
            </span>
          )}
          {property.propertyType && (
            <span className="rounded bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
              {property.propertyType}
            </span>
          )}
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white active:scale-[0.98]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default PropertyCard;