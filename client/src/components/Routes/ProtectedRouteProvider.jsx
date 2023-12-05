import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider.jsx";

export default function ProtectedRouteClient() {
    const auth = useAuth();
    
    const user = auth.getUser();
    
    return auth.isAuthenticated && user.esPrestador ? <Outlet /> : <Navigate to="/login" />;
}