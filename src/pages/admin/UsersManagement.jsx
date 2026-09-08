import { useEffect, useMemo, useState } from "react";
import {
  Users,
  User,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Filter,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  getAllUsers,
  enableUser,
  disableUser,
} from "../../api/userApi";

// ---------------------------
// Role & Status Badges
// ---------------------------
const RoleBadge = ({ role }) => {
  const classes = {
    SUPER_ADMIN: "bg-violet-100 text-violet-700",
    ADMIN: "bg-blue-100 text-blue-700",
    SELLER: "bg-orange-100 text-orange-700",
    BUYER: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${classes[role] || "bg-slate-100 text-slate-600"}`}>
      {role?.replace("_", " ") || "USER"}
    </span>
  );
};

const StatusBadge = ({ enabled }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
    {enabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
    {enabled ? "Active" : "Disabled"}
  </span>
);

// ---------------------------
// Stat Card
// ---------------------------
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

// ---------------------------
// Main Component
// ---------------------------
export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch users
  const fetchUsers = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      setError("");
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchSearch =
        !term ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.mobile?.toLowerCase().includes(term) ||
        String(u.id).includes(term);
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.enabled) ||
        (statusFilter === "DISABLED" && !u.enabled);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Enable/Disable
  const toggleUser = async (id, enable) => {
    try {
      setActionId(id);
      setError("");
      setSuccess("");
      const updated = enable ? await enableUser(id) : await disableUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setSuccess(`User ${enable ? "enabled" : "disabled"} successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  // Stats
  const total = users.length;
  const active = users.filter((u) => u.enabled).length;
  const disabled = total - active;
  const buyers = users.filter((u) => u.role === "BUYER").length;
  const sellers = users.filter((u) => u.role === "SELLER").length;
  const admins = users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };
  const isFilterActive = search || roleFilter !== "ALL" || statusFilter !== "ALL";
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
              <p className="text-sm text-slate-500">Manage buyers, sellers and admins.</p>
            </div>
          </div>
          <button
            onClick={() => fetchUsers(false)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Stats */}
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total" value={total} icon={Users} color="bg-violet-50 text-violet-600" />
          <StatCard label="Active" value={active} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Disabled" value={disabled} icon={XCircle} color="bg-red-50 text-red-600" />
          <StatCard label="Buyers" value={buyers} icon={User} color="bg-blue-50 text-blue-600" />
          <StatCard label="Sellers" value={sellers} icon={ShieldCheck} color="bg-orange-50 text-orange-600" />
        </div>
      </section>

      {/* Search + Filter */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-700">Search & Filter</span>
            </div>
            {isFilterActive && (
              <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                Clear filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, mobile..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">All Roles</option>
              {["BUYER", "SELLER", "ADMIN", "SUPER_ADMIN"].map((r) => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
          {!loading && (
            <p className="text-xs text-slate-400">
              {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </section>

      {/* User List */}
      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <p className="mt-4 text-sm text-slate-500">Loading users...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Users size={40} className="text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">No users found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
          {isFilterActive && (
            <button onClick={clearFilters} className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">User</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.name || "Unnamed"}</p>
                          <p className="text-xs text-slate-400">#{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{user.email || "—"}</p>
                      <p className="text-xs text-slate-400">{user.mobile || "No mobile"}</p>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3"><StatusBadge enabled={user.enabled} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      {user.role === "SUPER_ADMIN" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                          <ShieldCheck size={14} /> Protected
                        </span>
                      ) : user.enabled ? (
                        <button
                          onClick={() => toggleUser(user.id, false)}
                          disabled={actionId === user.id}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {actionId === user.id ? "Updating..." : "Disable"}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleUser(user.id, true)}
                          disabled={actionId === user.id}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          {actionId === user.id ? "Updating..." : "Enable"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 lg:hidden">
            {filtered.map((user) => (
              <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name || "Unnamed"}</p>
                      <p className="text-xs text-slate-400">#{user.id}</p>
                    </div>
                  </div>
                  <StatusBadge enabled={user.enabled} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium">{user.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Mobile</p>
                    <p className="font-medium">{user.mobile || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <RoleBadge role={user.role} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Created</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {user.role === "SUPER_ADMIN" ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-violet-50 py-2 text-sm font-semibold text-violet-700">
                      <ShieldCheck size={16} /> Protected
                    </div>
                  ) : user.enabled ? (
                    <button
                      onClick={() => toggleUser(user.id, false)}
                      disabled={actionId === user.id}
                      className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {actionId === user.id ? "Updating..." : "Disable User"}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleUser(user.id, true)}
                      disabled={actionId === user.id}
                      className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {actionId === user.id ? "Updating..." : "Enable User"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary Footer */}
      {!loading && users.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Summary</p>
              <p className="text-sm font-semibold text-slate-700">
                {active} active · {disabled} disabled · {total} total
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-xl bg-slate-50 px-3 py-1 text-xs font-medium">Buyers {buyers}</span>
              <span className="rounded-xl bg-slate-50 px-3 py-1 text-xs font-medium">Sellers {sellers}</span>
              <span className="rounded-xl bg-slate-50 px-3 py-1 text-xs font-medium">Admins {admins}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}