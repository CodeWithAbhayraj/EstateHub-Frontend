import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle,
  Heart,
  Home,
  IndianRupee,
  MapPin,
  Ruler,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  getPropertyById,
} from "../../api/propertyApi";

import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../../api/favoriteApi";

import LeadForm from "../../components/lead/LeadForm";
import VisitForm from "../../components/visit/VisitForm";

function PropertyDetails() {
  const { id } = useParams();

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
        setError("");

        const data = await getPropertyById(id);
        setProperty(data);

        try {
          const favoriteStatus = await isFavorite(id);
          setFavorite(Boolean(favoriteStatus));
        } catch (favoriteError) {
          console.log("Favorite status unavailable");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load property details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const handleFavorite = async () => {
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
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleLeadSuccess = (response) => {
    /*
      Backend LeadResponse is expected to return the created lead.
      We keep the returned ID because Visit API requires leadId.
    */
    const createdLeadId =
      response?.id ??
      response?.leadId ??
      response?.data?.id ??
      response?.data?.leadId;

    if (createdLeadId) {
      setLeadId(createdLeadId);
    }

    setLeadSuccess(
      response?.message ||
        "Your enquiry has been submitted successfully."
    );

    setShowLeadForm(false);
  };

  const handleVisitSuccess = (response) => {
    setVisitSuccess(
      response?.message ||
        "Your property visit has been scheduled successfully."
    );

    setShowVisitForm(false);
  };

  const openVisitForm = () => {
    setVisitSuccess("");
    setError("");

    if (!leadId) {
      setError(
        "Please submit an enquiry first, then schedule a visit."
      );
      setShowLeadForm(true);
      return;
    }

    setShowVisitForm(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-600">
          Loading property...
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-slate-900 px-5 py-3 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Messages */}
        {leadSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle size={20} />
            <span>{leadSuccess}</span>
          </div>
        )}

        {visitSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CalendarDays size={20} />
            <span>{visitSuccess}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Property Gallery */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-[420px] bg-slate-100">
            {property.images?.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-slate-400">
                  <Home
                    size={48}
                    className="mx-auto mb-3"
                  />
                  <p>No Image Available</p>
                </div>
              </div>
            )}

            {/* Favorite */}
            <button
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105 disabled:opacity-50"
            >
              <Heart
                size={22}
                className={
                  favorite
                    ? "fill-red-500 text-red-500"
                    : "text-slate-700"
                }
              />
            </button>

            {/* Status */}
            {property.status && (
              <span className="absolute left-5 top-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {property.status}
              </span>
            )}
          </div>

          {/* Additional Images */}
          {property.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3 p-4">
              {property.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="h-24 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">
                  {property.title || "Untitled Property"}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-slate-500">
                  <MapPin size={18} />
                  <span>
                    {property.areaName || "Unknown Area"},{" "}
                    {property.city || "Unknown City"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 flex items-center gap-2">
                <IndianRupee
                  size={26}
                  className="text-green-600"
                />

                <span className="text-3xl font-bold text-slate-900">
                  {formatPrice(property.price)}
                </span>
              </div>

              {/* Main Features */}
              <div className="grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-4">
                {property.bhk && (
                  <div className="flex items-center gap-3">
                    <BedDouble
                      size={22}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs text-slate-400">
                        BHK
                      </p>
                      <p className="font-semibold">
                        {property.bhk}
                      </p>
                    </div>
                  </div>
                )}

                {property.area && (
                  <div className="flex items-center gap-3">
                    <Ruler
                      size={22}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs text-slate-400">
                        Area
                      </p>
                      <p className="font-semibold">
                        {property.area} sq.ft
                      </p>
                    </div>
                  </div>
                )}

                {property.propertyType && (
                  <div className="flex items-center gap-3">
                    <Home
                      size={22}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs text-slate-400">
                        Property Type
                      </p>
                      <p className="font-semibold">
                        {property.propertyType}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Car
                    size={22}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="text-xs text-slate-400">
                      Parking
                    </p>

                    <p className="font-semibold">
                      {property.parking
                        ? "Available"
                        : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Description
                </h2>

                <p className="leading-7 text-slate-600">
                  {property.description ||
                    "No description available for this property."}
                </p>
              </div>

              {/* Property Details */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Property Details
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      Furnished
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.furnished || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      Facing
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.facing || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      Ready To Move
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.readyToMove
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      New Project
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.newProject
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      Resale
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.resale ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <ShieldCheck
                    size={24}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Interested in this property?
                  </h3>

                  <p className="text-sm text-slate-500">
                    Contact our agent
                  </p>
                </div>
              </div>

              {/* Contact Agent */}
              <button
                onClick={() => {
                  setLeadSuccess("");
                  setError("");
                  setShowLeadForm(true);
                }}
                className="mb-3 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Contact Agent
              </button>

              {/* Schedule Visit */}
              <button
                onClick={openVisitForm}
                className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Schedule Visit
              </button>

              {/* Lead status */}
              {leadId && (
                <div className="mt-5 rounded-xl bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={18} />

                    <span className="text-sm font-medium">
                      Enquiry submitted
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-green-600">
                    You can now schedule a property visit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowLeadForm(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="pr-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Contact Agent
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Send your enquiry for this property.
              </p>
            </div>

            <div className="mt-6">
              <LeadForm
                propertyId={id}
                onSuccess={handleLeadSuccess}
                onClose={() => setShowLeadForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visit Modal */}
      {showVisitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowVisitForm(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="pr-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Schedule Property Visit
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose your preferred date and time.
              </p>
            </div>

            <div className="mt-6">
              <VisitForm
                propertyId={id}
                leadId={leadId}
                onSuccess={handleVisitSuccess}
                onClose={() => setShowVisitForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;