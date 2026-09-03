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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/properties"
          element={<BrowseProperties />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;