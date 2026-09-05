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

function Sidebar({ isOpen = true, onClose }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return null;
  }

  // ==========================================
  // NAVIGATION ITEM
  // ==========================================

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:z-30 lg:translate-x-0
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

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 size={18} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                EstateHub
              </h2>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {role?.replace("_", " ")}
              </p>
            </div>

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>

        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 overflow-y-auto p-4">

          {/* ==========================================
              BUYER
          ========================================== */}

          {role === "BUYER" && (
            <div className="space-y-1">

              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Buyer
              </p>

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

              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Seller
              </p>

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

              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Administration
              </p>

              {/* Dashboard */}

              <NavItem
                to="/admin/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />

              {/* Properties */}

              <NavItem
                to="/admin/properties"
                label="Properties"
                icon={Building2}
              />

              {/* Leads */}

              <NavItem
                to="/admin/leads"
                label="Leads"
                icon={UserCheck}
              />

              {/* Visits */}

              <NavItem
                to="/admin/visits"
                label="Visits"
                icon={CalendarDays}
              />

              {/* Deals */}

              <NavItem
                to="/admin/deals"
                label="Deals"
                icon={Handshake}
              />

              {/* Commissions */}

              <NavItem
                to="/admin/commissions"
                label="Commissions"
                icon={WalletCards}
              />

              {/* Users */}

              <NavItem
                to="/admin/users"
                label="Users"
                icon={Users}
              />

              {/* Locations */}

              <NavItem
                to="/admin/locations"
                label="Locations"
                icon={MapPin}
              />

            </div>
          )}

        </nav>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="border-t border-slate-200 p-4">

          <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-xs font-semibold text-slate-500">
              Logged in as
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {localStorage.getItem("name") || "User"}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {role}
            </p>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;