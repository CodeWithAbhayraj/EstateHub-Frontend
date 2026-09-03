import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  ParkingSquare,
  Ruler,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getPropertyById } from "../../api/propertyApi";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../../api/favoriteApi";

import LeadForm from "../../components/lead/LeadForm";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [favorite, setFavorite] = useState(false);

  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [showLeadForm, setShowLeadForm] = useState(false);

  const [error, setError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPropertyById(id);
      setProperty(data);

      try {
        const favoriteStatus = await isFavorite(id);

        setFavorite(
          typeof favoriteStatus === "boolean"
            ? favoriteStatus
            : Boolean(favoriteStatus?.isFavorite)
        );
      } catch (favoriteError) {
        console.log(
          "Favorite status could not be loaded:",
          favoriteError
        );
      }
    } catch (err) {
      console.error("Property details error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load property details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setFavoriteLoading(true);
      setError("");

      if (favorite) {
        await removeFavorite(id);
        setFavorite(false);
      } else {
        await addFavorite(id);
        setFavorite(true);
      }
    } catch (err) {
      console.error("Favorite error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleLeadSuccess = () => {
    setLeadSuccess(
      "Your enquiry has been submitted successfully."
    );

    setShowLeadForm(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700">
            Property Not Found
          </h1>

          <p className="mt-2 text-red-600">{error}</p>

          <Link
            to="/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(property?.images)
    ? property.images
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {leadSuccess && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span>{leadSuccess}</span>

            <button
              type="button"
              onClick={() => setLeadSuccess("")}
              className="font-bold text-green-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Gallery */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-100">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={property?.title || "Property"}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center">
                <div className="text-center">
                  <Building2
                    size={60}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-slate-400">
                    No images available
                  </p>
                </div>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              {images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property ${index + 2}`}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </section>

        {/* Main Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Left */}
          <section className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {property?.status && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                        {property.status}
                      </span>
                    )}

                    {property?.newProject && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        New Project
                      </span>
                    )}

                    {property?.resale && (
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                        Resale
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    {property?.title || "Untitled Property"}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-slate-500">
                    <MapPin size={18} />

                    <span>
                      {property?.areaName || "Unknown Area"},{" "}
                      {property?.city || "Unknown City"}
                    </span>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-blue-600">
                    ₹
                    {Number(
                      property?.price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <Heart
                    size={23}
                    className={
                      favorite
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600"
                    }
                  />
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Property Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailItem
                  icon={BedDouble}
                  label="Bedrooms"
                  value={
                    property?.bhk
                      ? `${property.bhk} BHK`
                      : "Not specified"
                  }
                />

                <DetailItem
                  icon={Ruler}
                  label="Area"
                  value={
                    property?.area
                      ? `${property.area} sq.ft`
                      : "Not specified"
                  }
                />

                <DetailItem
                  icon={Home}
                  label="Property Type"
                  value={
                    property?.propertyType ||
                    "Not specified"
                  }
                />

                <DetailItem
                  icon={MapPin}
                  label="City"
                  value={
                    property?.city ||
                    "Not specified"
                  }
                />

                <DetailItem
                  icon={MapPin}
                  label="Area"
                  value={
                    property?.areaName ||
                    "Not specified"
                  }
                />

                <DetailItem
                  icon={ParkingSquare}
                  label="Parking"
                  value={
                    property?.parking
                      ? "Available"
                      : "Not Available"
                  }
                />
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Features
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Feature
                  label="Furnished"
                  value={property?.furnished}
                />

                <Feature
                  label="Ready to Move"
                  value={property?.readyToMove}
                />

                <Feature
                  label="New Project"
                  value={property?.newProject}
                />

                <Feature
                  label="Resale"
                  value={property?.resale}
                />

                <Feature
                  label="Facing"
                  value={
                    property?.facing || "Not specified"
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {property?.description ||
                  "No description available for this property."}
              </p>
            </div>
          </section>

          {/* Right */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Interested in this property?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Send an enquiry to EstateHub and our admin
                team will get in touch with you.
              </p>

              {/* Contact Agent */}
              <button
                type="button"
                onClick={() => {
                  setLeadSuccess("");
                  setShowLeadForm(true);
                }}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Contact Agent
              </button>

              {/* Schedule Visit */}
              <button
                type="button"
                className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-600 hover:bg-blue-100"
              >
                Schedule Visit
              </button>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 text-green-500"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Verified Listing
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      This property is published on EstateHub.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Lead Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLeadForm(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X size={20} />
            </button>

            <LeadForm
              propertyId={id}
              onSuccess={handleLeadSuccess}
              onClose={() => setShowLeadForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={17} />
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Feature({ label, value }) {
  const isBoolean = typeof value === "boolean";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
      <span className="text-sm font-medium text-slate-600">
        {label}
      </span>

      {isBoolean ? (
        <span
          className={
            value
              ? "font-semibold text-green-600"
              : "font-semibold text-slate-400"
          }
        >
          {value ? "Yes" : "No"}
        </span>
      ) : (
        <span className="font-semibold text-slate-900">
          {value}
        </span>
      )}
    </div>
  );
}

export default PropertyDetails;