import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, CalendarDays, Car, CheckCircle, Edit, Heart, Home, IndianRupee, MapPin, Ruler, ShieldCheck, X } from "lucide-react";
import { getPropertyById } from "../../api/propertyApi";
import { addFavorite, isFavorite, removeFavorite } from "../../api/favoriteApi";
import PropertyGallery from "../../components/property/PropertyGallery";
import LeadForm from "../../components/lead/LeadForm";
import VisitForm from "../../components/visit/VisitForm";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  let user = null;
  try { user = savedUser ? JSON.parse(savedUser) : null; } catch {}
  const role = user?.role?.replace("ROLE_", "")?.trim()?.toUpperCase();
  const isBuyer = role === "BUYER";
  const isSeller = role === "SELLER";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const currentUserId = user?.id || user?.userId || null;

  const [property, setProperty] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [leadSuccess, setLeadSuccess] = useState("");
  const [visitSuccess, setVisitSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
        if (isBuyer) {
          try {
            const fav = await isFavorite(id);
            setFavorite(Boolean(fav));
          } catch { setFavorite(false); }
        } else setFavorite(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, isBuyer]);

  const formatPrice = (price) => price ? `₹${Number(price).toLocaleString("en-IN")}` : "Price on request";
  const formatStatus = (s) => s?.replace("_", " ") || "";
  const propertyStatus = property?.status;
  const isDraft = propertyStatus === "DRAFT";
  const isPending = propertyStatus === "PENDING_APPROVAL";
  const isPublished = propertyStatus === "PUBLISHED";
  const isRejected = propertyStatus === "REJECTED";
  const propertySellerId = property?.sellerId || property?.seller?.id || null;
  const isOwnProperty = isSeller && propertySellerId && currentUserId && String(propertySellerId) === String(currentUserId);

  const handleFavorite = async () => {
    if (!isBuyer) return;
    try {
      setFavoriteLoading(true);
      if (favorite) {
        await removeFavorite(id);
        setFavorite(false);
      } else {
        await addFavorite(id);
        setFavorite(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update favorite.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleLeadSuccess = (response) => {
    const newLeadId = response?.id || response?.leadId || response?.data?.id || response?.data?.leadId;
    if (newLeadId) setLeadId(newLeadId);
    setLeadSuccess(response?.message || "Enquiry submitted successfully.");
    setShowLeadForm(false);
  };

  const handleVisitSuccess = (response) => {
    setVisitSuccess(response?.message || "Visit scheduled successfully.");
    setShowVisitForm(false);
  };

  const openLeadForm = () => {
    if (!isBuyer) return;
    setShowLeadForm(true);
  };

  const openVisitForm = () => {
    if (!isBuyer) return;
    if (!leadId) {
      setError("Please submit an enquiry first, then schedule a visit.");
      setShowLeadForm(true);
      return;
    }
    setShowVisitForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          <p className="mt-3 text-sm text-slate-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Home size={32} className="mx-auto text-red-400" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Property unavailable</h1>
          <p className="text-sm text-slate-500">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft size={18} /> Back
          </button>
          {isOwnProperty && (
            <button onClick={() => navigate(`/seller/properties/${property.id}/edit`)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">
              <Edit size={16} /> Edit
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {leadSuccess && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle size={18} className="inline mr-2" />{leadSuccess}</div>}
        {visitSuccess && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CalendarDays size={18} className="inline mr-2" />{visitSuccess}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {/* Gallery */}
        <PropertyGallery images={property.images} title={property.title} />

        {/* Details + Sidebar */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{property.title || "Untitled"}</h1>
                <div className="mt-1 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{property.areaName || "Unknown"}, {property.city || "Unknown"}</span>
                </div>
              </div>
              {property.status && (
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${isPublished ? "bg-green-100 text-green-700" : isPending ? "bg-amber-100 text-amber-700" : isRejected ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                  {formatStatus(property.status)}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <IndianRupee size={20} className="text-green-600" />
              <span className="text-2xl font-bold text-slate-900">{formatPrice(property.price)}</span>
            </div>

            {/* Quick Details */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-y border-slate-200 py-4">
              {property.bhk != null && (
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <BedDouble size={18} className="mx-auto text-blue-600" />
                  <p className="text-xs text-slate-400">BHK</p>
                  <p className="font-bold">{property.bhk}</p>
                </div>
              )}
              {property.area != null && (
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Ruler size={18} className="mx-auto text-blue-600" />
                  <p className="text-xs text-slate-400">Area</p>
                  <p className="font-bold">{property.area} sq.ft</p>
                </div>
              )}
              {property.propertyType && (
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <Home size={18} className="mx-auto text-blue-600" />
                  <p className="text-xs text-slate-400">Type</p>
                  <p className="font-bold text-sm truncate">{property.propertyType}</p>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <Car size={18} className="mx-auto text-blue-600" />
                <p className="text-xs text-slate-400">Parking</p>
                <p className="font-bold">{property.parking ? "Yes" : "No"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-slate-900">Description</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 whitespace-pre-line">
                {property.description || "No description available."}
              </p>
            </div>

            {/* Property Details */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-slate-900">Property Details</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <DetailItem label="Furnished" value={property.furnished || "Not specified"} />
                <DetailItem label="Facing" value={property.facing || "Not specified"} />
                <DetailItem label="Ready to Move" value={property.readyToMove ? "Yes" : "No"} />
                <DetailItem label="New Project" value={property.newProject ? "Yes" : "No"} />
                <DetailItem label="Resale" value={property.resale ? "Yes" : "No"} />
              </div>
            </div>

            {isRejected && property.rejectionReason && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-bold uppercase text-red-500">Rejection Reason</p>
                <p className="text-sm text-red-700">{property.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {isBuyer && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Interested in this property?</h3>
                    <p className="text-sm text-slate-500">Connect with our agent to know more.</p>
                  </div>
                </div>
                <button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Heart size={18} className={favorite ? "fill-red-500 text-red-500" : ""} />
                  {favorite ? "Saved to Favorites" : "Save to Favorites"}
                </button>
                <button onClick={openLeadForm} className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                  Contact Agent
                </button>
                <button onClick={openVisitForm} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <CalendarDays size={16} /> Schedule Visit
                </button>
                {leadId && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle size={16} className="inline mr-1" /> Enquiry submitted – you can now schedule a visit.
                  </div>
                )}
              </div>
            )}

            {isSeller && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
                <p className="text-xs font-bold uppercase text-slate-400">Seller Property</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {isDraft ? "Draft" : isPending ? "Pending Approval" : isPublished ? "Published" : isRejected ? "Rejected" : "Property"}
                </h3>
                <p className="text-sm text-slate-500">Manage from Seller Dashboard.</p>
                {isOwnProperty && (
                  <button onClick={() => navigate(`/seller/properties/${property.id}/edit`)} className="mt-4 flex w-full items-center justify-center rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    <Edit size={16} className="mr-1" /> Edit Property
                  </button>
                )}
                {isDraft && isOwnProperty && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    Upload at least 5 images and submit for approval.
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
                <p className="text-xs font-bold uppercase text-slate-400">Administration</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Property Management</h3>
                <p className="text-sm text-slate-500">Review from Admin Dashboard.</p>
                <button onClick={() => navigate("/admin/properties")} className="mt-4 flex w-full items-center justify-center rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Manage Property
                </button>
              </div>
            )}

            {!token && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Home size={20} />
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">Interested?</h3>
                <p className="text-sm text-slate-500">Login as a Buyer to save, contact, and schedule a visit.</p>
                <button onClick={() => navigate("/login")} className="mt-4 flex w-full items-center justify-center rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Login as Buyer
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Modals */}
      {isBuyer && showLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLeadForm(false)}>
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowLeadForm(false)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-900">Contact Agent</h2>
            <p className="text-sm text-slate-500">Send your enquiry for this property.</p>
            <div className="mt-4">
              <LeadForm propertyId={id} onSuccess={handleLeadSuccess} onClose={() => setShowLeadForm(false)} />
            </div>
          </div>
        </div>
      )}

      {isBuyer && showVisitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowVisitForm(false)}>
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVisitForm(false)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-900">Schedule Visit</h2>
            <p className="text-sm text-slate-500">Choose your preferred date and time.</p>
            <div className="mt-4">
              <VisitForm propertyId={id} leadId={leadId} onSuccess={handleVisitSuccess} onClose={() => setShowVisitForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}