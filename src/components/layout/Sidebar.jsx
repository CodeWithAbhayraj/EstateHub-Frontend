import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Building2, Heart, CalendarDays, Bell,
  PlusCircle, Users, MapPin, UserCheck, Handshake, WalletCards, X,
} from "lucide-react";

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
        transition-colors duration-150
        ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
      `}
    >
      <Icon size={17} strokeWidth={2} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function Sidebar({ isOpen = false, onClose }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token) return null;

  let user = null;
  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const role = user?.role?.replace("ROLE_", "").trim().toUpperCase();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-200
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none
          ${isOpen ? "translate-x-0 shadow-elevated" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Building2 size={17} />
            </div>
            <span className="text-sm font-semibold text-slate-900">EstateHub</span>
          </div>

          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 lg:hidden" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {role === "BUYER" && (
            <>
              <NavItem to="/buyer/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={onClose} />
              <NavItem to="/buyer/properties" label="Browse Properties" icon={Building2} onClick={onClose} />
              <NavItem to="/buyer/favorites" label="My Favorites" icon={Heart} onClick={onClose} />
              <NavItem to="/buyer/visits" label="My Visits" icon={CalendarDays} onClick={onClose} />
              <NavItem to="/buyer/notifications" label="Notifications" icon={Bell} onClick={onClose} />
            </>
          )}

          {role === "SELLER" && (
            <>
              <NavItem to="/seller/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={onClose} />
              <NavItem to="/seller/properties" label="My Properties" icon={Building2} onClick={onClose} />
              <NavItem to="/seller/properties/add" label="Add Property" icon={PlusCircle} onClick={onClose} />
            </>
          )}

          {(role === "ADMIN" || role === "SUPER_ADMIN") && (
            <>
              <NavItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={onClose} />
              <NavItem to="/admin/properties" label="Properties" icon={Building2} onClick={onClose} />
              <NavItem to="/admin/leads" label="Leads" icon={UserCheck} onClick={onClose} />
              <NavItem to="/admin/visits" label="Visits" icon={CalendarDays} onClick={onClose} />
              <NavItem to="/admin/deals" label="Deals" icon={Handshake} onClick={onClose} />
              <NavItem to="/admin/commissions" label="Commissions" icon={WalletCards} onClick={onClose} />
              <NavItem to="/admin/users" label="Users" icon={Users} onClick={onClose} />
              <NavItem to="/admin/locations" label="Locations" icon={MapPin} onClick={onClose} />
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;