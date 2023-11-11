import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider.jsx";

export default function ProtectedRouteClient() {
    const auth = useAuth();
    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}