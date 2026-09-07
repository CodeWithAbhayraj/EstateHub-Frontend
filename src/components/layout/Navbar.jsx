import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  LogOut,
  UserCircle,
  LayoutDashboard,
  Heart,
  CalendarDays,
  Building2,
  Bell,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ==========================================
  // AUTH DATA
  // ==========================================

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

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

  const roleLabel = role
    ? role.replaceAll("_", " ")
    : "USER";

  const userInitial =
    name?.trim()?.charAt(0)?.toUpperCase() || "U";


  // ==========================================
  // DASHBOARD PATH
  // ==========================================

  const getDashboardPath = () => {
    switch (role) {
      case "BUYER":
        return "/buyer/dashboard";

      case "SELLER":
        return "/seller/dashboard";

      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin/dashboard";

      default:
        return "/";
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Old keys cleanup
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setMobileMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };


  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  // ==========================================
  // NAV LINK
  // ==========================================

  const NavLinkItem = ({
    to,
    label,
    icon: Icon,
  }) => (
    <Link
      to={to}
      onClick={closeMobileMenu}
      className="
        inline-flex items-center gap-2
        rounded-xl px-3.5 py-2.5
        text-sm font-semibold
        text-slate-600
        transition-all duration-200
        hover:bg-slate-100
        hover:text-slate-900
        active:scale-[0.98]
      "
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );


  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-slate-200
        bg-white/90
        backdrop-blur-xl
      "
    >

      <div
        className="
          mx-auto w-full max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div className="flex h-16 items-center justify-between">

          {/* ==========================================
              LOGO
          ========================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex min-w-0 items-center gap-2.5"
          >

            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-slate-900
                text-white
                shadow-sm
                transition-transform duration-200
                group-hover:scale-105
              "
            >
              <Building2
                size={19}
                strokeWidth={2.2}
              />
            </div>


            <div className="min-w-0">

              <h1
                className="
                  truncate
                  text-lg
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                EstateHub
              </h1>

              <p
                className="
                  hidden
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-slate-400
                  sm:block
                "
              >
                Real Estate Platform
              </p>

            </div>

          </Link>


          {/* ==========================================
              DESKTOP NAVIGATION
          ========================================== */}

          <div className="hidden items-center md:flex">

            <div className="flex items-center gap-1">

              <NavLinkItem
                to="/"
                label="Home"
                icon={Building2}
              />

              <NavLinkItem
                to="/properties"
                label="Properties"
                icon={Building2}
              />


              {/* BUYER LINKS */}

              {token && role === "BUYER" && (
                <>
                  <NavLinkItem
                    to="/buyer/favorites"
                    label="Favorites"
                    icon={Heart}
                  />

                  <NavLinkItem
                    to="/buyer/visits"
                    label="My Visits"
                    icon={CalendarDays}
                  />

                  <NavLinkItem
                    to="/buyer/notifications"
                    label="Notifications"
                    icon={Bell}
                  />
                </>
              )}


              {/* SELLER LINKS */}

              {token && role === "SELLER" && (
                <NavLinkItem
                  to="/seller/properties"
                  label="My Properties"
                  icon={Building2}
                />
              )}

            </div>

          </div>


          {/* ==========================================
              DESKTOP USER AREA
          ========================================== */}

          <div className="hidden items-center gap-2.5 md:flex">

            {token ? (
              <>
                {/* DASHBOARD */}

                <Link
                  to={getDashboardPath()}
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-slate-200
                    bg-white
                    px-3.5 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    shadow-sm
                    transition-all duration-200
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:text-slate-900
                    active:scale-[0.98]
                  "
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>


                {/* USER */}

                <div
                  className="
                    flex items-center gap-2.5
                    rounded-xl
                    border border-slate-100
                    bg-slate-50
                    px-3 py-2
                  "
                >

                  <div
                    className="
                      flex h-8 w-8
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-slate-200
                      text-xs font-bold
                      text-slate-700
                    "
                  >
                    {userInitial}
                  </div>

                  <div className="max-w-28 leading-tight">

                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >
                      {roleLabel}
                    </p>

                  </div>

                </div>


                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    inline-flex items-center gap-2
                    rounded-xl
                    bg-slate-900
                    px-4 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition-all duration-200
                    hover:bg-slate-800
                    active:scale-[0.98]
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    rounded-xl
                    border border-slate-300
                    bg-white
                    px-4 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    transition-all duration-200
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-xl
                    bg-slate-900
                    px-4 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition-all duration-200
                    hover:bg-slate-800
                    active:scale-[0.98]
                  "
                >
                  Register
                </Link>
              </>
            )}

          </div>


          {/* ==========================================
              MOBILE MENU BUTTON
          ========================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (prev) => !prev
              )
            }
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition-all duration-200
              hover:bg-slate-50
              active:scale-95
              md:hidden
            "
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>


        {/* ==========================================
            MOBILE MENU
        ========================================== */}

        {mobileMenuOpen && (
          <div
            className="
              border-t border-slate-100
              pb-4 pt-3
              md:hidden
            "
          >

            <div className="flex flex-col gap-1">

              {/* PUBLIC LINKS */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-3.5 py-3
                  text-sm font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <Building2 size={17} />
                Home
              </Link>


              <Link
                to="/properties"
                onClick={closeMobileMenu}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-3.5 py-3
                  text-sm font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <Building2 size={17} />
                Properties
              </Link>


              {/* ======================================
                  BUYER
              ====================================== */}

              {token && role === "BUYER" && (
                <>
                  <Link
                    to="/buyer/dashboard"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    to="/buyer/favorites"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Heart size={17} />
                    Favorites
                  </Link>

                  <Link
                    to="/buyer/visits"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <CalendarDays size={17} />
                    My Visits
                  </Link>

                  <Link
                    to="/buyer/notifications"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Bell size={17} />
                    Notifications
                  </Link>
                </>
              )}


              {/* ======================================
                  SELLER
              ====================================== */}

              {token && role === "SELLER" && (
                <>
                  <Link
                    to="/seller/dashboard"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    to="/seller/properties"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Building2 size={17} />
                    My Properties
                  </Link>

                  <Link
                    to="/seller/properties/add"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Building2 size={17} />
                    Add Property
                  </Link>
                </>
              )}


              {/* ======================================
                  ADMIN
              ====================================== */}

              {token &&
                (role === "ADMIN" ||
                  role === "SUPER_ADMIN") && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/properties"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Building2 size={17} />
                    Properties
                  </Link>

                  <Link
                    to="/admin/leads"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <UserCircle size={17} />
                    Leads
                  </Link>

                  <Link
                    to="/admin/visits"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <CalendarDays size={17} />
                    Visits
                  </Link>

                  <Link
                    to="/admin/deals"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Building2 size={17} />
                    Deals
                  </Link>

                  <Link
                    to="/admin/commissions"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Building2 size={17} />
                    Commissions
                  </Link>

                  <Link
                    to="/admin/users"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <Users size={17} />
                    Users
                  </Link>

                  <Link
                    to="/admin/locations"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-3
                      rounded-xl
                      px-3.5 py-3
                      text-sm font-semibold
                      text-slate-700
                      hover:bg-slate-50
                    "
                  >
                    <MapPin size={17} />
                    Locations
                  </Link>
                </>
              )}


              {/* ======================================
                  MOBILE USER AREA
              ====================================== */}

              <div className="mt-3 border-t border-slate-100 pt-3">

                {token ? (
                  <>

                    <div
                      className="
                        mb-3
                        flex items-center gap-3
                        rounded-2xl
                        bg-slate-50
                        p-3.5
                      "
                    >

                      <div
                        className="
                          flex h-10 w-10
                          shrink-0
                          items-center justify-center
                          rounded-full
                          bg-slate-200
                          text-sm font-bold
                          text-slate-700
                        "
                      >
                        {userInitial}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-800">
                          {name}
                        </p>

                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          {roleLabel}
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex w-full
                        items-center justify-center gap-2
                        rounded-xl
                        bg-slate-900
                        px-4 py-3
                        text-sm font-semibold
                        text-white
                        transition
                        hover:bg-slate-800
                        active:scale-[0.98]
                      "
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">

                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        rounded-xl
                        border border-slate-300
                        px-4 py-3
                        text-center
                        text-sm font-semibold
                        text-slate-700
                        hover:bg-slate-50
                      "
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="
                        rounded-xl
                        bg-slate-900
                        px-4 py-3
                        text-center
                        text-sm font-semibold
                        text-white
                        hover:bg-slate-800
                      "
                    >
                      Register
                    </Link>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;