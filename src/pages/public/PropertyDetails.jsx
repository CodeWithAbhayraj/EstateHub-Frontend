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

import PropertyGallery from "../../components/property/PropertyGallery";
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
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
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
    role === "ADMIN" ||
    role === "SUPER_ADMIN";

  const currentUserId =
    user?.id ??
    user?.userId ??
    null;

  // ==========================================
  // STATES
  // ==========================================

  const [property, setProperty] =
    useState(null);

  const [favorite, setFavorite] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const [showLeadForm, setShowLeadForm] =
    useState(false);

  const [showVisitForm, setShowVisitForm] =
    useState(false);

  const [leadId, setLeadId] =
    useState(null);

  const [leadSuccess, setLeadSuccess] =
    useState("");

  const [visitSuccess, setVisitSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH PROPERTY
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPropertyById(id);

        setProperty(data);

        // Buyer only
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

    return `₹${Number(
      price
    ).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) {
      return "";
    }

    return String(status)
      .replaceAll("_", " ");
  };

  // ==========================================
  // PROPERTY STATE
  // ==========================================

  const propertyStatus =
    property?.status;

  const isDraft =
    propertyStatus === "DRAFT";

  const isPending =
    propertyStatus ===
    "PENDING_APPROVAL";

  const isPublished =
    propertyStatus === "PUBLISHED";

  const isRejected =
    propertyStatus === "REJECTED";

  // ==========================================
  // OWNER
  // ==========================================

  const propertySellerId =
    property?.sellerId ??
    property?.seller?.id ??
    null;

  const isOwnProperty =
    isSeller &&
    propertySellerId !== null &&
    currentUserId !== null &&
    String(propertySellerId) ===
      String(currentUserId);

  // ==========================================
  // FAVORITE
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
  // LEAD
  // ==========================================

  const handleLeadSuccess = (
    response
  ) => {
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

    setError("");
    setShowLeadForm(false);
  };

  // ==========================================
  // VISIT
  // ==========================================

  const handleVisitSuccess = (
    response
  ) => {
    setVisitSuccess(
      response?.message ||
        "Your property visit has been scheduled successfully."
    );

    setError("");
    setShowVisitForm(false);
  };

  // ==========================================
  // OPEN LEAD FORM
  // ==========================================

  const openLeadForm = () => {
    if (!isBuyer) {
      return;
    }

    setLeadSuccess("");
    setError("");
    setShowLeadForm(true);
  };

  // ==========================================
  // OPEN VISIT FORM
  // ==========================================

  const openVisitForm = () => {
    if (!isBuyer) {
      return;
    }

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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading property...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !property) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <Home
              size={26}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Property unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>

      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          TOP BAR
      ========================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            <span className="hidden xs:inline">
              Back
            </span>
            <span className="sm:hidden">
              Back
            </span>
          </button>

          {isOwnProperty && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/seller/properties/${property.id}/edit`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Edit size={16} />
              <span className="hidden sm:inline">
                Edit Property
              </span>
              <span className="sm:hidden">
                Edit
              </span>
            </button>
          )}

        </div>

      </header>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ==========================================
            ALERTS
        ========================================== */}

        {leadSuccess && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle
              size={19}
              className="mt-0.5 shrink-0"
            />
            <span>{leadSuccess}</span>
          </div>
        )}

        {visitSuccess && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CalendarDays
              size={19}
              className="mt-0.5 shrink-0"
            />
            <span>{visitSuccess}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* ==========================================
            GALLERY
        ========================================== */}

        <PropertyGallery
          images={property.images}
          title={
            property.title ||
            "Property"
          }
        />


        {/* ==========================================
            DETAILS + SIDEBAR
        ========================================== */}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">

          {/* ========================================
              PROPERTY CONTENT
          ======================================== */}

          <section className="min-w-0">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              {/* TITLE */}

              <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                      {property.title ||
                        "Untitled Property"}
                    </h1>

                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-500 sm:text-base">

                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span>
                        {property.areaName ||
                          "Unknown Area"}
                        ,{" "}
                        {property.city ||
                          "Unknown City"}
                      </span>

                    </div>

                  </div>


                  {property.status && (
                    <span
                      className={`
                        w-fit
                        shrink-0
                        rounded-full
                        px-3
                        py-1.5
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wide

                        ${
                          isPublished
                            ? "bg-green-50 text-green-700"
                            : isPending
                            ? "bg-amber-50 text-amber-700"
                            : isRejected
                            ? "bg-red-50 text-red-700"
                            : isDraft
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-100 text-slate-600"
                        }
                      `}
                    >
                      {formatStatus(
                        property.status
                      )}
                    </span>
                  )}

                </div>


                {/* PRICE */}

                <div className="flex items-center gap-1.5">

                  <IndianRupee
                    size={23}
                    className="text-green-600"
                  />

                  <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {formatPrice(
                      property.price
                    )}
                  </span>

                </div>

              </div>


              {/* ==================================
                  QUICK DETAILS
              ================================== */}

              <div className="mt-7 grid grid-cols-2 gap-3 border-y border-slate-200 py-6 sm:grid-cols-4 sm:gap-4">

                {property.bhk !== null &&
                  property.bhk !== undefined && (
                    <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">

                      <BedDouble
                        size={19}
                        className="text-blue-600"
                      />

                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        BHK
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800 sm:text-base">
                        {property.bhk}
                      </p>

                    </div>
                  )}


                {property.area !== null &&
                  property.area !== undefined && (
                    <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">

                      <Ruler
                        size={19}
                        className="text-blue-600"
                      />

                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Area
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800 sm:text-base">
                        {property.area} sq.ft
                      </p>

                    </div>
                  )}


                {property.propertyType && (
                  <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">

                    <Home
                      size={19}
                      className="text-blue-600"
                    />

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800 sm:text-base">
                      {property.propertyType}
                    </p>

                  </div>
                )}


                <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">

                  <Car
                    size={19}
                    className="text-blue-600"
                  />

                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Parking
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800 sm:text-base">
                    {property.parking
                      ? "Available"
                      : "No"}
                  </p>

                </div>

              </div>


              {/* ==================================
                  DESCRIPTION
              ================================== */}

              <section className="mt-8">

                <h2 className="text-xl font-bold text-slate-900">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {property.description ||
                    "No description available for this property."}
                </p>

              </section>


              {/* ==================================
                  PROPERTY DETAILS
              ================================== */}

              <section className="mt-9">

                <h2 className="text-xl font-bold text-slate-900">
                  Property Details
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="Furnished"
                    value={
                      property.furnished ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Facing"
                    value={
                      property.facing ||
                      "Not specified"
                    }
                  />

                  <DetailItem
                    label="Ready To Move"
                    value={
                      property.readyToMove
                        ? "Yes"
                        : "No"
                    }
                  />

                  <DetailItem
                    label="New Project"
                    value={
                      property.newProject
                        ? "Yes"
                        : "No"
                    }
                  />

                  <DetailItem
                    label="Resale"
                    value={
                      property.resale
                        ? "Yes"
                        : "No"
                    }
                  />

                </div>

              </section>


              {/* ==================================
                  REJECTION
              ================================== */}

              {isRejected &&
                property.rejectionReason && (
                  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">

                    <p className="text-[11px] font-bold uppercase tracking-wide text-red-500">
                      Rejection Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-red-700">
                      {property.rejectionReason}
                    </p>

                  </div>
                )}

            </div>

          </section>


          {/* ========================================
              SIDEBAR
          ======================================== */}

          <aside className="min-w-0">

            {/* ======================================
                BUYER
            ====================================== */}

            {isBuyer && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                    <ShieldCheck
                      size={22}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Interested in this property?
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Connect with our agent to know more.
                    </p>

                  </div>

                </div>


                {/* FAVORITE */}

                <button
                  type="button"
                  onClick={
                    handleFavorite
                  }
                  disabled={
                    favoriteLoading
                  }
                  className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Heart
                    size={18}
                    className={
                      favorite
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600"
                    }
                  />

                  {favorite
                    ? "Saved to Favorites"
                    : "Save to Favorites"}

                </button>


                {/* CONTACT */}

                <button
                  type="button"
                  onClick={
                    openLeadForm
                  }
                  className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                >
                  Contact Agent
                </button>


                {/* VISIT */}

                <button
                  type="button"
                  onClick={
                    openVisitForm
                  }
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <CalendarDays size={17} />
                  Schedule Visit
                </button>


                {/* LEAD STATUS */}

                {leadId && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

                    <div className="flex items-center gap-2 text-green-700">

                      <CheckCircle size={18} />

                      <span className="text-sm font-semibold">
                        Enquiry submitted
                      </span>

                    </div>

                    <p className="mt-1 text-xs leading-5 text-green-600">
                      You can now schedule a property visit.
                    </p>

                  </div>
                )}

              </div>
            )}


            {/* ======================================
                SELLER
            ====================================== */}

            {isSeller && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">

                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Seller Property
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {isDraft
                    ? "Draft Property"
                    : isPending
                    ? "Pending Approval"
                    : isPublished
                    ? "Published Property"
                    : isRejected
                    ? "Rejected Property"
                    : "Property"}
                </h3>

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
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Edit size={17} />
                    Edit Property
                  </button>
                )}

                {isDraft &&
                  isOwnProperty && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">

                      <p className="text-xs font-semibold leading-5 text-amber-700">
                        Upload at least 5 images and submit this property for approval.
                      </p>

                    </div>
                  )}

              </div>
            )}


            {/* ======================================
                ADMIN
            ====================================== */}

            {isAdmin && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">

                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Administration
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  Property Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review and manage this property from the Admin Dashboard.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/properties"
                    )
                  }
                  className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Manage Property
                </button>

              </div>
            )}


            {/* ======================================
                GUEST
            ====================================== */}

            {!token && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">

                  <Home
                    size={21}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Interested in this property?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Login as a Buyer to save this property, contact the agent and schedule a visit.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Login as Buyer
                </button>

              </div>
            )}

          </aside>

        </div>

      </main>


      {/* ==========================================
          LEAD MODAL
      ========================================== */}

      {isBuyer &&
        showLeadForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setShowLeadForm(
                    false
                  )
                }
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close lead form"
              >
                <X size={18} />
              </button>

              <div className="pr-10">

                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Contact Agent
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Send your enquiry for this property.
                </p>

              </div>

              <div className="mt-6">

                <LeadForm
                  propertyId={id}
                  onSuccess={
                    handleLeadSuccess
                  }
                  onClose={() =>
                    setShowLeadForm(
                      false
                    )
                  }
                />

              </div>

            </div>

          </div>
        )}


      {/* ==========================================
          VISIT MODAL
      ========================================== */}

      {isBuyer &&
        showVisitForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">

              <button
                type="button"
                onClick={() =>
                  setShowVisitForm(
                    false
                  )
                }
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close visit form"
              >
                <X size={18} />
              </button>

              <div className="pr-10">

                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
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
                  onSuccess={
                    handleVisitSuccess
                  }
                  onClose={() =>
                    setShowVisitForm(
                      false
                    )
                  }
                />

              </div>

            </div>

          </div>
        )}

    </div>
  );
}


// ==========================================
// DETAIL ITEM
// ==========================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default PropertyDetails;