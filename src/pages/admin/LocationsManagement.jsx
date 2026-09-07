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
  // ==========================================
  // CITY STATE
  // ==========================================

  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] =
    useState("");

  const [cityName, setCityName] =
    useState("");

  const [cityLoading, setCityLoading] =
    useState(false);

  // ==========================================
  // AREA STATE
  // ==========================================

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] =
    useState("");

  const [areaName, setAreaName] =
    useState("");

  const [areaLoading, setAreaLoading] =
    useState(false);

  // ==========================================
  // PROPERTY TYPE STATE
  // ==========================================

  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [propertyTypeName, setPropertyTypeName] =
    useState("");

  const [propertyTypeLoading, setPropertyTypeLoading] =
    useState(false);

  // ==========================================
  // LOADING
  // ==========================================

  const [loadingCities, setLoadingCities] =
    useState(true);

  const [loadingAreas, setLoadingAreas] =
    useState(false);

  const [loadingPropertyTypes, setLoadingPropertyTypes] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  // ==========================================
  // ALERTS
  // ==========================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchCity, setSearchCity] =
    useState("");

  const [searchArea, setSearchArea] =
    useState("");

  const [searchPropertyType, setSearchPropertyType] =
    useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  const fetchCities = async (
    showFullLoader = true
  ) => {
    try {
      if (showFullLoader) {
        setLoadingCities(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getAllCities();

      const cityList = Array.isArray(data)
        ? data
        : [];

      setCities(cityList);

      if (cityList.length === 0) {
        setSelectedCityId("");
        setSelectedAreaId("");
        setAreas([]);
        setPropertyTypes([]);
        return;
      }

      const currentCityExists =
        cityList.some(
          (city) =>
            String(city.id) ===
            String(selectedCityId)
        );

      if (!currentCityExists) {
        setSelectedCityId(
          String(cityList[0].id)
        );
      }
    } catch (err) {
      console.error(
        "Cities error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load cities."
      );
    } finally {
      setLoadingCities(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL CITY LOAD
  // ==========================================

  useEffect(() => {
    fetchCities();
  }, []);

  // ==========================================
  // LOAD AREAS
  // ==========================================

  const fetchAreas = async (
    cityId
  ) => {
    if (!cityId) {
      setAreas([]);
      setSelectedAreaId("");
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingAreas(true);
      setError("");

      const data =
        await getAreasByCity(cityId);

      const areaList = Array.isArray(data)
        ? data
        : [];

      setAreas(areaList);

      if (areaList.length > 0) {
        const existingArea =
          areaList.find(
            (area) =>
              String(area.id) ===
              String(selectedAreaId)
          );

        if (!existingArea) {
          setSelectedAreaId(
            String(areaList[0].id)
          );
        }
      } else {
        setSelectedAreaId("");
        setPropertyTypes([]);
      }
    } catch (err) {
      console.error(
        "Areas error:",
        err
      );

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
    fetchAreas(
      selectedCityId
    );
  }, [selectedCityId]);

  // ==========================================
  // LOAD PROPERTY TYPES
  // ==========================================

  const fetchPropertyTypes = async (
    areaId
  ) => {
    if (!areaId) {
      setPropertyTypes([]);
      return;
    }

    try {
      setLoadingPropertyTypes(true);
      setError("");

      const data =
        await getPropertyTypesByArea(
          areaId
        );

      setPropertyTypes(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Property types error:",
        err
      );

      setPropertyTypes([]);

      setError(
        err.response?.data?.message ||
          "Failed to load property types."
      );
    } finally {
      setLoadingPropertyTypes(
        false
      );
    }
  };

  useEffect(() => {
    fetchPropertyTypes(
      selectedAreaId
    );
  }, [selectedAreaId]);

  // ==========================================
  // SELECT CITY
  // ==========================================

  const handleSelectCity = (cityId) => {
    setSelectedCityId(
      String(cityId)
    );

    setSelectedAreaId("");
    setAreas([]);
    setPropertyTypes([]);

    setError("");
    setSuccess("");
  };

  // ==========================================
  // SELECT AREA
  // ==========================================

  const handleSelectArea = (
    areaId
  ) => {
    setSelectedAreaId(
      String(areaId)
    );

    setPropertyTypes([]);

    setError("");
    setSuccess("");
  };

  // ==========================================
  // CREATE CITY
  // ==========================================

  const handleCreateCity = async (
    event
  ) => {
    event.preventDefault();

    const name =
      cityName.trim();

    if (!name) {
      setSuccess("");
      setError(
        "Please enter city name."
      );
      return;
    }

    try {
      setCityLoading(true);
      setError("");
      setSuccess("");

      const newCity =
        await createCity({
          name,
        });

      setCities((prev) => [
        ...prev,
        newCity,
      ]);

      setCityName("");

      setSelectedCityId(
        String(newCity.id)
      );

      setSuccess(
        "City created successfully."
      );
    } catch (err) {
      console.error(
        "Create city error:",
        err
      );

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

  const handleCreateArea = async (
    event
  ) => {
    event.preventDefault();

    const name =
      areaName.trim();

    if (!selectedCityId) {
      setSuccess("");
      setError(
        "Please select a city."
      );
      return;
    }

    if (!name) {
      setSuccess("");
      setError(
        "Please enter area name."
      );
      return;
    }

    try {
      setAreaLoading(true);
      setError("");
      setSuccess("");

      const newArea =
        await createArea(
          Number(selectedCityId),
          {
            name,
          }
        );

      setAreas((prev) => [
        ...prev,
        newArea,
      ]);

      setAreaName("");

      setSelectedAreaId(
        String(newArea.id)
      );

      setSuccess(
        "Area created successfully."
      );
    } catch (err) {
      console.error(
        "Create area error:",
        err
      );

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

  const handleCreatePropertyType =
    async (event) => {
      event.preventDefault();

      const name =
        propertyTypeName.trim();

      if (!selectedAreaId) {
        setSuccess("");
        setError(
          "Please select an area."
        );
        return;
      }

      if (!name) {
        setSuccess("");
        setError(
          "Please enter property type name."
        );
        return;
      }

      try {
        setPropertyTypeLoading(
          true
        );

        setError("");
        setSuccess("");

        const newPropertyType =
          await createPropertyType(
            Number(selectedAreaId),
            {
              name,
            }
          );

        setPropertyTypes(
          (prev) => [
            ...prev,
            newPropertyType,
          ]
        );

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
        setPropertyTypeLoading(
          false
        );
      }
    };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredCities = useMemo(() => {
    const value =
      searchCity
        .toLowerCase()
        .trim();

    return cities.filter(
      (city) =>
        String(
          city.name || ""
        )
          .toLowerCase()
          .includes(value)
    );
  }, [
    cities,
    searchCity,
  ]);

  const filteredAreas = useMemo(() => {
    const value =
      searchArea
        .toLowerCase()
        .trim();

    return areas.filter(
      (area) =>
        String(
          area.name || ""
        )
          .toLowerCase()
          .includes(value)
    );
  }, [
    areas,
    searchArea,
  ]);

  const filteredPropertyTypes =
    useMemo(() => {
      const value =
        searchPropertyType
          .toLowerCase()
          .trim();

      return propertyTypes.filter(
        (type) =>
          String(
            type.name || ""
          )
            .toLowerCase()
            .includes(value)
      );
    }, [
      propertyTypes,
      searchPropertyType,
    ]);

  // ==========================================
  // SELECTED OBJECTS
  // ==========================================

  const selectedCity =
    cities.find(
      (city) =>
        String(city.id) ===
        String(selectedCityId)
    );

  const selectedArea =
    areas.find(
      (area) =>
        String(area.id) ===
        String(selectedAreaId)
    );

  // ==========================================
  // STATS
  // ==========================================

  const cityCount =
    cities.length;

  const areaCount =
    areas.length;

  const propertyTypeCount =
    propertyTypes.length;

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Locations Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage cities, areas and property types.
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                fetchCities(false)
              }
              disabled={
                loadingCities ||
                refreshing
              }
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-900
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition

                hover:bg-slate-800
                hover:shadow-md

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-fit
              "
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </div>

      </section>


      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-medium
            leading-5
            text-red-600
          "
          role="alert"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}


      {success && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            font-medium
            leading-5
            text-emerald-700
          "
          role="status"
        >
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>

        </div>
      )}


      {/* ==========================================
          STATS
      ========================================== */}

      <section className="mb-6">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Location Structure
          </h2>

        </div>


        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4">

          <StatCard
            label="Cities"
            value={cityCount}
            icon={MapPin}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Areas"
            value={areaCount}
            icon={Building2}
            iconClass="bg-orange-50 text-orange-600"
          />

          <StatCard
            label="Types"
            value={propertyTypeCount}
            icon={Layers3}
            iconClass="bg-violet-50 text-violet-600"
          />

        </div>

      </section>


      {/* ==========================================
          HIERARCHY
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Current Selection
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">

            <span
              className={
                selectedCity
                  ? "font-bold text-blue-600"
                  : "font-medium text-slate-400"
              }
            >
              {selectedCity?.name ||
                "Select City"}
            </span>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

            <span
              className={
                selectedArea
                  ? "font-bold text-orange-600"
                  : "font-medium text-slate-400"
              }
            >
              {selectedArea?.name ||
                "Select Area"}
            </span>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

            <span className="font-medium text-slate-400">
              Property Types
            </span>

          </div>

        </div>

      </section>


      {/* ==========================================
          MAIN GRID
      ========================================== */}

      <div className="grid gap-5 xl:grid-cols-3">

        {/* ========================================
            CITIES
        ======================================== */}

        <LocationPanel
          title="Cities"
          subtitle={
            `${cityCount} ${
              cityCount === 1
                ? "city"
                : "cities"
            }`
          }
          icon={MapPin}
          iconClass="bg-blue-50 text-blue-600"
        >

          {/* CREATE */}

          <CreateForm
            label="Add City"
            value={cityName}
            onChange={
              setCityName
            }
            onSubmit={
              handleCreateCity
            }
            placeholder="e.g. Pune"
            buttonClass="bg-blue-600 hover:bg-blue-700"
            loading={
              cityLoading
            }
          />


          {/* SEARCH */}

          <SearchInput
            value={searchCity}
            onChange={
              setSearchCity
            }
            placeholder="Search cities..."
          />


          {/* LIST */}

          <div className="mt-4">

            {loadingCities ? (

              <LoadingText
                text="Loading cities..."
              />

            ) : filteredCities.length ===
              0 ? (

              <EmptyText
                text="No cities found."
              />

            ) : (

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">

                {filteredCities.map(
                  (city) => {

                    const active =
                      String(
                        city.id
                      ) ===
                      String(
                        selectedCityId
                      );

                    return (
                      <button
                        key={
                          city.id
                        }
                        type="button"
                        onClick={() =>
                          handleSelectCity(
                            city.id
                          )
                        }
                        className={`
                          w-full
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-left
                          transition

                          ${
                            active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }
                        `}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className={`
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                ${
                                  active
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-slate-100 text-slate-500"
                                }
                              `}
                            >
                              <MapPin
                                size={15}
                              />
                            </div>

                            <span className="truncate text-sm font-semibold text-slate-800">
                              {city.name}
                            </span>

                          </div>

                          <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                            #{city.id}
                          </span>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </LocationPanel>


        {/* ========================================
            AREAS
        ======================================== */}

        <LocationPanel
          title="Areas"
          subtitle={
            selectedCity
              ? `Inside ${selectedCity.name}`
              : "Select a city"
          }
          icon={Building2}
          iconClass="bg-orange-50 text-orange-600"
        >

          {/* CREATE */}

          <CreateForm
            label="Add Area"
            value={areaName}
            onChange={
              setAreaName
            }
            onSubmit={
              handleCreateArea
            }
            placeholder={
              selectedCityId
                ? "e.g. Baner"
                : "Select city first"
            }
            disabled={
              !selectedCityId
            }
            buttonClass="bg-orange-600 hover:bg-orange-700"
            loading={
              areaLoading
            }
          />


          {/* SEARCH */}

          <SearchInput
            value={searchArea}
            onChange={
              setSearchArea
            }
            placeholder={
              selectedCityId
                ? "Search areas..."
                : "Select city first"
            }
            disabled={
              !selectedCityId
            }
          />


          {/* LIST */}

          <div className="mt-4">

            {!selectedCityId ? (

              <EmptyText
                text="Select a city to view areas."
              />

            ) : loadingAreas ? (

              <LoadingText
                text="Loading areas..."
              />

            ) : filteredAreas.length ===
              0 ? (

              <EmptyText
                text="No areas found."
              />

            ) : (

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">

                {filteredAreas.map(
                  (area) => {

                    const active =
                      String(
                        area.id
                      ) ===
                      String(
                        selectedAreaId
                      );

                    return (
                      <button
                        key={
                          area.id
                        }
                        type="button"
                        onClick={() =>
                          handleSelectArea(
                            area.id
                          )
                        }
                        className={`
                          w-full
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-left
                          transition

                          ${
                            active
                              ? "border-orange-300 bg-orange-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }
                        `}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className={`
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                ${
                                  active
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-slate-100 text-slate-500"
                                }
                              `}
                            >
                              <Building2
                                size={15}
                              />
                            </div>

                            <span className="truncate text-sm font-semibold text-slate-800">
                              {area.name}
                            </span>

                          </div>

                          <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                            #{area.id}
                          </span>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </LocationPanel>


        {/* ========================================
            PROPERTY TYPES
        ======================================== */}

        <LocationPanel
          title="Property Types"
          subtitle={
            selectedArea
              ? `Inside ${selectedArea.name}`
              : "Select an area"
          }
          icon={Layers3}
          iconClass="bg-violet-50 text-violet-600"
        >

          {/* CREATE */}

          <CreateForm
            label="Add Property Type"
            value={
              propertyTypeName
            }
            onChange={
              setPropertyTypeName
            }
            onSubmit={
              handleCreatePropertyType
            }
            placeholder={
              selectedAreaId
                ? "e.g. 2 BHK Flat"
                : "Select area first"
            }
            disabled={
              !selectedAreaId
            }
            buttonClass="bg-violet-600 hover:bg-violet-700"
            loading={
              propertyTypeLoading
            }
          />


          {/* SEARCH */}

          <SearchInput
            value={
              searchPropertyType
            }
            onChange={
              setSearchPropertyType
            }
            placeholder={
              selectedAreaId
                ? "Search property types..."
                : "Select area first"
            }
            disabled={
              !selectedAreaId
            }
          />


          {/* LIST */}

          <div className="mt-4">

            {!selectedAreaId ? (

              <EmptyText
                text="Select an area to view property types."
              />

            ) : loadingPropertyTypes ? (

              <LoadingText
                text="Loading property types..."
              />

            ) : filteredPropertyTypes.length ===
              0 ? (

              <EmptyText
                text="No property types found."
              />

            ) : (

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">

                {filteredPropertyTypes.map(
                  (type) => (
                    <div
                      key={
                        type.id
                      }
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        transition

                        hover:bg-slate-50
                      "
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                            <Layers3
                              size={15}
                            />

                          </div>

                          <span className="truncate text-sm font-semibold text-slate-800">
                            {type.name}
                          </span>

                        </div>

                        <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                          #{type.id}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </LocationPanel>

      </div>


      {/* ==========================================
          FOOTER INFO
      ========================================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Location Hierarchy
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              City → Area → Property Type
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Property types are created inside the selected area.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <SummaryBadge
              label="Cities"
              value={
                cityCount
              }
            />

            <SummaryBadge
              label="Areas"
              value={
                areaCount
              }
            />

            <SummaryBadge
              label="Types"
              value={
                propertyTypeCount
              }
            />

          </div>

        </div>

      </section>

    </div>
  );
}


// ==========================================
// LOCATION PANEL
// ==========================================

function LocationPanel({
  title,
  subtitle,
  icon: Icon,
  iconClass,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconClass}
            `}
          >
            <Icon size={20} />
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


// ==========================================
// CREATE FORM
// ==========================================

function CreateForm({
  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  loading = false,
  buttonClass,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-4"
    >

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex gap-2">

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          disabled={disabled}
          className="
            min-h-11
            min-w-0
            flex-1
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-sm
            font-medium
            text-slate-800
            shadow-sm
            outline-none
            transition

            placeholder:text-slate-400

            hover:border-slate-400

            focus:border-slate-500
            focus:ring-4
            focus:ring-slate-100

            disabled:cursor-not-allowed
            disabled:bg-slate-100
          "
        />

        <button
          type="submit"
          disabled={
            disabled ||
            loading
          }
          className={`
            inline-flex
            min-h-11
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-xl
            px-3
            py-2.5
            text-xs
            font-bold
            text-white
            shadow-sm
            transition

            hover:shadow-md

            active:scale-[0.98]

            disabled:cursor-not-allowed
            disabled:opacity-50

            ${buttonClass}
          `}
        >

          {loading ? (
            <RefreshCw
              size={15}
              className="animate-spin"
            />
          ) : (
            <Plus size={15} />
          )}

          {loading
            ? "Adding..."
            : "Add"}

        </button>

      </div>

    </form>
  );
}


// ==========================================
// SEARCH INPUT
// ==========================================

function SearchInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="relative">

      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        disabled={disabled}
        className="
          min-h-10
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          py-2.5
          pl-9
          pr-3
          text-sm
          text-slate-700
          shadow-sm
          outline-none
          transition

          placeholder:text-slate-400

          hover:border-slate-400

          focus:border-slate-500
          focus:ring-4
          focus:ring-slate-100

          disabled:cursor-not-allowed
          disabled:bg-slate-100
        "
      />

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md

        sm:p-5
      "
    >

      <div className="flex items-center justify-between gap-2 sm:items-start">

        <div className="min-w-0">

          <p className="truncate text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
            {value}
          </p>

        </div>

        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            group-hover:scale-105

            sm:h-11
            sm:w-11

            ${iconClass}
          `}
        >
          <Icon
            size={17}
          />
        </div>

      </div>

    </div>
  );
}


// ==========================================
// LOADING
// ==========================================

function LoadingText({
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">

      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />

      <p className="mt-3 text-xs font-medium text-slate-400">
        {text}
      </p>

    </div>
  );
}


// ==========================================
// EMPTY
// ==========================================

function EmptyText({
  text,
}) {
  return (
    <div className="py-10 text-center">

      <p className="text-sm font-medium text-slate-400">
        {text}
      </p>

    </div>
  );
}


// ==========================================
// SUMMARY BADGE
// ==========================================

function SummaryBadge({
  label,
  value,
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">

      <span className="text-xs font-medium text-slate-500">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}

export default LocationsManagement;