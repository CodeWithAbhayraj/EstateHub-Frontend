import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, CheckCircle, Home, MapPin, Save } from "lucide-react";
import { createProperty } from "../../api/propertyApi";
import { getAllCities, getAreasByCity, getPropertyTypesByArea } from "../../api/locationAdminApi";
import PropertyImageUpload from "./PropertyImageUpload";

export default function AddProperty() {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [propertyTypeId, setPropertyTypeId] = useState("");
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);

  const [formData, setFormData] = useState({
    title: "", price: "", area: "", bhk: "", furnished: "", parking: false,
    facing: "", readyToMove: false, newProject: false, resale: false, description: "",
  });

  const [createdPropertyId, setCreatedPropertyId] = useState(null);
  const [createdProperty, setCreatedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load cities
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const data = await getAllCities();
        setCities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cities.");
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  // Load areas on city change
  useEffect(() => {
    if (!cityId) { setAreas([]); setAreaId(""); setPropertyTypes([]); setPropertyTypeId(""); return; }
    const loadAreas = async () => {
      try {
        setLoadingAreas(true);
        const data = await getAreasByCity(cityId);
        setAreas(Array.isArray(data) ? data : []);
        setAreaId("");
        setPropertyTypes([]);
        setPropertyTypeId("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load areas.");
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };
    loadAreas();
  }, [cityId]);

  // Load property types on area change
  useEffect(() => {
    if (!areaId) { setPropertyTypes([]); setPropertyTypeId(""); return; }
    const loadTypes = async () => {
      try {
        setLoadingPropertyTypes(true);
        const data = await getPropertyTypesByArea(areaId);
        setPropertyTypes(Array.isArray(data) ? data : []);
        setPropertyTypeId("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load property types.");
        setPropertyTypes([]);
      } finally {
        setLoadingPropertyTypes(false);
      }
    };
    loadTypes();
  }, [areaId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!cityId) return setError("Please select a city.");
    if (!areaId) return setError("Please select an area.");
    if (!propertyTypeId) return setError("Please select a property type.");
    if (!formData.title.trim()) return setError("Please enter property title.");
    if (!formData.price || Number(formData.price) <= 0) return setError("Price must be greater than 0.");
    if (!formData.area || Number(formData.area) <= 0) return setError("Area must be greater than 0.");

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        price: Number(formData.price),
        area: Number(formData.area),
        bhk: formData.bhk ? Number(formData.bhk) : null,
        cityId: Number(cityId),
        areaId: Number(areaId),
        propertyTypeId: Number(propertyTypeId),
        furnished: formData.furnished || null,
        parking: formData.parking,
        facing: formData.facing.trim() || null,
        readyToMove: formData.readyToMove,
        newProject: formData.newProject,
        resale: formData.resale,
        description: formData.description.trim() || null,
      };
      const response = await createProperty(payload);
      setCreatedProperty(response);
      setCreatedPropertyId(response?.id);
      setSuccess("Property created successfully. You can now upload images.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen after creation
  if (createdPropertyId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate("/seller/dashboard")} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Property Created</h1>
            <p className="text-sm text-slate-500">Your property has been saved as a draft.</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle size={18} className="inline mr-2" />
          Property created successfully. ID: #{createdPropertyId}, Status: {createdProperty?.status || "DRAFT"}
        </div>

        {createdProperty && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Property</p>
                <h2 className="text-xl font-bold text-slate-900">{createdProperty.title || "Untitled"}</h2>
                <p className="text-sm text-slate-500 flex items-start gap-2 mt-1">
                  <MapPin size={16} className="mt-0.5" />
                  {createdProperty.areaName || "—"}, {createdProperty.city || "—"}
                </p>
              </div>
              <span className="mt-2 sm:mt-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                {createdProperty.status || "DRAFT"}
              </span>
            </div>
          </div>
        )}

        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <PropertyImageUpload propertyId={createdPropertyId} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/seller/dashboard")} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            Go to Dashboard
          </button>
          <button onClick={() => navigate(`/properties/${createdPropertyId}`)} className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            View Property <ArrowRight size={16} className="inline" />
          </button>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate("/seller/dashboard")} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Property</h1>
          <p className="text-sm text-slate-500">Create your property listing with accurate information.</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <MapPin size={20} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Property Location</h2>
              <p className="text-sm text-slate-500">Select City → Area → Property Type</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="City" required>
              <select value={cityId} onChange={(e) => setCityId(e.target.value)} disabled={loadingCities} className={selectClass}>
                <option value="">{loadingCities ? "Loading cities..." : "Select City"}</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
            <FormField label="Area" required>
              <select value={areaId} onChange={(e) => setAreaId(e.target.value)} disabled={!cityId || loadingAreas} className={selectClass}>
                <option value="">{!cityId ? "Select city first" : loadingAreas ? "Loading areas..." : "Select Area"}</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </FormField>
            <FormField label="Property Type" required>
              <select value={propertyTypeId} onChange={(e) => setPropertyTypeId(e.target.value)} disabled={!areaId || loadingPropertyTypes} className={selectClass}>
                <option value="">{!areaId ? "Select area first" : loadingPropertyTypes ? "Loading types..." : "Select Property Type"}</option>
                {propertyTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </FormField>
          </div>
        </section>

        {/* Basic Details */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Home size={20} className="text-slate-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Basic Details</h2>
              <p className="text-sm text-slate-500">Main information buyers need.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Property Title" required>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Spacious 2 BHK Flat" className={inputClass} />
              </FormField>
            </div>
            <FormField label="Price" required>
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="7500000" min="1" className={inputClass} />
            </FormField>
            <FormField label="Area (sq.ft)" required>
              <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="1200" min="1" step="0.01" className={inputClass} />
            </FormField>
            <FormField label="BHK">
              <input type="number" name="bhk" value={formData.bhk} onChange={handleChange} placeholder="2" min="0" className={inputClass} />
            </FormField>
            <FormField label="Furnished">
              <select name="furnished" value={formData.furnished} onChange={handleChange} className={selectClass}>
                <option value="">Select</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </FormField>
            <FormField label="Facing">
              <select name="facing" value={formData.facing} onChange={handleChange} className={selectClass}>
                <option value="">Select Facing</option>
                {["North","South","East","West","North-East","North-West","South-East","South-West"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
          </div>
        </section>

        {/* Options */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Property Options</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CheckboxOption name="parking" checked={formData.parking} onChange={handleChange} label="Parking" />
            <CheckboxOption name="readyToMove" checked={formData.readyToMove} onChange={handleChange} label="Ready to Move" />
            <CheckboxOption name="newProject" checked={formData.newProject} onChange={handleChange} label="New Project" />
            <CheckboxOption name="resale" checked={formData.resale} onChange={handleChange} label="Resale" />
          </div>
        </section>

        {/* Description */}
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Description</h2>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5}
            placeholder="Describe the property, nearby facilities, etc." className={inputClass} />
        </section>

        {/* Actions */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Ready to create your listing?</p>
              <p className="text-xs text-slate-500">Will be saved as draft – upload images and submit later.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate("/seller/dashboard")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                {loading ? "Creating..." : <>Create Property <ArrowRight size={16} className="inline" /></>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Reusable components
const FormField = ({ label, required, children }) => (
  <div>
    <label className="mb-1 block text-sm font-semibold text-slate-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
    {children}
  </div>
);

const CheckboxOption = ({ name, checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 p-2 hover:bg-slate-50 has-[:checked]:border-blue-200 has-[:checked]:bg-blue-50">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-blue-600" />
    <span className="text-sm font-semibold text-slate-700">{label}</span>
  </label>
);

const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100 disabled:cursor-not-allowed";