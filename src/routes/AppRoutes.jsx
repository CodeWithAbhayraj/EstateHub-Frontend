import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Properties from "../pages/public/Properties";
import PropertyDetails from "../pages/public/PropertyDetails";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import BuyerDashboard from "../pages/buyer/BuyerDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;