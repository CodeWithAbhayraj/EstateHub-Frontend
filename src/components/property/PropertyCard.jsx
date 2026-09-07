import { Link } from "react-router-dom";

import {
  Heart,
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  ArrowUpRight,
} from "lucide-react";

function PropertyCard({
  property,
  isFavorite = false,
  onFavorite,
}) {
  if (!property) {
    return null;
  }

  // ==========================================
  // FORMAT PRICE
  // ==========================================

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

  // ==========================================
  // PROPERTY IMAGE
  // ==========================================

  const imageUrl =
    property.images?.length > 0
      ? property.images[0]
      : null;

  // ==========================================
  // STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) {
      return "";
    }

    return String(status).replaceAll(
      "_",
      " "
    );
  };

  return (
    <article
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
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* ==========================================
          IMAGE
      ========================================== */}

      <div className="relative h-52 shrink-0 overflow-hidden bg-slate-100 sm:h-56">

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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Building2 size={28} />
            </div>

            <span className="mt-3 text-sm font-medium">
              No Image Available
            </span>
          </div>
        )}

        {/* ========================================
            IMAGE OVERLAY
        ======================================== */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


        {/* ========================================
            FAVORITE
        ======================================== */}

        {onFavorite && (
          <button
            type="button"
            onClick={() =>
              onFavorite(property.id)
            }
            className="
              absolute
              right-3
              top-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/70
              bg-white/95
              text-slate-600
              shadow-md
              backdrop-blur
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-400
            "
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              size={19}
              strokeWidth={2}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-slate-700"
              }
            />
          </button>
        )}


        {/* ========================================
            STATUS
        ======================================== */}

        {property.status && (
          <span
            className="
              absolute
              bottom-3
              left-3
              rounded-full
              border
              border-white/70
              bg-white/95
              px-3
              py-1.5
              text-[11px]
              font-bold
              uppercase
              tracking-wide
              text-slate-700
              shadow-sm
              backdrop-blur
            "
          >
            {formatStatus(property.status)}
          </span>
        )}
      </div>


      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* ========================================
            TITLE
        ======================================== */}

        <h2
          className="
            line-clamp-2
            min-h-[3rem]
            text-base
            font-bold
            leading-6
            tracking-tight
            text-slate-900
            sm:text-lg
          "
        >
          {property.title ||
            "Untitled Property"}
        </h2>


        {/* ========================================
            PRICE
        ======================================== */}

        <p className="mt-2 text-xl font-bold tracking-tight text-blue-600 sm:text-2xl">
          {formatPrice(property.price)}
        </p>


        {/* ========================================
            LOCATION
        ======================================== */}

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
              "Unknown City"}
          </span>

        </div>


        {/* ========================================
            PROPERTY DETAILS
        ======================================== */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-x-4
            gap-y-2
            border-t
            border-slate-100
            pt-4
          "
        >

          {property.bhk !== null &&
            property.bhk !== undefined && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:text-sm">

                <BedDouble
                  size={16}
                  className="text-slate-400"
                />

                <span>
                  {property.bhk} BHK
                </span>

              </div>
            )}


          {property.area !== null &&
            property.area !== undefined && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:text-sm">

                <Ruler
                  size={16}
                  className="text-slate-400"
                />

                <span>
                  {property.area} sq.ft
                </span>

              </div>
            )}


          {property.propertyType && (
            <span
              className="
                rounded-lg
                bg-slate-50
                px-2.5
                py-1
                text-xs
                font-semibold
                text-slate-600
              "
            >
              {property.propertyType}
            </span>
          )}

        </div>


        {/* ========================================
            VIEW DETAILS
        ======================================== */}

        <Link
          to={`/properties/${property.id}`}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4
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
          "
        >
          <span>
            View Details
          </span>

          <ArrowUpRight
            size={16}
            className="
              transition-transform
              duration-200
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </Link>

      </div>
    </article>
  );
}

export default PropertyCard;