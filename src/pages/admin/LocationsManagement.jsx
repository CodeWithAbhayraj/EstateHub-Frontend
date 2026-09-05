import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  Layers3,
  RefreshCw,
  Plus,
  Search,
} from "lucide-react";

import {
  getAllCities,
  createCity,
  getAreasByCity,
  createArea,
  getPropertyTypesByArea,
  createPropertyType,
} from "../../api/locationAdminApi";

function LocationsManagement() {
  // ==========================================
  // CITY STATE
  // ==========================================

  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");

  const [cityName, setCityName] = useState("");
  const [cityLoading, setCityLoading] = useState(false);

  // ==========================================
  // AREA STATE
  // ==========================================

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");

  const [areaName, setAreaName] = useState("");
  const [areaLoading, setAreaLoading] = useState(false);

  // ==========================================
  // PROPERTY TYPE STATE
  // ==========================================

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyTypeName, setPropertyTypeName] = useState("");
  const [propertyTypeLoading, setPropertyTypeLoading] =
    useState(false);

  // ==========================================
  // COMMON STATE
  // ==========================================

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchCity, setSearchCity] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchPropertyType, setSearchPropertyType] =
    useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      setError("");

      const data = await getAllCities();

      const cityList = Array.isArray(data) ? data : [];

      setCities(cityList);

      if (
        cityList.length > 0 &&
        !cityList.some(
          (city) =>
            String(city.id) === String(selectedCityId)
        )
      ) {
        setSelectedCityId(String(cityList[0].id));
      }

      if (cityList.length === 0) {
        setSelectedCityId("");
        setAreas([]);
        setSelectedAreaId("");
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error("Cities error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load cities."
      );
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ==========================================
  // LOAD AREAS WHEN CITY CHANGES
  // ==========================================

  const fetchAreas = async (cityId) => {
    if (!cityId) {
      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingAreas(true);
      setError("");

      const data = await getAreasByCity(cityId);

      const areaList = Array.isArray(data) ? data : [];

      setAreas(areaList);

      if (areaList.length > 0) {
        setSelectedAreaId(String(areaList[0].id));
      } else {
        setSelectedAreaId("");
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error("Areas error:", err);

      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);

      setError(
        err.response?.data?.message ||
          "Failed to load areas."
      );
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    fetchAreas(selectedCityId);
  }, [selectedCityId]);

  // ==========================================
  // LOAD PROPERTY TYPES WHEN AREA CHANGES
  // ==========================================

  const fetchPropertyTypes = async (areaId) => {
    if (!areaId) {
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingPropertyTypes(true);
      setError("");

      const data = await getPropertyTypesByArea(areaId);

      const typeList = Array.isArray(data) ? data : [];

      setPropertyTypes(typeList);
    } catch (err) {
      console.error("Property types error:", err);

      setPropertyTypes([]);

      setError(
        err.response?.data?.message ||
          "Failed to load property types."
      );
    } finally {
      setLoadingPropertyTypes(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes(selectedAreaId);
  }, [selectedAreaId]);

  // ==========================================
  // CREATE CITY
  // ==========================================

  const handleCreateCity = async (e) => {
    e.preventDefault();

    if (!cityName.trim()) {
      setError("Please enter city name.");
      setSuccess("");
      return;
    }

    try {
      setCityLoading(true);
      setError("");
      setSuccess("");

      const newCity = await createCity({
        name: cityName.trim(),
      });

      setCities((prev) => [...prev, newCity]);

      setCityName("");

      setSelectedCityId(String(newCity.id));

      setSuccess("City created successfully.");
    } catch (err) {
      console.error("Create city error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create city."
      );
    } finally {
      setCityLoading(false);
    }
  };

  // ==========================================
  // CREATE AREA
  // ==========================================

  const handleCreateArea = async (e) => {
    e.preventDefault();

    if (!selectedCityId) {
      setError("Please select a city.");
      setSuccess("");
      return;
    }

    if (!areaName.trim()) {
      setError("Please enter area name.");
      setSuccess("");
      return;
    }

    try {
      setAreaLoading(true);
      setError("");
      setSuccess("");

      const newArea = await createArea(
        Number(selectedCityId),
        {
          name: areaName.trim(),
        }
      );

      setAreas((prev) => [...prev, newArea]);

      setAreaName("");

      setSelectedAreaId(String(newArea.id));

      setSuccess("Area created successfully.");
    } catch (err) {
      console.error("Create area error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create area."
      );
    } finally {
      setAreaLoading(false);
    }
  };

  // ==========================================
  // CREATE PROPERTY TYPE
  // ==========================================

  const handleCreatePropertyType = async (e) => {
    e.preventDefault();

    if (!selectedAreaId) {
      setError("Please select an area.");
      setSuccess("");
      return;
    }

    if (!propertyTypeName.trim()) {
      setError("Please enter property type name.");
      setSuccess("");
      return;
    }

    try {
      setPropertyTypeLoading(true);
      setError("");
      setSuccess("");

      const newPropertyType =
        await createPropertyType(
          Number(selectedAreaId),
          {
            name: propertyTypeName.trim(),
          }
        );

      setPropertyTypes((prev) => [
        ...prev,
        newPropertyType,
      ]);

      setPropertyTypeName("");

      setSuccess(
        "Property type created successfully."
      );
    } catch (err) {
      console.error(
        "Create property type error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create property type."
      );
    } finally {
      setPropertyTypeLoading(false);
    }
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredCities = cities.filter((city) =>
    String(city.name || "")
      .toLowerCase()
      .includes(searchCity.toLowerCase().trim())
  );

  const filteredAreas = areas.filter((area) =>
    String(area.name || "")
      .toLowerCase()
      .includes(searchArea.toLowerCase().trim())
  );

  const filteredPropertyTypes = propertyTypes.filter(
    (type) =>
      String(type.name || "")
        .toLowerCase()
        .includes(
          searchPropertyType.toLowerCase().trim()
        )
  );

  // ==========================================
  // SELECTED OBJECTS
  // ==========================================

  const selectedCity = cities.find(
    (city) =>
      String(city.id) === String(selectedCityId)
  );

  const selectedArea = areas.find(
    (area) =>
      String(area.id) === String(selectedAreaId)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Locations Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage cities, areas and property types.
            </p>
          </div>

          <button
            onClick={fetchCities}
            disabled={loadingCities}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loadingCities
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            SUCCESS
        ========================================== */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ==========================================
            MAIN GRID
        ========================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==========================================
              CITY
          ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <MapPin
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Cities
                  </h2>

                  <p className="text-xs text-slate-500">
                    {cities.length} cities
                  </p>
                </div>

              </div>

            </div>

            {/* Create City */}

            <form
              onSubmit={handleCreateCity}
              className="border-b border-slate-200 p-5"
            >

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Add City
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={cityName}
                  onChange={(e) =>
                    setCityName(e.target.value)
                  }
                  placeholder="e.g. Pune"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <button
                  type="submit"
                  disabled={cityLoading}
                  className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>

              </div>

            </form>

            {/* Search City */}

            <div className="p-5">

              <div className="relative mb-4">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) =>
                    setSearchCity(e.target.value)
                  }
                  placeholder="Search city..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
                />

              </div>

              {/* Cities */}

              {loadingCities ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  Loading cities...
                </p>

              ) : filteredCities.length === 0 ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  No cities found.
                </p>

              ) : (

                <div className="max-h-[400px] space-y-2 overflow-y-auto">

                  {filteredCities.map((city) => (

                    <button
                      key={city.id}
                      onClick={() =>
                        setSelectedCityId(
                          String(city.id)
                        )
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        String(city.id) ===
                        String(selectedCityId)
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="font-semibold text-slate-800">
                          {city.name}
                        </span>

                        <span className="text-xs text-slate-400">
                          #{city.id}
                        </span>

                      </div>

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* ==========================================
              AREA
          ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <Building2
                    size={20}
                    className="text-orange-600"
                  />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Areas
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedCity
                      ? `Inside ${selectedCity.name}`
                      : "Select a city"}
                  </p>

                </div>

              </div>

            </div>

            {/* Create Area */}

            <form
              onSubmit={handleCreateArea}
              className="border-b border-slate-200 p-5"
            >

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Add Area
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={areaName}
                  onChange={(e) =>
                    setAreaName(e.target.value)
                  }
                  disabled={!selectedCityId}
                  placeholder={
                    selectedCityId
                      ? "e.g. Baner"
                      : "Select city first"
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                />

                <button
                  type="submit"
                  disabled={
                    areaLoading ||
                    !selectedCityId
                  }
                  className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>

              </div>

            </form>

            {/* Search Area */}

            <div className="p-5">

              <div className="relative mb-4">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchArea}
                  onChange={(e) =>
                    setSearchArea(e.target.value)
                  }
                  placeholder="Search area..."
                  disabled={!selectedCityId}
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                />

              </div>

              {/* Areas */}

              {!selectedCityId ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  Select a city to view areas.
                </p>

              ) : loadingAreas ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  Loading areas...
                </p>

              ) : filteredAreas.length === 0 ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  No areas found.
                </p>

              ) : (

                <div className="max-h-[400px] space-y-2 overflow-y-auto">

                  {filteredAreas.map((area) => (

                    <button
                      key={area.id}
                      onClick={() =>
                        setSelectedAreaId(
                          String(area.id)
                        )
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        String(area.id) ===
                        String(selectedAreaId)
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="font-semibold text-slate-800">
                          {area.name}
                        </span>

                        <span className="text-xs text-slate-400">
                          #{area.id}
                        </span>

                      </div>

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* ==========================================
              PROPERTY TYPE
          ========================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <Layers3
                    size={20}
                    className="text-purple-600"
                  />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Property Types
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedArea
                      ? `Inside ${selectedArea.name}`
                      : "Select an area"}
                  </p>

                </div>

              </div>

            </div>

            {/* Create Property Type */}

            <form
              onSubmit={handleCreatePropertyType}
              className="border-b border-slate-200 p-5"
            >

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Add Property Type
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={propertyTypeName}
                  onChange={(e) =>
                    setPropertyTypeName(
                      e.target.value
                    )
                  }
                  disabled={!selectedAreaId}
                  placeholder={
                    selectedAreaId
                      ? "e.g. 2 BHK Flat"
                      : "Select area first"
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                />

                <button
                  type="submit"
                  disabled={
                    propertyTypeLoading ||
                    !selectedAreaId
                  }
                  className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>

              </div>

            </form>

            {/* Search Property Type */}

            <div className="p-5">

              <div className="relative mb-4">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchPropertyType}
                  onChange={(e) =>
                    setSearchPropertyType(
                      e.target.value
                    )
                  }
                  placeholder="Search property type..."
                  disabled={!selectedAreaId}
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                />

              </div>

              {/* Property Types */}

              {!selectedAreaId ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  Select an area to view property types.
                </p>

              ) : loadingPropertyTypes ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  Loading property types...
                </p>

              ) : filteredPropertyTypes.length === 0 ? (

                <p className="py-6 text-center text-sm text-slate-400">
                  No property types found.
                </p>

              ) : (

                <div className="max-h-[400px] space-y-2 overflow-y-auto">

                  {filteredPropertyTypes.map(
                    (type) => (

                      <div
                        key={type.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                      >

                        <span className="font-semibold text-slate-800">
                          {type.name}
                        </span>

                        <span className="text-xs text-slate-400">
                          #{type.id}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ==========================================
            HIERARCHY INFO
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-900">
                Current Selection
              </p>

              <p className="mt-1 text-sm text-slate-500">

                {selectedCity
                  ? selectedCity.name
                  : "No city selected"}

                {" → "}

                {selectedArea
                  ? selectedArea.name
                  : "No area selected"}

              </p>

            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Property types are created inside the selected area.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default LocationsManagement;