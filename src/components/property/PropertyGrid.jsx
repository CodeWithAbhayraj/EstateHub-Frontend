import { Building2 } from "lucide-react";
import PropertyCard from "./PropertyCard";
import EmptyState from "../common/EmptyState";

function PropertyGrid({ properties = [], favoriteIds = [], onFavorite }) {
  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties found"
        message="We couldn't find any properties matching your current search or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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