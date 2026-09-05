import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getMyProperties } from "../../api/propertyApi";

function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName =
    localStorage.getItem("name") || "Seller";

  // ==========================================
  // LOAD SELLER PROPERTIES
  // ==========================================

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProperties();

      setProperties(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Seller properties error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // ==========================================
  // COUNTS
  // ==========================================

  const totalProperties = properties.length;

  const draftProperties = properties.filter(
    (property) =>
      property.status === "DRAFT"
  ).length;

  const pendingProperties = properties.filter(
    (property) =>
      property.status === "PENDING_APPROVAL"
  ).length;

  const publishedProperties = properties.filter(
    (property) =>
      property.status === "PUBLISHED"
  ).length;

  const rejectedProperties = properties.filter(
    (property) =>
      property.status === "REJECTED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <p className="text-sm font-medium text-slate-500">
            EstateHub Seller
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {userName}!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your properties and track their approval status.
          </p>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            QUICK ACTION
        ========================================== */}

        <div className="mb-6">

          <Link
            to="/seller/properties/add"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Property
          </Link>

        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Building2 className="text-blue-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Total
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {totalProperties}
                </p>

              </div>

            </div>

          </div>

          {/* Draft */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Clock className="text-slate-500" />

              <div>

                <p className="text-sm text-slate-500">
                  Draft
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {draftProperties}
                </p>

              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <Clock className="text-yellow-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  {pendingProperties}
                </p>

              </div>

            </div>

          </div>

          {/* Published */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <CheckCircle className="text-green-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Published
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {publishedProperties}
                </p>

              </div>

            </div>

          </div>

          {/* Rejected */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <XCircle className="text-red-600" />

              <div>

                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {rejectedProperties}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            RECENT PROPERTIES
        ========================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 p-5">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                My Properties
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest property listings.
              </p>

            </div>

            <Link
              to="/seller/properties"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View All
              <ArrowRight size={16} />
            </Link>

          </div>

          {loading ? (

            <div className="flex min-h-48 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                <p className="text-sm text-slate-500">
                  Loading properties...
                </p>

              </div>

            </div>

          ) : properties.length === 0 ? (

            <div className="p-12 text-center">

              <Building2
                size={42}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="text-lg font-bold text-slate-900">
                No properties yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first property.
              </p>

              <Link
                to="/seller/properties/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={17} />
                Add Property
              </Link>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {properties.slice(0, 5).map((property) => (

                <div
                  key={property.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

                      <Building2
                        size={21}
                        className="text-slate-600"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {property.title ||
                          "Untitled Property"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {property.areaName || "—"},{" "}
                        {property.city || "—"}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {property.status || "UNKNOWN"}
                    </span>

                    <Link
                      to={`/properties/${property.id}`}
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                      View
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ==========================================
            SELLER FLOW
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Property Listing Process
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                STEP 1
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Add Property
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                STEP 2
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Submit for Approval
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                STEP 3
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Admin Verification
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                STEP 4
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Property Goes Live
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SellerDashboard;