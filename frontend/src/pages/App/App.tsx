import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { type ReactNode } from "react";
import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Perfil from "../Perfil/Perfil";
import EditorPerfil from "../EditorPerfil/EditorPerfil";
import ForgotPassword from "@/components/Password/ForgotPasswor";
import ResetPassword from "@/components/Password/ResetPassword";
import Gestion from "../Gestion/Gestion";
import WorkOrder from "../Orders/WorkOrderCreating/WorkOrder";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import Validation from "@/pages/Validation/Validation";
import { WebSocketManager } from "@/lib/WebSocketManager";
import OrderDirectory from "../Orders/OrderDirectory/OrderDirectory";
import ManageOrder from "@/pages/Orders/ManageOrder/ManageOrder";
import BudgetPdfPreview from "@/components/PDF/BudgetPdfPreview";
import AppLayout from "@/components/layout/AppLayout";
import BudgetResponse from "@/pages/Budget/BudgetResponse/BudgetResponse";
import UsersManagement from "@/features/users/pages/UserManagement";
import ClientsManagement from "@/features/clients/pages/ClientsManagement";
export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// 🛡️ 1. Creamos un Layout que inyecta el AuthProvider SOLO a sus rutas hijas
const ContenedorConAuth = () => {
  return (
    <AuthProvider>
      <WebSocketManager />
      <Outlet />
    </AuthProvider>
  );
};

const RutaPrivada = ({ children }: { children: ReactNode }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

const RutaPublica = ({ children }: { children: ReactNode }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return !isAuth ? <>{children}</> : <Navigate to="/home" replace />;
};

const RaizRedirect = () => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return <Navigate to={isAuth ? "/home" : "/login"} replace />;
};

const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* No ejecutan el useEffect de /me, ni cargan el contexto        */}

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/validateCuenta/:token" element={<Validation />} />
        <Route path="/budgets/response/:token" element={<BudgetResponse />} />

        {/* Usamos el Layout ContenedorConAuth para agruparlas            */}

        <Route element={<ContenedorConAuth />}>
          <Route path="/" element={<RaizRedirect />} />

          <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
          <Route path="/register" element={<RutaPublica><Register /></RutaPublica>} />

          <Route path="/home" element={<RutaPrivada><Home /></RutaPrivada>} />
          <Route path="/editor-perfil" element={<RutaPrivada><EditorPerfil /></RutaPrivada>} />
          <Route path="/createOrder" element={<RutaPrivada><WorkOrder /></RutaPrivada>} />
          <Route path="/manageOrder" element={<RutaPrivada><OrderDirectory /></RutaPrivada>} />
          <Route path="/manageOrder" element={<RutaPrivada><OrderDirectory /></RutaPrivada>} />
          <Route path="/manageOrder/:id_order" element={<RutaPrivada><ManageOrder /></RutaPrivada>} />
          <Route path="/showBudget/:id_budget" element={<RutaPrivada><BudgetPdfPreview /></RutaPrivada>} />

          <Route element={<AppLayout />}>
            <Route path="/userManagement" element={<RutaPrivada><UsersManagement /></RutaPrivada>} />
            <Route path="/gestion" element={<RutaPrivada><Gestion /></RutaPrivada>} />
            <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
            <Route path="/clientManagement" element={<RutaPrivada><ClientsManagement /></RutaPrivada>} />
          </Route>
        </Route>

        {/* Ruta para capturar errores 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;