import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Save,
} from "lucide-react";

import {
  getPropertyById,
  updateProperty,
} from "../../api/propertyApi";

import {
  getAllCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationAdminApi";

import PropertyImageUpload from "./PropertyImageUpload";

function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // LOCATION
  // ==========================================

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [propertyTypeId, setPropertyTypeId] =
    useState("");

  const [loadingCities, setLoadingCities] =
    useState(true);
  const [loadingAreas, setLoadingAreas] =
    useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] =
    useState(false);

  // ==========================================
  // PROPERTY
  // ==========================================

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    area: "",
    bhk: "",
    furnished: "",
    parking: false,
    facing: "",
    readyToMove: false,
    newProject: false,
    resale: false,
    description: "",
  });

  const [originalStatus, setOriginalStatus] =
    useState("");

  const [loadingProperty, setLoadingProperty] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);

        const data = await getAllCities();

        setCities(
          Array.isArray(data) ? data : []
        );
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

    loadCities();
  }, []);

  // ==========================================
  // LOAD PROPERTY
  // ==========================================

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        setLoadingProperty(true);
        setError("");

        const property =
          await getPropertyById(id);

        setFormData({
          title: property.title || "",
          price: property.price ?? "",
          area: property.area ?? "",
          bhk: property.bhk ?? "",
          furnished:
            property.furnished || "",
          parking:
            property.parking ?? false,
          facing: property.facing || "",
          readyToMove:
            property.readyToMove ?? false,
          newProject:
            property.newProject ?? false,
          resale:
            property.resale ?? false,
          description:
            property.description || "",
        });

        setCityId(
          property.cityId
            ? String(property.cityId)
            : ""
        );

        setAreaId(
          property.areaId
            ? String(property.areaId)
            : ""
        );

        setPropertyTypeId(
          property.propertyTypeId
            ? String(property.propertyTypeId)
            : ""
        );

        setOriginalStatus(
          property.status || ""
        );
      } catch (err) {
        console.error(
          "Property loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load property."
        );
      } finally {
        setLoadingProperty(false);
      }
    };

    loadProperty();
  }, [id]);

  // ==========================================
  // LOAD AREAS
  // ==========================================

  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      return;
    }

    const loadAreas = async () => {
      try {
        setLoadingAreas(true);

        const data =
          await getAreasByCity(cityId);

        setAreas(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Areas loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load areas."
        );
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreas();
  }, [cityId]);

  // ==========================================
  // LOAD PROPERTY TYPES
  // ==========================================

  useEffect(() => {
    if (!areaId) {
      setPropertyTypes([]);
      return;
    }

    const loadPropertyTypes = async () => {
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
          "Property types loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load property types."
        );
      } finally {
        setLoadingPropertyTypes(false);
      }
    };

    loadPropertyTypes();
  }, [areaId]);

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // UPDATE PROPERTY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!cityId) {
      setError("Please select a city.");
      return;
    }

    if (!areaId) {
      setError("Please select an area.");
      return;
    }

    if (!propertyTypeId) {
      setError(
        "Please select a property type."
      );
      return;
    }

    if (!formData.title.trim()) {
      setError(
        "Please enter property title."
      );
      return;
    }

    if (!formData.price) {
      setError(
        "Please enter property price."
      );
      return;
    }

    if (Number(formData.price) <= 0) {
      setError(
        "Property price must be greater than 0."
      );
      return;
    }

    if (!formData.area) {
      setError(
        "Please enter property area."
      );
      return;
    }

    if (Number(formData.area) <= 0) {
      setError(
        "Property area must be greater than 0."
      );
      return;
    }

    try {
      setSaving(true);

      const propertyData = {
        title: formData.title.trim(),

        price: Number(formData.price),

        area: Number(formData.area),

        bhk: formData.bhk
          ? Number(formData.bhk)
          : null,

        cityId: Number(cityId),

        areaId: Number(areaId),

        propertyTypeId:
          Number(propertyTypeId),

        furnished:
          formData.furnished || null,

        parking: formData.parking,

        facing:
          formData.facing.trim() || null,

        readyToMove:
          formData.readyToMove,

        newProject:
          formData.newProject,

        resale:
          formData.resale,

        description:
          formData.description.trim() ||
          null,
      };

      const updatedProperty =
        await updateProperty(
          id,
          propertyData
        );

      setOriginalStatus(
        updatedProperty.status ||
          originalStatus
      );

      setSuccess(
        "Property updated successfully."
      );

    } catch (err) {
      console.error(
        "Update property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loadingProperty) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-500">
            Loading property...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/seller/properties"
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>

          <div>

            <p className="text-sm font-medium text-slate-500">
              EstateHub Seller
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Edit Property
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your property information.
            </p>

          </div>

        </div>

        {/* STATUS */}

        {originalStatus && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-sm text-slate-500">
              Current Status
            </p>

            <p className="mt-1 font-bold text-slate-900">
              {originalStatus}
            </p>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* LOCATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Building2
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Property Location
                </h2>

                <p className="text-xs text-slate-500">
                  City → Area → Property Type
                </p>

              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* CITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>

                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(
                      e.target.value
                    );

                    setAreaId("");
                    setPropertyTypeId("");
                  }}
                  disabled={loadingCities}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                >

                  <option value="">
                    {loadingCities
                      ? "Loading cities..."
                      : "Select City"}
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

              {/* AREA */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Area
                </label>

                <select
                  value={areaId}
                  onChange={(e) => {
                    setAreaId(
                      e.target.value
                    );

                    setPropertyTypeId("");
                  }}
                  disabled={
                    !cityId ||
                    loadingAreas
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                >

                  <option value="">
                    {!cityId
                      ? "Select city first"
                      : loadingAreas
                      ? "Loading areas..."
                      : "Select Area"}
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

              {/* PROPERTY TYPE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Property Type
                </label>

                <select
                  value={propertyTypeId}
                  onChange={(e) =>
                    setPropertyTypeId(
                      e.target.value
                    )
                  }
                  disabled={
                    !areaId ||
                    loadingPropertyTypes
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
                >

                  <option value="">
                    {!areaId
                      ? "Select area first"
                      : loadingPropertyTypes
                      ? "Loading types..."
                      : "Select Property Type"}
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

          </div>

          {/* BASIC DETAILS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Basic Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Property Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Spacious 2 BHK Flat in Baner"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />

              </div>

              {/* PRICE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />

              </div>

              {/* AREA */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Area (sq.ft)
                </label>

                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />

              </div>

              {/* BHK */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  BHK
                </label>

                <input
                  type="number"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />

              </div>

              {/* FURNISHED */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Furnished
                </label>

                <select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Furnished">
                    Furnished
                  </option>

                  <option value="Semi-Furnished">
                    Semi-Furnished
                  </option>

                  <option value="Unfurnished">
                    Unfurnished
                  </option>

                </select>

              </div>

              {/* FACING */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Facing
                </label>

                <select
                  name="facing"
                  value={formData.facing}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >

                  <option value="">
                    Select Facing
                  </option>

                  <option value="North">
                    North
                  </option>

                  <option value="South">
                    South
                  </option>

                  <option value="East">
                    East
                  </option>

                  <option value="West">
                    West
                  </option>

                  <option value="North-East">
                    North-East
                  </option>

                  <option value="North-West">
                    North-West
                  </option>

                  <option value="South-East">
                    South-East
                  </option>

                  <option value="South-West">
                    South-West
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* OPTIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Property Options
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">

                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Parking Available
                </span>

              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">

                <input
                  type="checkbox"
                  name="readyToMove"
                  checked={
                    formData.readyToMove
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Ready to Move
                </span>

              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">

                <input
                  type="checkbox"
                  name="newProject"
                  checked={
                    formData.newProject
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  New Project
                </span>

              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">

                <input
                  type="checkbox"
                  name="resale"
                  checked={
                    formData.resale
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Resale
                </span>

              </label>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Description
            </h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe your property..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />

          </div>

          {/* SAVE */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/seller/properties"
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save size={17} />

              {saving
                ? "Updating..."
                : "Update Property"}

            </button>

          </div>

        </form>

        {/* ==========================================
            IMAGE MANAGEMENT
        ========================================== */}

        <div className="mt-6">

          <PropertyImageUpload
            propertyId={Number(id)}
          />

        </div>

      </div>
    </div>
  );
}

export default EditProperty;