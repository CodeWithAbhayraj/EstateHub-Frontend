import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  const columnHeadingClass = "text-sm font-semibold text-slate-900";
  const linkClass = "text-sm text-slate-500 hover:text-slate-900";

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Building2 size={18} />
              </div>
              <span className="text-base font-semibold text-slate-900">EstateHub</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              A simple real estate platform to discover, manage and connect with properties.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className={columnHeadingClass}>Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              <Link to="/" className={linkClass}>Home</Link>
              <Link to="/properties" className={linkClass}>Properties</Link>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/register" className={linkClass}>Register</Link>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className={columnHeadingClass}>Platform</h3>
            <div className="mt-3 flex flex-col gap-2.5 text-sm text-slate-500">
              <span>Buy Properties</span>
              <span>Sell Properties</span>
              <span>Schedule Visits</span>
              <span>Manage Leads</span>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className={columnHeadingClass}>Contact</h3>
            <div className="mt-3 space-y-3">
              <a href="mailto:abhaykonge41@gmail.com" className={`flex items-start gap-2.5 ${linkClass}`}>
                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />
                abhaykonge41@gmail.com
              </a>

              <a href="tel:+918855803608" className={`flex items-start gap-2.5 ${linkClass}`}>
                <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                +91 8855803608
              </a>

              <div className="flex items-start gap-2.5 text-sm text-slate-500">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                India
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} EstateHub. All rights reserved.</p>
          <p>Built for better property discovery.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;