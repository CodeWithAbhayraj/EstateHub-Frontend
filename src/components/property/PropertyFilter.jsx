import { useEffect, useState } from "react";
import {
  getCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationApi";

function PropertyFilter({ onFilterChange }) {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] =
    useState("");

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedArea("");
    setSelectedPropertyType("");
    setAreas([]);
    setPropertyTypes([]);

    if (!cityId) {
      onFilterChange?.({
        cityId: "",
        areaId: "",
        propertyTypeId: "",
      });
      return;
    }

    try {
      const data = await getAreasByCity(cityId);
      setAreas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load areas:", error);
    }

    onFilterChange?.({
      cityId,
      areaId: "",
      propertyTypeId: "",
    });
  };

  const handleAreaChange = async (areaId) => {
    setSelectedArea(areaId);
    setSelectedPropertyType("");
    setPropertyTypes([]);

    if (!areaId) {
      onFilterChange?.({
        cityId: selectedCity,
        areaId: "",
        propertyTypeId: "",
      });
      return;
    }

    try {
      const data = await getPropertyTypesByArea(areaId);
      setPropertyTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load property types:",
        error
      );
    }

    onFilterChange?.({
      cityId: selectedCity,
      areaId,
      propertyTypeId: "",
    });
  };

  const handlePropertyTypeChange = (propertyTypeId) => {
    setSelectedPropertyType(propertyTypeId);

    onFilterChange?.({
      cityId: selectedCity,
      areaId: selectedArea,
      propertyTypeId,
    });
  };

  const handleClear = () => {
    setSelectedCity("");
    setSelectedArea("");
    setSelectedPropertyType("");
    setAreas([]);
    setPropertyTypes([]);

    onFilterChange?.({
      cityId: "",
      areaId: "",
      propertyTypeId: "",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">
          Filters
        </h2>

        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {/* City */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            City
          </label>

          <select
            value={selectedCity}
            onChange={(event) =>
              handleCityChange(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Cities</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Area
          </label>

          <select
            value={selectedArea}
            onChange={(event) =>
              handleAreaChange(event.target.value)
            }
            disabled={!selectedCity}
            className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none disabled:bg-slate-100"
          >
            <option value="">All Areas</option>

            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Property Type
          </label>

          <select
            value={selectedPropertyType}
            onChange={(event) =>
              handlePropertyTypeChange(event.target.value)
            }
            disabled={!selectedArea}
            className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none disabled:bg-slate-100"
          >
            <option value="">All Property Types</option>

            {propertyTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default PropertyFilter;