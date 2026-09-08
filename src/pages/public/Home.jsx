import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle, MapPin, Search, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700">
                <Building2 size={14} /> Smarter Property Discovery
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find a place <span className="text-blue-600">you'll love</span> to call home.
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
                Discover verified properties, connect with the right people, and manage your property journey from one simple platform.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/properties" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                  <Search size={16} /> Browse Properties <ArrowRight size={16} />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Get Started
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green-600" /> Verified listings</span>
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green-600" /> Easy property search</span>
              </div>
            </div>
            {/* Right - simplified mock property card */}
            <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Building2 size={18} />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase text-slate-400">Featured Property</p>
                  <h2 className="text-lg font-bold text-slate-900">Modern 2 BHK Apartment</h2>
                </div>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">Available</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={14} /> Shivajinagar, Pune
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                  <p className="text-xs text-slate-400">BHK</p>
                  <p className="font-bold">2 BHK</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                  <p className="text-xs text-slate-400">Area</p>
                  <p className="font-bold">1200 sq.ft</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-xs text-slate-400">Starting from</p>
                  <p className="text-xl font-bold text-slate-900">₹99,99,999</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ArrowRight size={16} />
                </div>
              </div>
              {/* Floating badges removed for simplicity */}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold uppercase text-blue-600">Why EstateHub</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Everything you need in one place</h2>
            <p className="mt-2 text-sm text-slate-500">A straightforward platform designed to make property discovery and management easier.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Search, title: "Easy Property Search", desc: "Search and filter properties by location, area, and property type." },
              { icon: ShieldCheck, title: "Verified Listings", desc: "Properties go through an approval process before becoming publicly available." },
              { icon: CalendarDaysIcon, title: "Simple Visit Booking", desc: "Connect with the platform and schedule property visits without unnecessary complexity." },
            ].map((feat, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <feat.icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-slate-400">Start your journey</p>
            <h2 className="text-2xl font-bold text-white">Ready to find your next property?</h2>
            <p className="mt-1 text-sm text-slate-300">Explore available properties or create your account and get started with EstateHub.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/properties" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Browse Properties <ArrowRight size={16} className="inline" />
            </Link>
            <Link to="/register" className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CalendarDaysIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}