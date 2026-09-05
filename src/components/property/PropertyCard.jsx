import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  BedDouble,
  Ruler,
  Building2,
} from "lucide-react";

function PropertyCard({
  property,
  isFavorite = false,
  onFavorite,
}) {
  if (!property) return null;

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const imageUrl =
    property.images?.length > 0
      ? property.images[0]
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* IMAGE */}
      <div className="relative flex h-56 items-center justify-center bg-slate-100">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title || "Property"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Building2 size={38} />
            <span className="mt-2 text-sm">
              No Image Available
            </span>
          </div>
        )}

        {/* FAVORITE */}
        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(property.id)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
            aria-label="Toggle favorite"
          >
            <Heart
              size={20}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600"
              }
            />
          </button>
        )}

        {/* STATUS */}
        {property.status && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow">
            {String(property.status).replaceAll(
              "_",
              " "
            )}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
          {property.title || "Untitled Property"}
        </h2>

        {/* PRICE */}
        <p className="mt-2 text-xl font-bold text-blue-600">
          {formatPrice(property.price)}
        </p>

        {/* LOCATION */}
        <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
          <MapPin
            size={16}
            className="mt-0.5 shrink-0"
          />

          <span>
            {property.areaName || "Unknown Area"},{" "}
            {property.city || "Unknown City"}
          </span>
        </div>

        {/* PROPERTY DETAILS */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">

          {property.bhk !== null &&
            property.bhk !== undefined && (
              <div className="flex items-center gap-1.5">
                <BedDouble size={16} />
                <span>
                  {property.bhk} BHK
                </span>
              </div>
            )}

          {property.area !== null &&
            property.area !== undefined && (
              <div className="flex items-center gap-1.5">
                <Ruler size={16} />
                <span>
                  {property.area} sq.ft
                </span>
              </div>
            )}

          {property.propertyType && (
            <span className="rounded-lg bg-slate-50 px-2 py-1">
              {property.propertyType}
            </span>
          )}

        </div>

        {/* VIEW DETAILS */}
        <Link
          to={`/properties/${property.id}`}
          className="mt-5 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}

export default PropertyCard;