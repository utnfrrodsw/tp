import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider.jsx";

export default function ProtectedRoute() {
    const auth = useAuth();
    if(!auth.isAuthenticated){
        return <Outlet />;
    }else{
        if(auth.getUser().esPrestador){
            return <Navigate to="/provider/home" />;
        }else{
            return <Navigate to="/client/home" />;
        }
    }
}