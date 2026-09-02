import { useAuth } from "../../context/AuthContext";

function BuyerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Buyer Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome, {user?.name || "Buyer"}!
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Browse Properties</h2>
            <p className="mt-2 text-sm text-slate-500">
              Find your perfect property.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">My Leads</h2>
            <p className="mt-2 text-sm text-slate-500">
              Track your property enquiries.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">My Visits</h2>
            <p className="mt-2 text-sm text-slate-500">
              View your scheduled property visits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;