import { useEffect, useState } from "react";
import {
  getCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationApi";

function PropertyFilter({ onFilterChange }) {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [selectedCity, setSelectedCity] =
    useState("");

  const [selectedArea, setSelectedArea] =
    useState("");

  const [selectedPropertyType, setSelectedPropertyType] =
    useState("");

  const [loadingCities, setLoadingCities] =
    useState(false);

  const [loadingAreas, setLoadingAreas] =
    useState(false);

  const [loadingPropertyTypes, setLoadingPropertyTypes] =
    useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD CITIES
  // ==========================================

  useEffect(() => {
    loadCities();
  }, []);


  const loadCities = async () => {
    try {
      setLoadingCities(true);
      setError("");

      const data = await getCities();

      setCities(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Failed to load cities:",
        err
      );

      setError(
        "Unable to load cities."
      );

    } finally {
      setLoadingCities(false);
    }
  };


  // ==========================================
  // CITY CHANGE
  // ==========================================

  const handleCityChange = async (
    cityId
  ) => {
    setSelectedCity(cityId);
    setSelectedArea("");
    setSelectedPropertyType("");

    setAreas([]);
    setPropertyTypes([]);

    setError("");

    // Reset filters
    if (!cityId) {
      onFilterChange?.({
        cityId: "",
        areaId: "",
        propertyTypeId: "",
      });

      return;
    }

    try {
      setLoadingAreas(true);

      const data =
        await getAreasByCity(cityId);

      setAreas(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Failed to load areas:",
        err
      );

      setError(
        "Unable to load areas."
      );

    } finally {
      setLoadingAreas(false);
    }

    onFilterChange?.({
      cityId,
      areaId: "",
      propertyTypeId: "",
    });
  };


  // ==========================================
  // AREA CHANGE
  // ==========================================

  const handleAreaChange = async (
    areaId
  ) => {
    setSelectedArea(areaId);
    setSelectedPropertyType("");

    setPropertyTypes([]);
    setError("");

    if (!areaId) {
      onFilterChange?.({
        cityId: selectedCity,
        areaId: "",
        propertyTypeId: "",
      });

      return;
    }

    try {
      setLoadingPropertyTypes(true);

      const data =
        await getPropertyTypesByArea(
          areaId
        );

      setPropertyTypes(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Failed to load property types:",
        err
      );

      setError(
        "Unable to load property types."
      );

    } finally {
      setLoadingPropertyTypes(false);
    }

    onFilterChange?.({
      cityId: selectedCity,
      areaId,
      propertyTypeId: "",
    });
  };


  // ==========================================
  // PROPERTY TYPE CHANGE
  // ==========================================

  const handlePropertyTypeChange = (
    propertyTypeId
  ) => {
    setSelectedPropertyType(
      propertyTypeId
    );

    setError("");

    onFilterChange?.({
      cityId: selectedCity,
      areaId: selectedArea,
      propertyTypeId,
    });
  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClear = () => {
    setSelectedCity("");
    setSelectedArea("");
    setSelectedPropertyType("");

    setAreas([]);
    setPropertyTypes([]);

    setError("");

    onFilterChange?.({
      cityId: "",
      areaId: "",
      propertyTypeId: "",
    });
  };


  // ==========================================
  // FILTER COUNT
  // ==========================================

  const activeFilterCount = [
    selectedCity,
    selectedArea,
    selectedPropertyType,
  ].filter(Boolean).length;


  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        sm:p-5
      "
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-start justify-between gap-3">

        <div>

          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Filters
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Narrow down your property search.
          </p>

        </div>


        {/* ACTIVE FILTER COUNT */}

        {activeFilterCount > 0 && (
          <span
            className="
              shrink-0
              rounded-full
              bg-blue-50
              px-2.5
              py-1
              text-[11px]
              font-bold
              text-blue-600
            "
          >
            {activeFilterCount} active
          </span>
        )}

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium leading-5 text-red-600">
          {error}
        </div>
      )}


      {/* ==========================================
          FILTERS
      ========================================== */}

      <div className="mt-5 space-y-4">

        {/* ========================================
            CITY
        ======================================== */}

        <div>

          <label
            htmlFor="property-filter-city"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            City
          </label>

          <select
            id="property-filter-city"
            value={selectedCity}
            onChange={(event) =>
              handleCityChange(
                event.target.value
              )
            }
            disabled={loadingCities}
            className="
              min-h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              font-medium
              text-slate-800
              shadow-sm
              outline-none
              transition-all
              duration-200

              hover:border-slate-400

              focus:border-slate-500
              focus:ring-4
              focus:ring-slate-100

              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-400
            "
          >
            <option value="">
              {loadingCities
                ? "Loading cities..."
                : "All Cities"}
            </option>

            {cities.map((city) => (
              <option
                key={city.id}
                value={city.id}
              >
                {city.name}
              </option>
            ))}
          </select>

        </div>


        {/* ========================================
            AREA
        ======================================== */}

        <div>

          <label
            htmlFor="property-filter-area"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Area
          </label>

          <select
            id="property-filter-area"
            value={selectedArea}
            onChange={(event) =>
              handleAreaChange(
                event.target.value
              )
            }
            disabled={
              !selectedCity ||
              loadingAreas
            }
            className="
              min-h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              font-medium
              text-slate-800
              shadow-sm
              outline-none
              transition-all
              duration-200

              hover:border-slate-400

              focus:border-slate-500
              focus:ring-4
              focus:ring-slate-100

              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-400
            "
          >
            <option value="">
              {!selectedCity
                ? "Select city first"
                : loadingAreas
                ? "Loading areas..."
                : "All Areas"}
            </option>

            {areas.map((area) => (
              <option
                key={area.id}
                value={area.id}
              >
                {area.name}
              </option>
            ))}
          </select>

        </div>


        {/* ========================================
            PROPERTY TYPE
        ======================================== */}

        <div>

          <label
            htmlFor="property-filter-type"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Property Type
          </label>

          <select
            id="property-filter-type"
            value={selectedPropertyType}
            onChange={(event) =>
              handlePropertyTypeChange(
                event.target.value
              )
            }
            disabled={
              !selectedArea ||
              loadingPropertyTypes
            }
            className="
              min-h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-sm
              font-medium
              text-slate-800
              shadow-sm
              outline-none
              transition-all
              duration-200

              hover:border-slate-400

              focus:border-slate-500
              focus:ring-4
              focus:ring-slate-100

              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-400
            "
          >
            <option value="">
              {!selectedArea
                ? "Select area first"
                : loadingPropertyTypes
                ? "Loading property types..."
                : "All Property Types"}
            </option>

            {propertyTypes.map(
              (type) => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.name}
                </option>
              )
            )}
          </select>

        </div>

      </div>


      {/* ==========================================
          CLEAR BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleClear}
        disabled={
          activeFilterCount === 0
        }
        className="
          mt-5
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-2.5
          text-sm
          font-semibold
          text-slate-600
          transition-all
          duration-200

          hover:border-slate-300
          hover:bg-slate-50
          hover:text-slate-900

          active:scale-[0.98]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Clear Filters
      </button>

    </div>
  );
}

export default PropertyFilter;