import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider.jsx";

export default function ProtectedRouteClient() {
    const auth = useAuth();
    console.log(auth);
    const user = auth.getUser();
    console.log(user);
    return auth.isAuthenticated && user.esPrestador ? <Outlet /> : <Navigate to="/login" />;
}