import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TrackingPage from "./features/public/TrackingPage";
import AdminDashboard from "./features/admin/AdminDashboard";
import CreateShipment from "./features/admin/CreateShipment";
import OperatorManagement from "./features/admin/OperatorManagement";
import ShipmentDetailView from "./features/admin/ShipmentDetailView";
import DriverDashboard from "./features/driver/DriverDashboard";
import ShipmentDetails from "./features/driver/ShipmentDetails";
import CustomsPortal from "./features/driver/CustomsPortal";
import Login from "./features/auth/Login";
import NotificationSettings from "./features/admin/NotificationSettings";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<TrackingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateShipment />} />
          <Route path="/admin/notifications" element={<NotificationSettings />} />
          <Route path="/admin/operators" element={<OperatorManagement />} />
          <Route path="/admin/shipment/:id" element={<ShipmentDetailView />} />

          {/* Driver Routes */}
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/shipment/:id" element={<ShipmentDetails />} />
          <Route path="/driver/customs/:id" element={<CustomsPortal />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
