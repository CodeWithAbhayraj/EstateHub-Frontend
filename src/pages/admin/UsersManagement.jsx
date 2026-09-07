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

// ==========================================
// ROLE CONFIG
// ==========================================

const USER_ROLES = [
  "BUYER",
  "SELLER",
  "ADMIN",
  "SUPER_ADMIN",
];

const USER_STATUS = [
  "ACTIVE",
  "DISABLED",
];

// ==========================================
// ROLE BADGE
// ==========================================

function RoleBadge({ role }) {
  const roleClasses = {
    SUPER_ADMIN:
      "bg-violet-50 text-violet-700",

    ADMIN:
      "bg-blue-50 text-blue-700",

    SELLER:
      "bg-orange-50 text-orange-700",

    BUYER:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        ${
          roleClasses[role] ||
          "bg-slate-100 text-slate-600"
        }
      `}
    >
      {String(role || "USER").replaceAll(
        "_",
        " "
      )}
    </span>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function UserStatusBadge({ enabled }) {
  if (enabled) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-emerald-50
          px-3
          py-1.5
          text-[10px]
          font-bold
          uppercase
          tracking-wide
          text-emerald-700
        "
      >
        <CheckCircle size={12} />
        Active
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-red-50
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        text-red-700
      "
    >
      <XCircle size={12} />
      Disabled
    </span>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
  valueClass = "text-slate-900",
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md

        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>

          <p
            className={`
              mt-2
              text-2xl
              font-bold
              tracking-tight
              sm:text-3xl
              ${valueClass}
            `}
          >
            {value}
          </p>

          <p className="mt-1 line-clamp-1 text-[11px] text-slate-400 sm:text-xs">
            {description}
          </p>

        </div>

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-200

            group-hover:scale-105

            sm:h-11
            sm:w-11

            ${iconClass}
          `}
        >
          <Icon size={19} />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">

      <div className="flex items-center gap-2">

        {Icon && (
          <Icon
            size={14}
            className="shrink-0 text-slate-400"
          />
        )}

        <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

      </div>

      <p className="mt-1 truncate text-xs font-bold text-slate-700 sm:text-sm">
        {value}
      </p>

    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

function UsersManagement() {
  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async (
    showFullLoader = true
  ) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data =
        await getAllUsers();

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Users error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredUsers = useMemo(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    return users.filter(
      (user) => {
        const matchesSearch =
          !value ||
          String(
            user.name || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            user.email || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            user.mobile || ""
          )
            .toLowerCase()
            .includes(value) ||
          String(
            user.id || ""
          )
            .toLowerCase()
            .includes(value);

        const matchesRole =
          roleFilter === "ALL" ||
          user.role ===
            roleFilter;

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter ===
            "ACTIVE" &&
            user.enabled === true) ||
          (statusFilter ===
            "DISABLED" &&
            user.enabled === false);

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus
        );
      }
    );
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // ==========================================
  // ENABLE USER
  // ==========================================

  const handleEnable = async (
    userId
  ) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");

      const updatedUser =
        await enableUser(userId);

      setUsers((prev) =>
        prev.map((user) =>
          String(user.id) ===
          String(userId)
            ? updatedUser
            : user
        )
      );

      setSuccess(
        "User enabled successfully."
      );
    } catch (err) {
      console.error(
        "Enable user error:",
        err
      );

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

  const handleDisable = async (
    userId
  ) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");

      const updatedUser =
        await disableUser(userId);

      setUsers((prev) =>
        prev.map((user) =>
          String(user.id) ===
          String(userId)
            ? updatedUser
            : user
        )
      );

      setSuccess(
        "User disabled successfully."
      );
    } catch (err) {
      console.error(
        "Disable user error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to disable user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        user.enabled === true
    ).length;

  const disabledUsers =
    users.filter(
      (user) =>
        user.enabled === false
    ).length;

  const buyers =
    users.filter(
      (user) =>
        user.role === "BUYER"
    ).length;

  const sellers =
    users.filter(
      (user) =>
        user.role === "SELLER"
    ).length;

  const admins =
    users.filter(
      (user) =>
        user.role === "ADMIN" ||
        user.role === "SUPER_ADMIN"
    ).length;

  const activeFilter =
    search.trim() !== "" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative p-5 sm:p-7 lg:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* TITLE */}

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Users size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
                  EstateHub Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Users Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  Manage buyers, sellers and admin users.
                </p>

              </div>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchUsers(false)
              }
              disabled={
                loading ||
                refreshing
              }
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-900
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition

                hover:bg-slate-800
                hover:shadow-md

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-fit
              "
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </div>

      </section>


      {/* ==========================================
          ALERTS
      ========================================== */}

      {error && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-medium
            leading-5
            text-red-600
          "
          role="alert"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            font-medium
            leading-5
            text-emerald-700
          "
          role="status"
        >
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}


      {/* ==========================================
          STATS
      ========================================== */}

      <section className="mb-6">

        <div className="mb-4">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            User Activity
          </h2>

        </div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            label="Total Users"
            value={totalUsers}
            description="All registered users"
            icon={Users}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Active"
            value={activeUsers}
            description="Active accounts"
            icon={CheckCircle}
            valueClass="text-emerald-600"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Disabled"
            value={disabledUsers}
            description="Disabled accounts"
            icon={XCircle}
            valueClass="text-red-600"
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            label="Buyers"
            value={buyers}
            description="Registered buyers"
            icon={User}
            valueClass="text-blue-600"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Sellers"
            value={sellers}
            description={`${admins} admin accounts`}
            icon={ShieldCheck}
            valueClass="text-orange-600"
            iconClass="bg-orange-50 text-orange-600"
          />

        </div>

      </section>


      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Filter size={17} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Search & Filter
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  Find a user
                </p>

              </div>

            </div>


            {activeFilter && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 sm:text-right"
              >
                Clear filters
              </button>
            )}

          </div>


          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search name, email, mobile or ID..."
                className="
                  min-h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  font-medium
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition

                  placeholder:text-slate-400

                  hover:border-slate-400

                  focus:border-slate-500
                  focus:ring-4
                  focus:ring-slate-100
                "
              />

            </div>


            {/* ROLE */}

            <select
              value={
                roleFilter
              }
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
              className="
                min-h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-800
                shadow-sm
                outline-none
                transition

                hover:border-slate-400

                focus:border-slate-500
                focus:ring-4
                focus:ring-slate-100
              "
            >

              <option value="ALL">
                All Roles
              </option>

              {USER_ROLES.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role.replaceAll(
                      "_",
                      " "
                    )}
                  </option>
                )
              )}

            </select>


            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                min-h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-800
                shadow-sm
                outline-none
                transition

                hover:border-slate-400

                focus:border-slate-500
                focus:ring-4
                focus:ring-slate-100
              "
            >

              <option value="ALL">
                All Statuses
              </option>

              {USER_STATUS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>


          {!loading && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                {filteredUsers.length}{" "}
                {filteredUsers.length ===
                1
                  ? "user"
                  : "users"}{" "}
                found
              </span>

              {roleFilter !==
                "ALL" && (
                <span className="rounded-full bg-violet-50 px-2.5 py-1 font-bold text-violet-600">
                  {roleFilter.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              )}

              {statusFilter !==
                "ALL" && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-600">
                  {statusFilter}
                </span>
              )}

            </div>
          )}

        </div>

      </section>


      {/* ==========================================
          CONTENT
      ========================================== */}

      {loading ? (

        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading users...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>

          </div>

        </div>

      ) : filteredUsers.length ===
        0 ? (

        /* ========================================
           EMPTY STATE
        ======================================== */

        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">

              <Users
                size={30}
                className="text-violet-400"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              No users found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              No users match your current search or filters.
            </p>

            {activeFilter && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition

                  hover:bg-slate-50
                "
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

      ) : (

        <>
          {/* ======================================
              DESKTOP TABLE
          ====================================== */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Created
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredUsers.map(
                    (user) => {

                      const isLoading =
                        actionLoading ===
                        user.id;

                      const isProtected =
                        user.role ===
                        "SUPER_ADMIN";

                      return (
                        <tr
                          key={
                            user.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* USER */}

                          <td className="px-5 py-5 align-top">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                <User
                                  size={18}
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[180px] truncate text-sm font-bold text-slate-900">
                                  {user.name ||
                                    "Unnamed User"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  User #
                                  {
                                    user.id
                                  }
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* CONTACT */}

                          <td className="px-5 py-5 align-top">

                            <p className="max-w-[220px] truncate text-sm font-medium text-slate-700">
                              {user.email ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {user.mobile ||
                                "No mobile"}
                            </p>

                          </td>


                          {/* ROLE */}

                          <td className="px-5 py-5 align-top">

                            <RoleBadge
                              role={
                                user.role
                              }
                            />

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-5 align-top">

                            <UserStatusBadge
                              enabled={
                                user.enabled
                              }
                            />

                          </td>


                          {/* CREATED */}

                          <td className="px-5 py-5 align-top text-sm text-slate-600">

                            {formatDate(
                              user.createdAt
                            )}

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-5 align-top">

                            {isProtected ? (

                              <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">

                                <ShieldCheck
                                  size={14}
                                />

                                Protected

                              </div>

                            ) : user.enabled ? (

                              <button
                                type="button"
                                onClick={() =>
                                  handleDisable(
                                    user.id
                                  )
                                }
                                disabled={
                                  isLoading
                                }
                                className="
                                  inline-flex
                                  min-h-10
                                  items-center
                                  justify-center
                                  gap-1.5
                                  rounded-xl
                                  border
                                  border-red-200
                                  bg-red-50
                                  px-4
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-red-600
                                  transition

                                  hover:bg-red-100

                                  active:scale-[0.98]

                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {isLoading ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <XCircle
                                    size={14}
                                  />
                                )}

                                {isLoading
                                  ? "Updating..."
                                  : "Disable"}

                              </button>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  handleEnable(
                                    user.id
                                  )
                                }
                                disabled={
                                  isLoading
                                }
                                className="
                                  inline-flex
                                  min-h-10
                                  items-center
                                  justify-center
                                  gap-1.5
                                  rounded-xl
                                  border
                                  border-emerald-200
                                  bg-emerald-50
                                  px-4
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-emerald-600
                                  transition

                                  hover:bg-emerald-100

                                  active:scale-[0.98]

                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {isLoading ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle
                                    size={14}
                                  />
                                )}

                                {isLoading
                                  ? "Updating..."
                                  : "Enable"}

                              </button>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ======================================
              MOBILE / TABLET CARDS
          ====================================== */}

          <div className="grid gap-4 lg:hidden">

            {filteredUsers.map(
              (user) => {

                const isLoading =
                  actionLoading ===
                  user.id;

                const isProtected =
                  user.role ===
                  "SUPER_ADMIN";

                return (
                  <article
                    key={
                      user.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-sm
                      transition

                      hover:border-slate-300
                      hover:shadow-md

                      sm:p-5
                    "
                  >

                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">

                          <User
                            size={18}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-slate-900">
                            {user.name ||
                              "Unnamed User"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            User #
                            {user.id}
                          </p>

                        </div>

                      </div>

                      <UserStatusBadge
                        enabled={
                          user.enabled
                        }
                      />

                    </div>


                    {/* ROLE */}

                    <div className="mt-4">

                      <RoleBadge
                        role={
                          user.role
                        }
                      />

                    </div>


                    {/* INFO */}

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <InfoBox
                        label="Email"
                        value={
                          user.email ||
                          "—"
                        }
                        icon={
                          User
                        }
                      />

                      <InfoBox
                        label="Mobile"
                        value={
                          user.mobile ||
                          "—"
                        }
                        icon={
                          User
                        }
                      />

                      <InfoBox
                        label="Created"
                        value={formatDate(
                          user.createdAt
                        )}
                        icon={
                          CheckCircle
                        }
                      />

                      <InfoBox
                        label="Role"
                        value={
                          user.role?.replaceAll(
                            "_",
                            " "
                          ) ||
                          "USER"
                        }
                        icon={
                          ShieldCheck
                        }
                      />

                    </div>


                    {/* ACTION */}

                    <div className="mt-4">

                      {isProtected ? (

                        <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs font-semibold text-violet-600">

                          <ShieldCheck
                            size={15}
                          />

                          SUPER ADMIN — Protected

                        </div>

                      ) : user.enabled ? (

                        <button
                          type="button"
                          onClick={() =>
                            handleDisable(
                              user.id
                            )
                          }
                          disabled={
                            isLoading
                          }
                          className="
                            inline-flex
                            min-h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-red-600
                            transition

                            hover:bg-red-100

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >

                          {isLoading ? (
                            <>
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                              Updating...
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={16}
                              />
                              Disable User
                            </>
                          )}

                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            handleEnable(
                              user.id
                            )
                          }
                          disabled={
                            isLoading
                          }
                          className="
                            inline-flex
                            min-h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-emerald-600
                            transition

                            hover:bg-emerald-100

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >

                          {isLoading ? (
                            <>
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                              Updating...
                            </>
                          ) : (
                            <>
                              <CheckCircle
                                size={16}
                              />
                              Enable User
                            </>
                          )}

                        </button>

                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        </>
      )}

      {/* ==========================================
          BOTTOM SUMMARY
      ========================================== */}

      {!loading &&
        users.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  User Summary
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {activeUsers} active users out of{" "}
                  {totalUsers} total accounts
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <SummaryBadge
                  label="Buyers"
                  value={buyers}
                />

                <SummaryBadge
                  label="Sellers"
                  value={sellers}
                />

                <SummaryBadge
                  label="Admins"
                  value={admins}
                />

              </div>

            </div>

          </section>
        )}

    </div>
  );
}

// ==========================================
// SUMMARY BADGE
// ==========================================

function SummaryBadge({
  label,
  value,
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">

      <span className="text-xs font-medium text-slate-500">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}

export default UsersManagement;