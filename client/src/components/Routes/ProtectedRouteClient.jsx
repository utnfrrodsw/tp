import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider.jsx";

export default function ProtectedRouteClient() {
    const auth = useAuth();
    const user = auth.getUser();
    return auth.isAuthenticated && !user.esProvedor ? <Outlet /> : <Navigate to="/login" />;
}