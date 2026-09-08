import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Eye, RefreshCw, ArrowRight, CheckCircle } from "lucide-react";
import { getMyVisits } from "../../api/visitApi";

export default function MyVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadVisits = async (showFullLoader = true) => {
    try {
      if (showFullLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getMyVisits();
      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load visits.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadVisits(); }, []);

  const handleRefresh = async () => loadVisits(false);

  const getStatusClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (["CONFIRMED", "APPROVED"].includes(s)) return "bg-green-100 text-green-700";
    if (s === "PENDING") return "bg-amber-100 text-amber-700";
    if (s === "COMPLETED") return "bg-blue-100 text-blue-700";
    if (["CANCELLED", "REJECTED"].includes(s)) return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          <p className="mt-3 text-sm text-slate-500">Loading visits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={24} className="text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Visits</h1>
            <p className="text-sm text-slate-500">Manage your scheduled property visits.</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {visits.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center">
          <CalendarDays size={40} className="text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">No visits scheduled</h3>
          <p className="text-sm text-slate-500">Find a property and schedule a visit.</p>
          <Link to="/properties" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Find a Property <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div key={visit.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-slate-500" />
                      <h2 className="text-lg font-bold text-slate-900">Visit #{visit.id}</h2>
                    </div>
                    {visit.status && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusClass(visit.status)}`}>
                        {visit.status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="font-semibold">{visit.visitDate || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Time</p>
                      <p className="font-semibold">{visit.visitTime || "N/A"}</p>
                    </div>
                    {visit.propertyId && (
                      <div className="col-span-2">
                        <p className="text-xs text-slate-400">Property</p>
                        <p className="font-semibold">#{visit.propertyId}</p>
                      </div>
                    )}
                  </div>
                  {visit.remarks && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      <p className="text-xs font-bold uppercase text-slate-400">Remarks</p>
                      <p>{visit.remarks}</p>
                    </div>
                  )}
                  {visit.status?.toUpperCase() === "COMPLETED" && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle size={16} /> Visit completed
                    </div>
                  )}
                </div>
                {visit.propertyId && (
                  <Link to={`/properties/${visit.propertyId}`} className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    <Eye size={16} className="inline mr-1" /> View Property <ArrowRight size={14} className="inline" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}