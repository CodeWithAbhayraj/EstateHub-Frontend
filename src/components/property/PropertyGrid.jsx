import PropertyCard from "./PropertyCard";

function PropertyGrid({
  properties = [],
  favoriteIds = [],
  onFavorite,
}) {
  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <span className="text-2xl text-slate-400">
              🏠
            </span>
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No properties found
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find any properties matching your
            current search or filters.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROPERTY GRID
  // ==========================================

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favoriteIds.includes(
            property.id
          )}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}

export default PropertyGrid;