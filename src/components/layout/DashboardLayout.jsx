import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          TOP NAVBAR
      ========================================== */}

      <Navbar />


      {/* ==========================================
          MOBILE SIDEBAR TRIGGER
      ========================================== */}

      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden sm:px-6">

        <button
          type="button"
          onClick={handleOpenSidebar}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>

      </div>


      {/* ==========================================
          DASHBOARD LAYOUT
      ========================================== */}

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">

        {/* ==========================================
            SIDEBAR
        ========================================== */}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />


        {/* ==========================================
            MAIN CONTENT
        ========================================== */}

        <main className="min-w-0 flex-1">

          <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

            {/* Content container */}

            <div className="mx-auto w-full max-w-[1400px]">

              <Outlet />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;