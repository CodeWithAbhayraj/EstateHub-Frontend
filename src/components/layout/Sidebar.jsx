import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Heart,
  CalendarDays,
  Bell,
  PlusCircle,
  Users,
  MapPin,
  UserCheck,
  Handshake,
  WalletCards,
  X,
} from "lucide-react";

function Sidebar({ isOpen = false, onClose }) {
  // ==========================================
  // AUTH DATA
  // ==========================================

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token) {
    return null;
  }

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

  const name = user?.name || "User";

  // ==========================================
  // NAV ITEM
  // ==========================================

  const NavItem = ({
    to,
    label,
    icon: Icon,
  }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `
        group flex items-center gap-3
        rounded-xl px-3 py-2.5
        text-sm font-semibold
        transition-all duration-200
        ${
          isActive
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
        `
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg transition
              ${
                isActive
                  ? "bg-white/10 text-white"
                  : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-slate-900"
              }
            `}
          >
            <Icon size={18} strokeWidth={2} />
          </span>

          <span className="truncate">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );

  // ==========================================
  // SECTION TITLE
  // ==========================================

  const SectionTitle = ({ children }) => (
    <p className="mb-2 px-3 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </p>
  );

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const roleLabel = role
    ? role.replaceAll("_", " ")
    : "USER";

  // ==========================================
  // USER INITIAL
  // ==========================================

  const userInitial =
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px] flex-col
          border-r border-slate-200
          bg-white
          shadow-2xl
          transition-transform duration-300 ease-out

          lg:sticky
          lg:top-0
          lg:z-30
          lg:h-screen
          lg:w-72
          lg:shrink-0
          lg:shadow-none

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Building2 size={19} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-slate-900">
                EstateHub
              </h2>

              <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {roleLabel}
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 lg:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* ==========================================
              BUYER
          ========================================== */}

          {role === "BUYER" && (
            <div className="space-y-1">
              <SectionTitle>
                Buyer
              </SectionTitle>

              <NavItem
                to="/buyer/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />

              <NavItem
                to="/buyer/properties"
                label="Browse Properties"
                icon={Building2}
              />

              <NavItem
                to="/buyer/favorites"
                label="My Favorites"
                icon={Heart}
              />

              <NavItem
                to="/buyer/visits"
                label="My Visits"
                icon={CalendarDays}
              />

              <NavItem
                to="/buyer/notifications"
                label="Notifications"
                icon={Bell}
              />
            </div>
          )}

          {/* ==========================================
              SELLER
          ========================================== */}

          {role === "SELLER" && (
            <div className="space-y-1">
              <SectionTitle>
                Seller
              </SectionTitle>

              <NavItem
                to="/seller/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />

              <NavItem
                to="/seller/properties"
                label="My Properties"
                icon={Building2}
              />

              <NavItem
                to="/seller/properties/add"
                label="Add Property"
                icon={PlusCircle}
              />
            </div>
          )}

          {/* ==========================================
              ADMIN / SUPER ADMIN
          ========================================== */}

          {(role === "ADMIN" ||
            role === "SUPER_ADMIN") && (
            <div className="space-y-1">
              <SectionTitle>
                Administration
              </SectionTitle>

              <NavItem
                to="/admin/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />

              <NavItem
                to="/admin/properties"
                label="Properties"
                icon={Building2}
              />

              <NavItem
                to="/admin/leads"
                label="Leads"
                icon={UserCheck}
              />

              <NavItem
                to="/admin/visits"
                label="Visits"
                icon={CalendarDays}
              />

              <NavItem
                to="/admin/deals"
                label="Deals"
                icon={Handshake}
              />

              <NavItem
                to="/admin/commissions"
                label="Commissions"
                icon={WalletCards}
              />

              <NavItem
                to="/admin/users"
                label="Users"
                icon={Users}
              />

              <NavItem
                to="/admin/locations"
                label="Locations"
                icon={MapPin}
              />
            </div>
          )}
        </nav>

        {/* ==========================================
            USER FOOTER
        ========================================== */}

        <div className="shrink-0 border-t border-slate-200 p-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Logged in as
            </p>

            <div className="mt-2.5 flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                {userInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {name}
                </p>

                <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;