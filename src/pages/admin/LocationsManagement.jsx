import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Building2,
  Layers3,
  RefreshCw,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import {
  getAllCities,
  createCity,
  getAreasByCity,
  createArea,
  getPropertyTypesByArea,
  createPropertyType,
} from "../../api/locationAdminApi";

// ==========================================
// MAIN COMPONENT
// ==========================================

function LocationsManagement() {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityLoading, setCityLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [areaLoading, setAreaLoading] = useState(false);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyTypeName, setPropertyTypeName] = useState("");
  const [propertyTypeLoading, setPropertyTypeLoading] = useState(false);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchCity, setSearchCity] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  const fetchCities = async (showFullLoader = true) => {
    try {
      showFullLoader ? setLoadingCities(true) : setRefreshing(true);
      setError("");

      const data = await getAllCities();
      const cityList = Array.isArray(data) ? data : [];
      setCities(cityList);

      if (cityList.length === 0) {
        setSelectedCityId("");
        setSelectedAreaId("");
        setAreas([]);
        setPropertyTypes([]);
        return;
      }

      const currentCityExists = cityList.some((city) => String(city.id) === String(selectedCityId));
      if (!currentCityExists) {
        setSelectedCityId(String(cityList[0].id));
      }
    } catch (err) {
      console.error("Cities error:", err);
      setError(err.response?.data?.message || "Failed to load cities.");
    } finally {
      setLoadingCities(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ==========================================
  // LOAD AREAS
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
        const existingArea = areaList.find((area) => String(area.id) === String(selectedAreaId));
        if (!existingArea) setSelectedAreaId(String(areaList[0].id));
      } else {
        setSelectedAreaId("");
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error("Areas error:", err);
      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);
      setError(err.response?.data?.message || "Failed to load areas.");
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    fetchAreas(selectedCityId);
  }, [selectedCityId]);

  // ==========================================
  // LOAD PROPERTY TYPES
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
      setPropertyTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Property types error:", err);
      setPropertyTypes([]);
      setError(err.response?.data?.message || "Failed to load property types.");
    } finally {
      setLoadingPropertyTypes(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes(selectedAreaId);
  }, [selectedAreaId]);

  // ==========================================
  // SELECT
  // ==========================================

  const handleSelectCity = (cityId) => {
    setSelectedCityId(String(cityId));
    setSelectedAreaId("");
    setAreas([]);
    setPropertyTypes([]);
    setError("");
    setSuccess("");
  };

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(String(areaId));
    setPropertyTypes([]);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // CREATE CITY
  // ==========================================

  const handleCreateCity = async (event) => {
    event.preventDefault();
    const name = cityName.trim();

    if (!name) {
      setSuccess("");
      setError("Please enter city name.");
      return;
    }

    try {
      setCityLoading(true);
      setError("");
      setSuccess("");

      const newCity = await createCity({ name });

      setCities((prev) => [...prev, newCity]);
      setCityName("");
      setSelectedCityId(String(newCity.id));
      setSuccess("City created successfully.");
    } catch (err) {
      console.error("Create city error:", err);
      setError(err.response?.data?.message || "Failed to create city.");
    } finally {
      setCityLoading(false);
    }
  };

  // ==========================================
  // CREATE AREA
  // ==========================================

  const handleCreateArea = async (event) => {
    event.preventDefault();
    const name = areaName.trim();

    if (!selectedCityId) {
      setSuccess("");
      setError("Please select a city.");
      return;
    }

    if (!name) {
      setSuccess("");
      setError("Please enter area name.");
      return;
    }

    try {
      setAreaLoading(true);
      setError("");
      setSuccess("");

      const newArea = await createArea(Number(selectedCityId), { name });

      setAreas((prev) => [...prev, newArea]);
      setAreaName("");
      setSelectedAreaId(String(newArea.id));
      setSuccess("Area created successfully.");
    } catch (err) {
      console.error("Create area error:", err);
      setError(err.response?.data?.message || "Failed to create area.");
    } finally {
      setAreaLoading(false);
    }
  };

  // ==========================================
  // CREATE PROPERTY TYPE
  // ==========================================

  const handleCreatePropertyType = async (event) => {
    event.preventDefault();
    const name = propertyTypeName.trim();

    if (!selectedAreaId) {
      setSuccess("");
      setError("Please select an area.");
      return;
    }

    if (!name) {
      setSuccess("");
      setError("Please enter property type name.");
      return;
    }

    try {
      setPropertyTypeLoading(true);
      setError("");
      setSuccess("");

      const newPropertyType = await createPropertyType(Number(selectedAreaId), { name });

      setPropertyTypes((prev) => [...prev, newPropertyType]);
      setPropertyTypeName("");
      setSuccess("Property type created successfully.");
    } catch (err) {
      console.error("Create property type error:", err);
      setError(err.response?.data?.message || "Failed to create property type.");
    } finally {
      setPropertyTypeLoading(false);
    }
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredCities = useMemo(() => {
    const value = searchCity.toLowerCase().trim();
    return cities.filter((city) => String(city.name || "").toLowerCase().includes(value));
  }, [cities, searchCity]);

  const filteredAreas = useMemo(() => {
    const value = searchArea.toLowerCase().trim();
    return areas.filter((area) => String(area.name || "").toLowerCase().includes(value));
  }, [areas, searchArea]);

  const filteredPropertyTypes = useMemo(() => {
    const value = searchPropertyType.toLowerCase().trim();
    return propertyTypes.filter((type) => String(type.name || "").toLowerCase().includes(value));
  }, [propertyTypes, searchPropertyType]);

  const selectedCity = cities.find((city) => String(city.id) === String(selectedCityId));
  const selectedArea = areas.find((area) => String(area.id) === String(selectedAreaId));

  const cityCount = cities.length;
  const areaCount = areas.length;
  const propertyTypeCount = propertyTypes.length;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Locations Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage cities, areas and property types.</p>
        </div>

        <button
          type="button"
          onClick={() => fetchCities(false)}
          disabled={loadingCities || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="Cities" value={cityCount} icon={MapPin} iconClass="bg-blue-50 text-blue-600" />
        <StatCard label="Areas" value={areaCount} icon={Building2} iconClass="bg-orange-50 text-orange-600" />
        <StatCard label="Types" value={propertyTypeCount} icon={Layers3} iconClass="bg-violet-50 text-violet-600" />
      </div>

      {/* CURRENT SELECTION */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-400">Current Selection</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className={selectedCity ? "font-semibold text-blue-600" : "font-medium text-slate-400"}>
            {selectedCity?.name || "Select City"}
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className={selectedArea ? "font-semibold text-orange-600" : "font-medium text-slate-400"}>
            {selectedArea?.name || "Select Area"}
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-medium text-slate-400">Property Types</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* CITIES */}
        <LocationPanel title="Cities" subtitle={`${cityCount} ${cityCount === 1 ? "city" : "cities"}`} icon={MapPin} iconClass="bg-blue-50 text-blue-600">
          <CreateForm
            label="Add City"
            value={cityName}
            onChange={setCityName}
            onSubmit={handleCreateCity}
            placeholder="e.g. Pune"
            buttonClass="bg-blue-600 hover:bg-blue-700"
            loading={cityLoading}
          />

          <SearchInput value={searchCity} onChange={setSearchCity} placeholder="Search cities..." />

          <div className="mt-3">
            {loadingCities ? (
              <LoadingText text="Loading cities..." />
            ) : filteredCities.length === 0 ? (
              <EmptyText text="No cities found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const active = String(city.id) === String(selectedCityId);
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectCity(city.id)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                        active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium text-slate-800">{city.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">#{city.id}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </LocationPanel>

        {/* AREAS */}
        <LocationPanel
          title="Areas"
          subtitle={selectedCity ? `Inside ${selectedCity.name}` : "Select a city"}
          icon={Building2}
          iconClass="bg-orange-50 text-orange-600"
        >
          <CreateForm
            label="Add Area"
            value={areaName}
            onChange={setAreaName}
            onSubmit={handleCreateArea}
            placeholder={selectedCityId ? "e.g. Baner" : "Select city first"}
            disabled={!selectedCityId}
            buttonClass="bg-orange-600 hover:bg-orange-700"
            loading={areaLoading}
          />

          <SearchInput
            value={searchArea}
            onChange={setSearchArea}
            placeholder={selectedCityId ? "Search areas..." : "Select city first"}
            disabled={!selectedCityId}
          />

          <div className="mt-3">
            {!selectedCityId ? (
              <EmptyText text="Select a city to view areas." />
            ) : loadingAreas ? (
              <LoadingText text="Loading areas..." />
            ) : filteredAreas.length === 0 ? (
              <EmptyText text="No areas found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredAreas.map((area) => {
                  const active = String(area.id) === String(selectedAreaId);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => handleSelectArea(area.id)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                        active ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium text-slate-800">{area.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">#{area.id}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </LocationPanel>

        {/* PROPERTY TYPES */}
        <LocationPanel
          title="Property Types"
          subtitle={selectedArea ? `Inside ${selectedArea.name}` : "Select an area"}
          icon={Layers3}
          iconClass="bg-violet-50 text-violet-600"
        >
          <CreateForm
            label="Add Property Type"
            value={propertyTypeName}
            onChange={setPropertyTypeName}
            onSubmit={handleCreatePropertyType}
            placeholder={selectedAreaId ? "e.g. 2 BHK Flat" : "Select area first"}
            disabled={!selectedAreaId}
            buttonClass="bg-violet-600 hover:bg-violet-700"
            loading={propertyTypeLoading}
          />

          <SearchInput
            value={searchPropertyType}
            onChange={setSearchPropertyType}
            placeholder={selectedAreaId ? "Search property types..." : "Select area first"}
            disabled={!selectedAreaId}
          />

          <div className="mt-3">
            {!selectedAreaId ? (
              <EmptyText text="Select an area to view property types." />
            ) : loadingPropertyTypes ? (
              <LoadingText text="Loading property types..." />
            ) : filteredPropertyTypes.length === 0 ? (
              <EmptyText text="No property types found." />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredPropertyTypes.map((type) => (
                  <div key={type.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-slate-800">{type.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">#{type.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </LocationPanel>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">City → Area → Property Type</p>
            <p className="mt-0.5 text-xs text-slate-500">Property types are created inside the selected area.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <SummaryBadge label="Cities" value={cityCount} />
            <SummaryBadge label="Areas" value={areaCount} />
            <SummaryBadge label="Types" value={propertyTypeCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// LOCATION PANEL
// ==========================================

function LocationPanel({ title, subtitle, icon: Icon, iconClass, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-900">{title}</h2>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

// ==========================================
// CREATE FORM
// ==========================================

function CreateForm({ label, value, onChange, onSubmit, placeholder, disabled = false, loading = false, buttonClass }) {
  return (
    <form onSubmit={onSubmit} className="mb-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-100"
        />

        <button
          type="submit"
          disabled={disabled || loading}
          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50 ${buttonClass}`}
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

// ==========================================
// SEARCH INPUT
// ==========================================

function SearchInput({ value, onChange, placeholder, disabled = false }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400 disabled:bg-slate-100"
      />
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// LOADING / EMPTY
// ==========================================

function LoadingText({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
      <p className="mt-2 text-xs text-slate-400">{text}</p>
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

// ==========================================
// SUMMARY BADGE
// ==========================================

function SummaryBadge({ label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default LocationsManagement;