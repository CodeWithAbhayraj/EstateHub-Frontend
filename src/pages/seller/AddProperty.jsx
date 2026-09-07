import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  ImagePlus,
  Save,
  MapPin,
  Home,
} from "lucide-react";

import { createProperty } from "../../api/propertyApi";

import {
  getAllCities,
  getAreasByCity,
  getPropertyTypesByArea,
} from "../../api/locationAdminApi";

import PropertyImageUpload from "./PropertyImageUpload";

function AddProperty() {
  const navigate = useNavigate();

  // ==========================================
  // LOCATION STATES
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
  // FORM STATE
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

  // ==========================================
  // CREATED PROPERTY
  // ==========================================

  const [createdPropertyId, setCreatedPropertyId] =
    useState(null);

  const [createdProperty, setCreatedProperty] =
    useState(null);

  // ==========================================
  // COMMON STATE
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // LOAD CITIES
  // ==========================================

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        setError("");

        const data =
          await getAllCities();

        setCities(
          Array.isArray(data)
            ? data
            : []
        );
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
      }
    };

    loadCities();
  }, []);

  // ==========================================
  // LOAD AREAS
  // ==========================================

  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      setAreaId("");
      setPropertyTypes([]);
      setPropertyTypeId("");
      return;
    }

    const loadAreas = async () => {
      try {
        setLoadingAreas(true);
        setError("");

        const data =
          await getAreasByCity(
            cityId
          );

        setAreas(
          Array.isArray(data)
            ? data
            : []
        );

        setAreaId("");
        setPropertyTypes([]);
        setPropertyTypeId("");
      } catch (err) {
        console.error(
          "Areas error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load areas."
        );

        setAreas([]);
        setAreaId("");
        setPropertyTypes([]);
        setPropertyTypeId("");
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
      setPropertyTypeId("");
      return;
    }

    const loadPropertyTypes =
      async () => {
        try {
          setLoadingPropertyTypes(
            true
          );
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

          setPropertyTypeId("");
        } catch (err) {
          console.error(
            "Property types error:",
            err
          );

          setError(
            err.response?.data?.message ||
              "Failed to load property types."
          );

          setPropertyTypes([]);
          setPropertyTypeId("");
        } finally {
          setLoadingPropertyTypes(
            false
          );
        }
      };

    loadPropertyTypes();
  }, [areaId]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // CREATE PROPERTY
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ======================================
    // VALIDATION
    // ======================================

    if (!cityId) {
      setError(
        "Please select a city."
      );
      return;
    }

    if (!areaId) {
      setError(
        "Please select an area."
      );
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

    if (
      Number(formData.price) <= 0
    ) {
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

    if (
      Number(formData.area) <= 0
    ) {
      setError(
        "Property area must be greater than 0."
      );
      return;
    }

    try {
      setLoading(true);

      const propertyData = {
        title:
          formData.title.trim(),

        price:
          Number(formData.price),

        area:
          Number(formData.area),

        bhk: formData.bhk
          ? Number(formData.bhk)
          : null,

        cityId:
          Number(cityId),

        areaId:
          Number(areaId),

        propertyTypeId:
          Number(propertyTypeId),

        furnished:
          formData.furnished ||
          null,

        parking:
          formData.parking,

        facing:
          formData.facing.trim() ||
          null,

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

      const response =
        await createProperty(
          propertyData
        );

      setCreatedProperty(
        response
      );

      setCreatedPropertyId(
        response?.id
      );

      setSuccess(
        "Property created successfully. You can now upload images."
      );
    } catch (err) {
      console.error(
        "Create property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create property."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATED PROPERTY SCREEN
  // ==========================================

  if (createdPropertyId) {
    return (
      <div className="w-full">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="relative p-5 sm:p-7 lg:p-8">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex items-start gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/seller/dashboard"
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  transition

                  hover:bg-slate-50
                  hover:text-slate-900

                  active:scale-95
                "
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  EstateHub Seller
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Property Created
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your property has been saved as a draft.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* ======================================
            SUCCESS
        ====================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <CheckCircle size={19} />
          </div>

          <div>

            <p className="text-sm font-bold text-emerald-800">
              Property created successfully
            </p>

            <p className="mt-1 text-xs text-emerald-700">
              Property ID: #{createdPropertyId}
            </p>

            <p className="mt-0.5 text-xs text-emerald-700">
              Status:{" "}
              {createdProperty?.status ||
                "DRAFT"}
            </p>

          </div>

        </div>


        {/* ======================================
            PROPERTY SUMMARY
        ====================================== */}

        {createdProperty && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Property
                </p>

                <h2 className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900">
                  {createdProperty.title ||
                    "Untitled Property"}
                </h2>

                <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">

                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {createdProperty.areaName ||
                      "—"}
                    {createdProperty.areaName &&
                      createdProperty.city
                      ? ", "
                      : ""}
                    {createdProperty.city ||
                      "—"}
                  </span>

                </p>

              </div>


              <span className="inline-flex w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                {createdProperty.status ||
                  "DRAFT"}
              </span>

            </div>

          </section>
        )}


        {/* ======================================
            IMAGE UPLOAD
        ====================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ImagePlus size={20} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Property Images
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Add your property photos before submitting it for approval.
              </p>

            </div>

          </div>

          <PropertyImageUpload
            propertyId={
              createdPropertyId
            }
          />

        </section>


        {/* ======================================
            ACTIONS
        ====================================== */}

        <div className="mt-6 grid gap-3 sm:flex sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/seller/dashboard"
              )
            }
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              transition

              hover:bg-slate-50
            "
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/properties/${createdPropertyId}`
              )
            }
            className="
              inline-flex
              min-h-11
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
              transition

              hover:bg-slate-800
            "
          >
            View Property
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // ADD PROPERTY FORM
  // ==========================================

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex items-start gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/seller/dashboard"
                )
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-600
                transition

                hover:bg-slate-50
                hover:text-slate-900

                active:scale-95
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                EstateHub Seller
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Add Property
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                Create your property listing with accurate information.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium leading-5 text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* ==========================================
          FORM
      ========================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* ========================================
            LOCATION
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={20} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Property Location
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Select the location in order: City → Area → Property Type.
              </p>

            </div>

          </div>


          <div className="grid gap-4 md:grid-cols-3">

            {/* CITY */}

            <FormField
              label="City"
              required
            >
              <select
                value={cityId}
                onChange={(event) =>
                  setCityId(
                    event.target.value
                  )
                }
                disabled={
                  loadingCities
                }
                className={selectClass}
              >
                <option value="">
                  {loadingCities
                    ? "Loading cities..."
                    : "Select City"}
                </option>

                {cities.map(
                  (city) => (
                    <option
                      key={city.id}
                      value={city.id}
                    >
                      {city.name}
                    </option>
                  )
                )}
              </select>
            </FormField>


            {/* AREA */}

            <FormField
              label="Area"
              required
            >
              <select
                value={areaId}
                onChange={(event) =>
                  setAreaId(
                    event.target.value
                  )
                }
                disabled={
                  !cityId ||
                  loadingAreas
                }
                className={selectClass}
              >
                <option value="">
                  {!cityId
                    ? "Select city first"
                    : loadingAreas
                    ? "Loading areas..."
                    : "Select Area"}
                </option>

                {areas.map(
                  (area) => (
                    <option
                      key={area.id}
                      value={area.id}
                    >
                      {area.name}
                    </option>
                  )
                )}
              </select>
            </FormField>


            {/* PROPERTY TYPE */}

            <FormField
              label="Property Type"
              required
            >
              <select
                value={
                  propertyTypeId
                }
                onChange={(event) =>
                  setPropertyTypeId(
                    event.target.value
                  )
                }
                disabled={
                  !areaId ||
                  loadingPropertyTypes
                }
                className={selectClass}
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
            </FormField>

          </div>

        </section>


        {/* ========================================
            BASIC DETAILS
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Home size={20} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Basic Details
              </h2>

              <p className="text-xs text-slate-500 sm:text-sm">
                Add the main information buyers need.
              </p>

            </div>

          </div>


          <div className="grid gap-4 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <FormField
                label="Property Title"
                required
              >
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Spacious 2 BHK Flat in Baner"
                  className={inputClass}
                />
              </FormField>

            </div>


            {/* PRICE */}

            <FormField
              label="Price"
              required
            >
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 7500000"
                min="1"
                inputMode="decimal"
                className={inputClass}
              />
            </FormField>


            {/* AREA */}

            <FormField
              label="Area (sq.ft)"
              required
            >
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. 1200"
                min="1"
                step="0.01"
                inputMode="decimal"
                className={inputClass}
              />
            </FormField>


            {/* BHK */}

            <FormField
              label="BHK"
            >
              <input
                type="number"
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                placeholder="e.g. 2"
                min="0"
                inputMode="numeric"
                className={inputClass}
              />
            </FormField>


            {/* FURNISHED */}

            <FormField
              label="Furnished"
            >
              <select
                name="furnished"
                value={
                  formData.furnished
                }
                onChange={
                  handleChange
                }
                className={selectClass}
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
            </FormField>


            {/* FACING */}

            <FormField
              label="Facing"
            >
              <select
                name="facing"
                value={
                  formData.facing
                }
                onChange={
                  handleChange
                }
                className={selectClass}
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
            </FormField>

          </div>

        </section>


        {/* ========================================
            PROPERTY OPTIONS
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Property Options
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Select the features that apply to your property.
            </p>

          </div>


          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <CheckboxOption
              name="parking"
              checked={
                formData.parking
              }
              onChange={
                handleChange
              }
              label="Parking Available"
            />

            <CheckboxOption
              name="readyToMove"
              checked={
                formData.readyToMove
              }
              onChange={
                handleChange
              }
              label="Ready to Move"
            />

            <CheckboxOption
              name="newProject"
              checked={
                formData.newProject
              }
              onChange={
                handleChange
              }
              label="New Project"
            />

            <CheckboxOption
              name="resale"
              checked={
                formData.resale
              }
              onChange={
                handleChange
              }
              label="Resale"
            />

          </div>

        </section>


        {/* ========================================
            DESCRIPTION
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Description
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Give buyers a clear overview of the property.
            </p>

          </div>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows={6}
            placeholder="Describe the property, nearby facilities, features, location advantages, etc."
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              leading-6
              text-slate-800
              shadow-sm
              outline-none
              transition

              placeholder:text-slate-400

              hover:border-slate-400

              focus:border-slate-500
              focus:ring-4
              focus:ring-slate-100
            "
          />

        </section>


        {/* ========================================
            BOTTOM ACTIONS
        ======================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-semibold text-slate-800">
                Ready to create your listing?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The property will initially be saved as a draft.
                You can upload images and submit it for approval afterward.
              </p>

            </div>


            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/seller/dashboard"
                  )
                }
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition

                  hover:bg-slate-50

                  sm:w-auto
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex
                  min-h-11
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

                  sm:w-auto
                "
              >

                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Create Property
                    <ArrowRight
                      size={16}
                    />
                  </>
                )}

              </button>

            </div>

          </div>

        </section>

      </form>

    </div>
  );
}


// ==========================================
// REUSABLE FORM FIELD
// ==========================================

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <div className="w-full">

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}

    </div>
  );
}


// ==========================================
// CHECKBOX
// ==========================================

function CheckboxOption({
  name,
  checked,
  onChange,
  label,
}) {
  return (
    <label
      className="
        flex
        min-h-12
        cursor-pointer
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3.5
        transition

        hover:border-slate-300
        hover:bg-slate-50

        has-[:checked]:border-blue-200
        has-[:checked]:bg-blue-50
      "
    >

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-600"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

    </label>
  );
}


// ==========================================
// COMMON CLASSES
// ==========================================

const inputClass = `
  min-h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
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
`;

const selectClass = `
  min-h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-2.5
  text-sm
  font-medium
  text-slate-800
  shadow-sm
  outline-none
  transition

  hover:border-slate-400

  focus:border-slate-500
  focus:ring-4
  focus:ring-slate-100

  disabled:cursor-not-allowed
  disabled:bg-slate-100
  disabled:text-slate-400
`;

export default AddProperty;