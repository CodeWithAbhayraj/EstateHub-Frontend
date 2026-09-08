import { useEffect, useState } from "react";
import { getCities, getAreasByCity, getPropertyTypesByArea } from "../../api/locationApi";
import Select from "../common/Select";
import Button from "../common/Button";

function PropertyFilter({ onFilterChange }) {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      setError("");
      const data = await getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cities:", err);
      setError("Unable to load cities.");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedArea("");
    setSelectedPropertyType("");
    setAreas([]);
    setPropertyTypes([]);
    setError("");

    if (!cityId) {
      onFilterChange?.({ cityId: "", areaId: "", propertyTypeId: "" });
      return;
    }

    try {
      setLoadingAreas(true);
      const data = await getAreasByCity(cityId);
      setAreas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load areas:", err);
      setError("Unable to load areas.");
    } finally {
      setLoadingAreas(false);
    }

    onFilterChange?.({ cityId, areaId: "", propertyTypeId: "" });
  };

  const handleAreaChange = async (areaId) => {
    setSelectedArea(areaId);
    setSelectedPropertyType("");
    setPropertyTypes([]);
    setError("");

    if (!areaId) {
      onFilterChange?.({ cityId: selectedCity, areaId: "", propertyTypeId: "" });
      return;
    }

    try {
      setLoadingPropertyTypes(true);
      const data = await getPropertyTypesByArea(areaId);
      setPropertyTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load property types:", err);
      setError("Unable to load property types.");
    } finally {
      setLoadingPropertyTypes(false);
    }

    onFilterChange?.({ cityId: selectedCity, areaId, propertyTypeId: "" });
  };

  const handlePropertyTypeChange = (propertyTypeId) => {
    setSelectedPropertyType(propertyTypeId);
    setError("");
    onFilterChange?.({ cityId: selectedCity, areaId: selectedArea, propertyTypeId });
  };

  const handleClear = () => {
    setSelectedCity("");
    setSelectedArea("");
    setSelectedPropertyType("");
    setAreas([]);
    setPropertyTypes([]);
    setError("");
    onFilterChange?.({ cityId: "", areaId: "", propertyTypeId: "" });
  };

  const activeFilterCount = [selectedCity, selectedArea, selectedPropertyType].filter(Boolean).length;

  return (
    <div className="surface p-4 sm:p-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>
          <p className="mt-0.5 text-sm text-slate-500">Narrow down your property search.</p>
        </div>

        {activeFilterCount > 0 && (
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            {activeFilterCount} active
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="mt-4 space-y-4">
        <Select
          label="City"
          name="property-filter-city"
          value={selectedCity}
          onChange={(event) => handleCityChange(event.target.value)}
          disabled={loadingCities}
          placeholder={loadingCities ? "Loading cities..." : "All Cities"}
          options={cities.map((city) => ({ value: city.id, label: city.name }))}
        />

        <Select
          label="Area"
          name="property-filter-area"
          value={selectedArea}
          onChange={(event) => handleAreaChange(event.target.value)}
          disabled={!selectedCity || loadingAreas}
          placeholder={!selectedCity ? "Select city first" : loadingAreas ? "Loading areas..." : "All Areas"}
          options={areas.map((area) => ({ value: area.id, label: area.name }))}
        />

        <Select
          label="Property Type"
          name="property-filter-type"
          value={selectedPropertyType}
          onChange={(event) => handlePropertyTypeChange(event.target.value)}
          disabled={!selectedArea || loadingPropertyTypes}
          placeholder={
            !selectedArea ? "Select area first" : loadingPropertyTypes ? "Loading property types..." : "All Property Types"
          }
          options={propertyTypes.map((type) => ({ value: type.id, label: type.name }))}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleClear}
        disabled={activeFilterCount === 0}
        className="mt-5 w-full"
      >
        Clear Filters
      </Button>
    </div>
  );
}

export default PropertyFilter;