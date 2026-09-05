import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import PropertyDetails from "../pages/public/PropertyDetails";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import BrowseProperties from "../pages/buyer/BrowseProperties";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import Favorites from "../pages/buyer/Favorites";
import MyVisits from "../pages/buyer/MyVisits";
import Notifications from "../pages/buyer/Notifications";

import SellerDashboard from "../pages/seller/SellerDashboard";
import AddProperty from "../pages/seller/AddProperty";
import MyProperties from "../pages/seller/MyProperties";
import EditProperty from "../pages/seller/EditProperty";

import AdminDashboard from "../pages/admin/AdminDashboard";
import LeadsManagement from "../pages/admin/LeadsManagement";
import VisitsManagement from "../pages/admin/VisitsManagement";
import CommissionsManagement from "../pages/admin/CommissionsManagement";
import UsersManagement from "../pages/admin/UsersManagement";
import LocationsManagement from "../pages/admin/LocationsManagement";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import DashboardLayout from "../components/layout/DashboardLayout";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          403
        </h1>

        <p className="mt-2 text-slate-500">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<BrowseProperties />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* ==========================================
            BUYER ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute allowedRoles={["BUYER"]} />
            }
          >

            <Route element={<DashboardLayout />}>

              <Route
                path="/buyer/dashboard"
                element={<BuyerDashboard />}
              />

              <Route
                path="/buyer/properties"
                element={<BrowseProperties />}
              />

              <Route
                path="/buyer/favorites"
                element={<Favorites />}
              />

              <Route
                path="/buyer/visits"
                element={<MyVisits />}
              />

              <Route
                path="/buyer/notifications"
                element={<Notifications />}
              />

            </Route>

          </Route>
        </Route>


        {/* ==========================================
            SELLER ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute allowedRoles={["SELLER"]} />
            }
          >

            <Route element={<DashboardLayout />}>

              <Route
                path="/seller/dashboard"
                element={<SellerDashboard />}
              />

              <Route
                path="/seller/properties"
                element={<MyProperties />}
              />

              <Route
                path="/seller/properties/add"
                element={<AddProperty />}
              />

              <Route
                path="/seller/properties/:id/edit"
                element={<EditProperty />}
              />

            </Route>

          </Route>
        </Route>


        {/* ==========================================
            ADMIN ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPER_ADMIN",
                ]}
              />
            }
          >

            <Route element={<DashboardLayout />}>

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/leads"
                element={<LeadsManagement />}
              />

              <Route
                path="/admin/visits"
                element={<VisitsManagement />}
              />

              <Route
                path="/admin/commissions"
                element={<CommissionsManagement />}
              />

              <Route
                path="/admin/users"
                element={<UsersManagement />}
              />

              <Route
                path="/admin/locations"
                element={<LocationsManagement />}
              />

            </Route>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;