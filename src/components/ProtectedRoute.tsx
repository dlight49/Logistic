import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { UserRole } from "../types";
import { Package } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
                <Package className="w-12 h-12 text-primary animate-pulse mb-4" />
                <p className="text-slate-500 font-medium">Authenticating...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to specialized login based on intended route
        let loginPath = "/login";
        if (location.pathname.startsWith("/admin")) loginPath = "/admin/login";
        else if (location.pathname.startsWith("/driver")) loginPath = "/driver/login";

        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized, redirect to their respective dashboard
        const redirectPath = user.role === "admin" ? "/admin" : user.role === "operator" ? "/driver" : "/customer";
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}
