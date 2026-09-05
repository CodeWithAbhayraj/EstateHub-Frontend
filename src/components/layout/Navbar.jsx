import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name =
    localStorage.getItem("name") || "User";

  // ==========================================
  // DASHBOARD LINK
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

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">

          {/* ==========================================
              LOGO
          ========================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <span className="text-lg font-bold">
                E
              </span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                EstateHub
              </h1>

              <p className="hidden text-[10px] uppercase tracking-wider text-slate-400 sm:block">
                Real Estate Platform
              </p>
            </div>
          </Link>

          {/* ==========================================
              DESKTOP NAV
          ========================================== */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </Link>

            <Link
              to="/properties"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Properties
            </Link>

            {token && role === "BUYER" && (
              <>
                <Link
                  to="/buyer/favorites"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Favorites
                </Link>

                <Link
                  to="/buyer/visits"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  My Visits
                </Link>
              </>
            )}

            {token && role === "SELLER" && (
              <Link
                to="/seller/properties"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                My Properties
              </Link>
            )}

          </div>

          {/* ==========================================
              DESKTOP USER AREA
          ========================================== */}

          <div className="hidden items-center gap-3 md:flex">

            {token ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">

                  <UserCircle
                    size={20}
                    className="text-slate-500"
                  />

                  <div className="leading-tight">

                    <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                      {name}
                    </p>

                    <p className="text-[10px] font-semibold text-slate-400">
                      {role}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

        </div>

        {/* ==========================================
            MOBILE MENU
        ========================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 py-4 md:hidden">

            <div className="flex flex-col gap-1">

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>

              <Link
                to="/properties"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Properties
              </Link>

              {token && role === "BUYER" && (
                <>
                  <Link
                    to="/buyer/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/buyer/favorites"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Favorites
                  </Link>

                  <Link
                    to="/buyer/visits"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Visits
                  </Link>

                  <Link
                    to="/buyer/notifications"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Notifications
                  </Link>
                </>
              )}

              {token && role === "SELLER" && (
                <>
                  <Link
                    to="/seller/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/seller/properties"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Properties
                  </Link>

                  <Link
                    to="/seller/properties/add"
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Add Property
                  </Link>
                </>
              )}

              {(role === "ADMIN" ||
                role === "SUPER_ADMIN") &&
                token && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/admin/leads"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Leads
                    </Link>

                    <Link
                      to="/admin/visits"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Visits
                    </Link>

                    <Link
                      to="/admin/commissions"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Commissions
                    </Link>

                    <Link
                      to="/admin/users"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Users
                    </Link>

                    <Link
                      to="/admin/locations"
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Locations
                    </Link>
                  </>
                )}

              <div className="mt-3 border-t border-slate-100 pt-3">

                {token ? (
                  <>

                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                      <UserCircle
                        size={22}
                        className="text-slate-500"
                      />

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {name}
                        </p>

                        <p className="text-xs font-semibold text-slate-400">
                          {role}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
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
                      className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
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