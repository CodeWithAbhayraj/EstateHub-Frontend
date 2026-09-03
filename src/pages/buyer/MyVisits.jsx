import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getMyVisits } from "../../api/visitApi";

function MyVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyVisits();

      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Visits error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your visits."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading visits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CalendarDays size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Visits
              </h1>

              <p className="mt-1 text-slate-500">
                Manage your scheduled property visits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {visits.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <CalendarDays
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No visits scheduled
            </h2>

            <p className="mt-2 text-slate-500">
              You don't have any property visits yet.
            </p>

            <Link
              to="/properties"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Find a Property
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-900">
                        Property Visit
                      </h2>

                      {visit.status && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {visit.status}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        <span>
                          {visit.visitDate || "Date not available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={17} />
                        <span>
                          {visit.visitTime || "Time not available"}
                        </span>
                      </div>

                      {visit.propertyId && (
                        <div className="flex items-center gap-2">
                          <MapPin size={17} />
                          <span>
                            Property ID: {visit.propertyId}
                          </span>
                        </div>
                      )}
                    </div>

                    {visit.remarks && (
                      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                        {visit.remarks}
                      </p>
                    )}
                  </div>

                  {visit.propertyId && (
                    <Link
                      to={`/properties/${visit.propertyId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      <Eye size={17} />
                      View Property
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyVisits;