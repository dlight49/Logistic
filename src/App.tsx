import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./features/public/LandingPage";
import TrackingPage from "./features/public/TrackingPage";
import CustomerDashboard from "./features/customer/CustomerDashboard";
import RequestQuote from "./features/customer/RequestQuote";
import ShipmentHistory from "./features/customer/ShipmentHistory";
import AdminDashboard from "./features/admin/AdminDashboard";
import CreateShipment from "./features/admin/CreateShipment";
import DriverDirectory from "./features/admin/DriverDirectory";
import ShipmentRegistry from "./features/admin/ShipmentRegistry";
import OperatorManagement from "./features/admin/OperatorManagement";
import ShipmentDetailView from "./features/admin/ShipmentDetailView";
import DriverDashboard from "./features/driver/DriverDashboard";
import ShipmentDetails from "./features/driver/ShipmentDetails";
import CustomsPortal from "./features/driver/CustomsPortal";
import Login from "./features/auth/Login";
import AdminLogin from "./features/auth/AdminLogin";
import DriverLogin from "./features/auth/DriverLogin";
import CustomerLogin from "./features/auth/CustomerLogin";
import Register from "./features/auth/Register";
import CustomerSettings from "./features/customer/CustomerSettings";
import AdminSettings from "./features/admin/AdminSettings";
import OperatorProfileView from "./features/admin/OperatorProfileView";
import AdminSupport from "./features/admin/AdminSupport";
import AdminTicketDetail from "./features/admin/AdminTicketDetail";
import AdminChat from "./features/admin/AdminChat";
import DriverChat from "./features/driver/DriverChat";
import QuoteManagement from "./features/admin/QuoteManagement";
import TicketList from "./features/customer/TicketList";
import TicketDetail from "./features/customer/TicketDetail";

export default function App(): ReactNode {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/driver/login" element={<DriverLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/quote" element={<ProtectedRoute allowedRoles={["customer"]}><RequestQuote /></ProtectedRoute>} />
            <Route path="/customer/history" element={<ProtectedRoute allowedRoles={["customer"]}><ShipmentHistory /></ProtectedRoute>} />
            <Route path="/customer/settings" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerSettings /></ProtectedRoute>} />
            <Route path="/customer/tickets" element={<ProtectedRoute allowedRoles={["customer"]}><TicketList /></ProtectedRoute>} />
            <Route path="/customer/tickets/:id" element={<ProtectedRoute allowedRoles={["customer"]}><TicketDetail /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/shipments" element={<ProtectedRoute allowedRoles={["admin"]}><ShipmentRegistry /></ProtectedRoute>} />
            <Route path="/admin/create" element={<ProtectedRoute allowedRoles={["admin"]}><CreateShipment /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/operators" element={<ProtectedRoute allowedRoles={["admin"]}><OperatorManagement /></ProtectedRoute>} />
            <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={["admin"]}><DriverDirectory /></ProtectedRoute>} />
            <Route path="/admin/support" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSupport /></ProtectedRoute>} />
            <Route path="/admin/support/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTicketDetail /></ProtectedRoute>} />
            <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={["admin"]}><AdminChat /></ProtectedRoute>} />
            <Route path="/admin/operator/:id" element={<ProtectedRoute allowedRoles={["admin"]}><OperatorProfileView /></ProtectedRoute>} />
            <Route path="/admin/shipment/:id" element={<ProtectedRoute allowedRoles={["admin"]}><ShipmentDetailView /></ProtectedRoute>} />
            <Route path="/admin/quotes" element={<ProtectedRoute allowedRoles={["admin"]}><QuoteManagement /></ProtectedRoute>} />

            {/* Driver Routes — NOTE: allowedRoles uses 'operator' (canonical DB value).
                The UI displays this role as "Driver". Do NOT rename to 'driver' here
                without first migrating all Firestore user records. */}
            <Route path="/driver" element={<ProtectedRoute allowedRoles={["operator"]}><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/documents" element={<ProtectedRoute allowedRoles={["operator"]}><CustomsPortal /></ProtectedRoute>} />
            <Route path="/driver/chat" element={<ProtectedRoute allowedRoles={["operator"]}><DriverChat /></ProtectedRoute>} />
            <Route path="/driver/profile" element={<ProtectedRoute allowedRoles={["operator"]}><OperatorProfileView /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
