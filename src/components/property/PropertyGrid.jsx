import PropertyCard from "./PropertyCard";

function PropertyGrid({
  properties = [],
  favoriteIds = [],
  onFavorite,
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          No properties found
        </h2>

        <p className="mt-2 text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favoriteIds.includes(property.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}

export default PropertyGrid;