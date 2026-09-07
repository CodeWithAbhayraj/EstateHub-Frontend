import { Link } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  CheckCircle,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Background decoration */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />
        </div>


        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ======================================
                LEFT CONTENT
            ====================================== */}

            <div className="max-w-2xl">

              {/* Badge */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 sm:text-sm">
                <Building2 size={15} />

                <span>
                  Smarter Property Discovery
                </span>
              </div>


              {/* Heading */}

              <h1
                className="
                  text-4xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-slate-900
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Find a place
                <span className="text-blue-600">
                  {" "}you'll love{" "}
                </span>
                to call home.
              </h1>


              {/* Description */}

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
                Discover verified properties, connect with the right
                people, and manage your property journey from one
                simple platform.
              </p>


              {/* CTA */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/properties"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-slate-800
                    hover:shadow-md
                    active:scale-[0.98]
                    sm:px-6
                  "
                >
                  <Search size={17} />

                  Browse Properties

                  <ArrowRight size={16} />
                </Link>


                <Link
                  to="/register"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-slate-700
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:text-slate-900
                    active:scale-[0.98]
                    sm:px-6
                  "
                >
                  Get Started
                </Link>

              </div>


              {/* Trust points */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle
                    size={17}
                    className="text-green-600"
                  />
                  Verified listings
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle
                    size={17}
                    className="text-green-600"
                  />
                  Easy property search
                </div>

              </div>

            </div>


            {/* ======================================
                RIGHT VISUAL
            ====================================== */}

            <div className="relative">

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-100
                  p-4
                  shadow-xl
                  sm:p-5
                "
              >

                {/* Main visual */}

                <div
                  className="
                    flex
                    min-h-[320px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    sm:min-h-[420px]
                  "
                >

                  <div className="w-full max-w-md px-6">

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Building2 size={21} />
                          </div>

                          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Featured Property
                          </p>

                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Modern 2 BHK Apartment
                          </h2>

                        </div>

                        <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                          Available
                        </div>

                      </div>


                      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} />
                        <span>
                          Shivajinagar, Pune
                        </span>
                      </div>


                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-slate-400">
                            BHK
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            2 BHK
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-slate-400">
                            Area
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            1200 sq.ft
                          </p>
                        </div>

                      </div>


                      <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4">

                        <div>

                          <p className="text-xs text-slate-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-xl font-bold text-slate-900">
                            ₹99,99,999
                          </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <ArrowRight
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Floating stats */}

                <div className="absolute -bottom-3 left-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:left-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                      <Users
                        size={17}
                        className="text-blue-600"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Growing community
                      </p>

                      <p className="text-sm font-bold text-slate-800">
                        Buyers & Sellers
                      </p>

                    </div>

                  </div>

                </div>


                <div className="absolute -right-2 top-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-right-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                      <ShieldCheck
                        size={17}
                        className="text-green-600"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Platform
                      </p>

                      <p className="text-sm font-bold text-slate-800">
                        Trusted & Simple
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          FEATURES
      ========================================== */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">
              Why EstateHub
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Everything you need in one place
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              A straightforward platform designed to make property
              discovery and management easier.
            </p>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* FEATURE 1 */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Search size={20} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Easy Property Search
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Search and filter properties by location, area,
                and property type.
              </p>

            </div>


            {/* FEATURE 2 */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ShieldCheck size={20} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Verified Listings
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Properties go through an approval process before
                becoming publicly available.
              </p>

            </div>


            {/* FEATURE 3 */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <CalendarDaysIcon />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Simple Visit Booking
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Connect with the platform and schedule property
                visits without unnecessary complexity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          CTA
      ========================================== */}

      <section className="bg-slate-900">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                Start your journey
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to find your next property?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Explore available properties or create your account
                and get started with EstateHub.
              </p>

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <Link
                to="/properties"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-900
                  transition
                  hover:bg-slate-100
                  active:scale-[0.98]
                "
              >
                Browse Properties
                <ArrowRight size={16} />
              </Link>


              <Link
                to="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-700
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-slate-800
                  active:scale-[0.98]
                "
              >
                Create Account
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


/* ==========================================
   SMALL ICON COMPONENT
========================================== */

function CalendarDaysIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
      />

      <line
        x1="16"
        x2="16"
        y1="2"
        y2="6"
      />

      <line
        x1="8"
        x2="8"
        y1="2"
        y2="6"
      />

      <line
        x1="3"
        x2="21"
        y1="10"
        y2="10"
      />

      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export default Home;