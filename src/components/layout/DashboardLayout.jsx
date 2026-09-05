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
          NAVBAR
      ========================================== */}

      <Navbar />

      {/* ==========================================
          MOBILE MENU BUTTON
      ========================================== */}

      <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">

        <button
          type="button"
          onClick={handleOpenSidebar}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Menu size={18} />
          Menu
        </button>

      </div>

      {/* ==========================================
          LAYOUT
      ========================================== */}

      <div className="mx-auto flex max-w-[1600px]">

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

          <div className="p-4 sm:p-6 lg:p-8">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;