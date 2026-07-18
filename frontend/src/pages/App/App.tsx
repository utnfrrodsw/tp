// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Perfil from "../Perfil/Perfil";
import EditorPerfil from "../EditorPerfil/EditorPerfil";
import ForgotPassword from "@/components/Password/ForgotPasswor";
import ResetPassword from "@/components/Password/ResetPassword";
import Gestion from "../Gestion/Gestion";
import Clientes from "../Clientes/Clientes";

export const capitalize = (text: string): string => {
  if (!text) return ""; // Validación por si viene vacío
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al parsear el JWT:", error);
    return null;
  }
}

// ── Helper — se llama en cada render, nunca se cachea ────────────
function tokenEsValido(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  const payload = parseJwt(token);
  return !!payload && payload.exp * 1000 > Date.now();
}

// ── Rutas protegidas ─────────────────────────────────────────────
// Se evalúa tokenEsValido() cada vez que React renderiza la ruta
const RutaPrivada = ({ children }: { children: ReactNode }) => {
  return tokenEsValido() ? <>{children}</> : <Navigate to="/login" replace />;
};

const RutaPublica = ({ children }: { children: ReactNode }) => {
  return !tokenEsValido() ? <>{children}</> : <Navigate to="/home" replace />;
};

// ── App ──────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={tokenEsValido() ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        <Route path="/login"    element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/register" element={<RutaPublica><Register /></RutaPublica>} />

        <Route path="/home"   element={<RutaPrivada><Home /></RutaPrivada>} />
        <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
        <Route path="/editor-perfil" element={<RutaPrivada><EditorPerfil /></RutaPrivada>} />
        <Route path="/gestion" element={<RutaPrivada><Gestion /></RutaPrivada>} />
        <Route path="/clientes" element={<RutaPrivada><Clientes /></RutaPrivada>} />

        <Route  path="/forgot-password"  element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/*<Route path="/reset-password/:token" element={<ResetPassword />} />*/}


        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;