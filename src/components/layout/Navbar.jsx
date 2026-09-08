import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Building2 } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const role = user?.role?.replace("ROLE_", "").trim().toUpperCase();
  const name = user?.name || "User";
  const userInitial = name.trim().charAt(0).toUpperCase() || "U";

  const dashboardPath =
    role === "BUYER" ? "/buyer/dashboard" :
    role === "SELLER" ? "/seller/dashboard" :
    role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/dashboard" :
    "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const linkClass = "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Building2 size={18} />
          </div>
          <span className="text-base font-semibold text-slate-900">EstateHub</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={linkClass}>Home</Link>
          <Link to="/properties" className={linkClass}>Properties</Link>
          {token && (
            <Link to={dashboardPath} className={linkClass}>Dashboard</Link>
          )}
        </div>

        {/* DESKTOP USER AREA */}
        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-slate-700">{name}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setOpen(false)} className={linkClass}>Home</Link>
            <Link to="/properties" onClick={() => setOpen(false)} className={linkClass}>Properties</Link>

            {token ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className={linkClass}>Dashboard</Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;