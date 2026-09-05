import { useEffect, useState } from "react";
import {
  Users,
  User,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getAllUsers,
  enableUser,
  disableUser,
} from "../../api/userApi";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      const userList = Array.isArray(data) ? data : [];

      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      console.error("Users error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  useEffect(() => {
    const value = search.toLowerCase().trim();

    const result = users.filter((user) => {
      const matchesSearch =
        !value ||
        String(user.name || "")
          .toLowerCase()
          .includes(value) ||
        String(user.email || "")
          .toLowerCase()
          .includes(value) ||
        String(user.mobile || "")
          .toLowerCase()
          .includes(value) ||
        String(user.id || "")
          .toLowerCase()
          .includes(value);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.enabled === true) ||
        (statusFilter === "DISABLED" && user.enabled === false);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });

    setFilteredUsers(result);
  }, [search, roleFilter, statusFilter, users]);

  // ==========================================
  // ENABLE USER
  // ==========================================

  const handleEnable = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");

      const updatedUser = await enableUser(userId);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? updatedUser
            : user
        )
      );
    } catch (err) {
      console.error("Enable user error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to enable user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DISABLE USER
  // ==========================================

  const handleDisable = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");

      const updatedUser = await disableUser(userId);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? updatedUser
            : user
        )
      );
    } catch (err) {
      console.error("Disable user error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to disable user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // ROLE STYLE
  // ==========================================

  const getRoleClass = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700";

      case "ADMIN":
        return "bg-blue-100 text-blue-700";

      case "SELLER":
        return "bg-orange-100 text-orange-700";

      case "BUYER":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.enabled === true
  ).length;

  const disabledUsers = users.filter(
    (user) => user.enabled === false
  ).length;

  const buyers = users.filter(
    (user) => user.role === "BUYER"
  ).length;

  const sellers = users.filter(
    (user) => user.role === "SELLER"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-slate-500">
              EstateHub Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Users Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage buyers, sellers and admin users.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

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
            FILTERS
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            {/* Search */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search name, email, mobile..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-500"
              />

            </div>

            {/* Role */}

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="ALL">
                All Roles
              </option>

              <option value="BUYER">
                BUYER
              </option>

              <option value="SELLER">
                SELLER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="SUPER_ADMIN">
                SUPER ADMIN
              </option>
            </select>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="DISABLED">
                DISABLED
              </option>
            </select>

          </div>

        </div>

        {/* ==========================================
            STATS
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Disabled
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              {disabledUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Buyers
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-600">
              {buyers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Sellers
            </p>

            <p className="mt-1 text-2xl font-bold text-orange-600">
              {sellers}
            </p>
          </div>

        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        {loading ? (

          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">
                Loading users...
              </p>

            </div>

          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <Users
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-bold text-slate-900">
              No users found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No users match your search or filters.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <User
                              size={18}
                              className="text-slate-600"
                            />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              User #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-slate-700">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {user.mobile}
                        </p>

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {user.enabled ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                            <CheckCircle size={14} />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                            <XCircle size={14} />

                            Disabled

                          </span>

                        )}

                      </td>

                      {/* CREATED */}

                      <td className="px-5 py-4 text-sm text-slate-600">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        {user.role === "SUPER_ADMIN" ? (

                          <span className="text-xs font-medium text-slate-400">
                            Protected
                          </span>

                        ) : user.enabled ? (

                          <button
                            onClick={() =>
                              handleDisable(user.id)
                            }
                            disabled={
                              actionLoading === user.id
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            Disable
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleEnable(user.id)
                            }
                            disabled={
                              actionLoading === user.id
                            }
                            className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
                          >
                            Enable
                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default UsersManagement;