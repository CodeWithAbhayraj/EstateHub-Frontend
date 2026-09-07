import { Link } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ==========================================
            MAIN FOOTER
        ========================================== */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Building2 size={20} />
              </div>

              <span className="text-lg font-bold text-slate-900">
                EstateHub
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              A simple real estate platform to discover,
              manage and connect with properties.
            </p>

          </div>


          {/* QUICK LINKS */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                to="/"
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                Home
              </Link>

              <Link
                to="/properties"
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                Properties
              </Link>

              <Link
                to="/login"
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                Register
              </Link>

            </div>

          </div>


          {/* PLATFORM */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Platform
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <span className="text-sm text-slate-500">
                Buy Properties
              </span>

              <span className="text-sm text-slate-500">
                Sell Properties
              </span>

              <span className="text-sm text-slate-500">
                Schedule Visits
              </span>

              <span className="text-sm text-slate-500">
                Manage Leads
              </span>

            </div>

          </div>


          {/* CONTACT */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Contact
            </h3>

            <div className="mt-4 space-y-4">

              {/* EMAIL */}

              <div className="flex items-start gap-3">

                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <a
                  href="mailto:abhaykonge41@gmail.com"
                  className="text-sm text-slate-500 transition hover:text-slate-900"
                >
                  abhaykonge41@gmail.com
                </a>

              </div>


              {/* MOBILE */}

              <div className="flex items-start gap-3">

                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <a
                  href="tel:+918855803608"
                  className="text-sm text-slate-500 transition hover:text-slate-900"
                >
                  +91 8855803608
                </a>

              </div>


              {/* LOCATION */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <span className="text-sm leading-5 text-slate-500">
                  India
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            BOTTOM
        ========================================== */}

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-400">
            © {year} EstateHub. All rights reserved.
          </p>

          <p className="text-sm text-slate-400">
            Built for better property discovery.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;