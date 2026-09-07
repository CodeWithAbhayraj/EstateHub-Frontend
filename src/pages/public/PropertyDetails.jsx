import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle,
  Edit,
  Heart,
  Home,
  IndianRupee,
  MapPin,
  Ruler,
  ShieldCheck,
  X,
} from "lucide-react";

import { getPropertyById } from "../../api/propertyApi";

import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../../api/favoriteApi";

import LeadForm from "../../components/lead/LeadForm";
import VisitForm from "../../components/visit/VisitForm";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // AUTH DATA
  // ==========================================

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const role = user?.role
    ?.replace("ROLE_", "")
    ?.trim()
    ?.toUpperCase();

  const isBuyer = role === "BUYER";
  const isSeller = role === "SELLER";
  const isAdmin =
    role === "ADMIN" || role === "SUPER_ADMIN";

  // ==========================================
  // STATES
  // ==========================================

  const [property, setProperty] = useState(null);
  const [favorite, setFavorite] = useState(false);

  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const [showLeadForm, setShowLeadForm] =
    useState(false);

  const [showVisitForm, setShowVisitForm] =
    useState(false);

  const [leadId, setLeadId] = useState(null);

  const [leadSuccess, setLeadSuccess] = useState("");
  const [visitSuccess, setVisitSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROPERTY
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPropertyById(id);

        setProperty(data);

        // ======================================
        // FAVORITE STATUS
        // ONLY BUYER
        // ======================================

        if (isBuyer) {
          try {
            const favoriteStatus =
              await isFavorite(id);

            setFavorite(
              Boolean(favoriteStatus)
            );
          } catch (favoriteError) {
            console.log(
              "Favorite status unavailable"
            );

            setFavorite(false);
          }
        } else {
          setFavorite(false);
        }
      } catch (err) {
        console.error(
          "Property details error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load property details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isBuyer]);

  // ==========================================
  // PRICE FORMAT
  // ==========================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // FAVORITE
  // BUYER ONLY
  // ==========================================

  const handleFavorite = async () => {
    if (!isBuyer) {
      return;
    }

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
      console.error(
        "Favorite error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // ==========================================
  // LEAD SUCCESS
  // ==========================================

  const handleLeadSuccess = (response) => {
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

  // ==========================================
  // VISIT SUCCESS
  // ==========================================

  const handleVisitSuccess = (response) => {
    setVisitSuccess(
      response?.message ||
        "Your property visit has been scheduled successfully."
    );

    setShowVisitForm(false);
  };

  // ==========================================
  // OPEN VISIT FORM
  // ==========================================

  const openVisitForm = () => {
    setVisitSuccess("");
    setError("");

    if (!isBuyer) {
      return;
    }

    if (!leadId) {
      setError(
        "Please submit an enquiry first, then schedule a visit."
      );

      setShowLeadForm(true);

      return;
    }

    setShowVisitForm(true);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-600">
          Loading property...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">

          <p className="mb-4 text-red-600">
            {error}
          </p>

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

  if (!property) {
    return null;
  }

  // ==========================================
  // PROPERTY STATUS
  // ==========================================

  const propertyStatus =
    property.status
      ?.replaceAll("_", " ")
      ?.toUpperCase();

  const isDraft =
    property.status === "DRAFT";

  const isPending =
    property.status === "PENDING_APPROVAL";

  const isPublished =
    property.status === "PUBLISHED";

  // ==========================================
  // SELLER OWNERSHIP
  // ==========================================

  const propertySellerId =
    property.sellerId ??
    property.seller?.id ??
    null;

  const currentUserId =
    user?.userId ??
    user?.id ??
    null;

  const isOwnProperty =
    isSeller &&
    propertySellerId !== null &&
    currentUserId !== null &&
    String(propertySellerId) ===
      String(currentUserId);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to Properties
          </button>

        </div>

      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            SUCCESS MESSAGES
        ========================================== */}

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

        {/* ==========================================
            PROPERTY GALLERY
        ========================================== */}

        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="relative h-[420px] bg-slate-100">

            {property.images?.length > 0 ? (
              <img
                src={property.images[0]}
                alt={
                  property.title ||
                  "Property"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">

                <div className="text-center text-slate-400">

                  <Home
                    size={48}
                    className="mx-auto mb-3"
                  />

                  <p>
                    No Image Available
                  </p>

                </div>

              </div>
            )}

            {/* ======================================
                FAVORITE
                BUYER ONLY
            ====================================== */}

            {isBuyer && (
              <button
                onClick={handleFavorite}
                disabled={favoriteLoading}
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105 disabled:opacity-50"
                aria-label="Toggle favorite"
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
            )}

            {/* ======================================
                STATUS
            ====================================== */}

            {property.status && (
              <span className="absolute left-5 top-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {propertyStatus}
              </span>
            )}

          </div>

          {/* ==========================================
              ADDITIONAL IMAGES
          ========================================== */}

          {property.images?.length > 1 && (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">

              {property.images
                .slice(1, 5)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title || "Property"} ${index + 2}`}
                    className="h-24 w-full rounded-xl object-cover"
                  />
                ))}

            </div>
          )}

        </div>

        {/* ==========================================
            MAIN GRID
        ========================================== */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ==========================================
              MAIN CONTENT
          ========================================== */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              {/* TITLE */}

              <div className="mb-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                      {property.title ||
                        "Untitled Property"}
                    </h1>

                    <div className="mt-3 flex items-center gap-2 text-slate-500">

                      <MapPin size={18} />

                      <span>
                        {property.areaName ||
                          "Unknown Area"}
                        ,{" "}
                        {property.city ||
                          "Unknown City"}
                      </span>

                    </div>

                  </div>

                  {/* SELLER EDIT */}

                  {isOwnProperty && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/seller/properties/${property.id}/edit`
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Edit size={17} />
                      Edit Property
                    </button>
                  )}

                </div>

              </div>

              {/* PRICE */}

              <div className="mb-8 flex items-center gap-2">

                <IndianRupee
                  size={26}
                  className="text-green-600"
                />

                <span className="text-3xl font-bold text-slate-900">
                  {formatPrice(property.price)}
                </span>

              </div>

              {/* FEATURES */}

              <div className="grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-4">

                {property.bhk !== null &&
                  property.bhk !== undefined && (
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

                {property.area !== null &&
                  property.area !== undefined && (
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

              {/* DESCRIPTION */}

              <div className="mt-8">

                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Description
                </h2>

                <p className="leading-7 text-slate-600">
                  {property.description ||
                    "No description available for this property."}
                </p>

              </div>

              {/* PROPERTY DETAILS */}

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
                      {property.furnished ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-400">
                      Facing
                    </p>

                    <p className="mt-1 font-semibold">
                      {property.facing ||
                        "Not specified"}
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
                      {property.resale
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              RIGHT SIDEBAR
          ========================================== */}

          <div>

            {isBuyer ? (
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

                <button
                  onClick={openVisitForm}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Schedule Visit
                </button>

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
            ) : (
              <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">

                {isSeller && (
                  <>
                    <p className="text-sm font-semibold text-slate-500">
                      Seller Property
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {isDraft
                        ? "Draft Property"
                        : isPending
                        ? "Pending Approval"
                        : isPublished
                        ? "Published Property"
                        : propertyStatus}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Manage your property from the Seller Dashboard.
                    </p>

                    {isOwnProperty && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/seller/properties/${property.id}/edit`
                          )
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Edit size={17} />
                        Edit Property
                      </button>
                    )}
                  </>
                )}

                {isAdmin && (
                  <>
                    <p className="text-sm font-semibold text-slate-500">
                      Administration
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900">
                      Property Management
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Use the Admin Dashboard to verify and manage this property.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/admin/properties")
                      }
                      className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                      Manage Properties
                    </button>
                  </>
                )}

                {!token && (
                  <>
                    <p className="text-sm font-semibold text-slate-500">
                      Interested in this property?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Login as a Buyer to save properties,
                      contact the agent and schedule visits.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                      Login as Buyer
                    </button>
                  </>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ==========================================
          BUYER LEAD MODAL
      ========================================== */}

      {isBuyer && showLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            <button
              onClick={() =>
                setShowLeadForm(false)
              }
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
                onClose={() =>
                  setShowLeadForm(false)
                }
              />

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          BUYER VISIT MODAL
      ========================================== */}

      {isBuyer && showVisitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            <button
              onClick={() =>
                setShowVisitForm(false)
              }
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
                onClose={() =>
                  setShowVisitForm(false)
                }
              />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default PropertyDetails;