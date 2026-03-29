import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./features/public/LandingPage";
import TrackingPage from "./features/public/TrackingPage";
import CustomerDashboard from "./features/customer/CustomerDashboard";
import ShipmentHistory from "./features/customer/ShipmentHistory";
import CustomerShipmentDetail from "./features/customer/CustomerShipmentDetail";
import AdminDashboard from "./features/admin/AdminDashboard";
import CreateShipment from "./features/admin/CreateShipment";
import DriverDirectory from "./features/admin/DriverDirectory";
import ShipmentRegistry from "./features/admin/ShipmentRegistry";
import OperatorManagement from "./features/admin/OperatorManagement";
import UserManagement from "./features/admin/UserManagement";
import ShipmentDetailView from "./features/admin/ShipmentDetailView";
import DriverDashboard from "./features/driver/DriverDashboard";
import ShipmentDetails from "./features/driver/ShipmentDetails";
import CustomsPortal from "./features/driver/CustomsPortal";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import CustomerSettings from "./features/customer/CustomerSettings";
import AdminSettings from "./features/admin/AdminSettings";
import AdminNotifications from "./features/admin/AdminNotifications";
import DriverSettings from "./features/driver/DriverSettings";
import OperatorProfileView from "./features/admin/OperatorProfileView";
import AdminSupport from "./features/admin/AdminSupport";
import AdminTicketDetail from "./features/admin/AdminTicketDetail";
import AdminChat from "./features/admin/AdminChat";
import DriverChat from "./features/driver/DriverChat";
import QuoteManagement from "./features/admin/QuoteManagement";
import AdminQuoteDetail from "./features/admin/AdminQuoteDetail";
import TicketList from "./features/customer/TicketList";
import TicketDetail from "./features/customer/TicketDetail";
import PrivacyPolicy from "./features/public/PrivacyPolicy";
import TermsOfService from "./features/public/TermsOfService";
import { NeonAuthPage, NeonAccountPage } from "./features/auth/NeonAuth";

export default function App(): ReactNode {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            <CookieConsent />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/login" element={<NeonAuthPage />} />
              <Route path="/admin/login" element={<NeonAuthPage />} />
              <Route path="/driver/login" element={<NeonAuthPage />} />
              <Route path="/account" element={<ProtectedRoute><NeonAccountPage /></ProtectedRoute>} />
              <Route path="/register" element={<Navigate to="/login" replace />} />

              {/* Customer Routes */}
              <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/history" element={<ProtectedRoute allowedRoles={["customer"]}><ShipmentHistory /></ProtectedRoute>} />
              <Route path="/customer/settings" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerSettings /></ProtectedRoute>} />
              <Route path="/customer/tickets" element={<ProtectedRoute allowedRoles={["customer"]}><TicketList /></ProtectedRoute>} />
              <Route path="/customer/tickets/:id" element={<ProtectedRoute allowedRoles={["customer"]}><TicketDetail /></ProtectedRoute>} />
              <Route path="/customer/shipment/:id" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerShipmentDetail /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/shipments" element={<ProtectedRoute allowedRoles={["admin"]}><ShipmentRegistry /></ProtectedRoute>} />
              <Route path="/admin/create" element={<ProtectedRoute allowedRoles={["admin"]}><CreateShipment /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={["admin"]}><AdminNotifications /></ProtectedRoute>} />
              <Route path="/admin/operators" element={<ProtectedRoute allowedRoles={["admin"]}><OperatorManagement /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={["admin"]}><DriverDirectory /></ProtectedRoute>} />
              <Route path="/admin/support" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSupport /></ProtectedRoute>} />
              <Route path="/admin/support/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTicketDetail /></ProtectedRoute>} />
              <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={["admin"]}><AdminChat /></ProtectedRoute>} />
              <Route path="/admin/operator/:id" element={<ProtectedRoute allowedRoles={["admin"]}><OperatorProfileView /></ProtectedRoute>} />
              <Route path="/admin/shipment/:id" element={<ProtectedRoute allowedRoles={["admin"]}><ShipmentDetailView /></ProtectedRoute>} />
              <Route path="/admin/quotes" element={<ProtectedRoute allowedRoles={["admin"]}><QuoteManagement /></ProtectedRoute>} />
              <Route path="/admin/quotes/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminQuoteDetail /></ProtectedRoute>} />

              {/* Driver Routes */}
              <Route path="/driver" element={<ProtectedRoute allowedRoles={["operator"]}><DriverDashboard /></ProtectedRoute>} />
              <Route path="/driver/shipment/:id" element={<ProtectedRoute allowedRoles={["operator"]}><ShipmentDetails /></ProtectedRoute>} />
              <Route path="/driver/customs/:id" element={<ProtectedRoute allowedRoles={["operator"]}><CustomsPortal /></ProtectedRoute>} />
              <Route path="/driver/documents" element={<ProtectedRoute allowedRoles={["operator"]}><CustomsPortal /></ProtectedRoute>} />
              <Route path="/driver/chat" element={<ProtectedRoute allowedRoles={["operator"]}><DriverChat /></ProtectedRoute>} />
              <Route path="/driver/profile" element={<ProtectedRoute allowedRoles={["operator"]}><DriverSettings /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
