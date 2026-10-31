import { useState } from 'react';

import AuthPage from './modules/auth/pages/AuthPage';

import Dashboard from './modules/empresas/components/Dashboard';
import ClienteDashboard from './modules/clientes/components/Dashboard';
import AdminDashboard from './modules/admin/components/Dashboard';

import type { UsuarioAutenticado } from './modules/auth/components/LoginForm';
import './App.scss';

// Guardamos la sesion en localStorage para no perderla cuando el navegador
// recarga la pagina (por ejemplo al volver de pagar en Mercado Pago, o al
// apretar la flecha de "atras"). Sin esto, al recargar se perdia el login
// y la app mandaba directo a la pantalla de inicio de sesion.
const CLAVE_SESION = 'planit_sesion';

function leerSesionGuardada(): UsuarioAutenticado | null {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION);
    if (!guardado) return null;
    return JSON.parse(guardado) as UsuarioAutenticado;
  } catch {
    return null;
  }
}

export default function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<UsuarioAutenticado | null>(leerSesionGuardada);

  // Guarda el usuario en localStorage y en el estado cuando inicia sesion
  function manejarInicioSesion(usuario: UsuarioAutenticado) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    setUsuarioAutenticado(usuario);
  }

  // Borra la sesion guardada y vuelve a la pantalla de login
  function manejarCierreSesion() {
    localStorage.removeItem(CLAVE_SESION);
    setUsuarioAutenticado(null);
  }

  if (!usuarioAutenticado) {
    return (
      <main className="contenedor-app">
        <AuthPage alIniciarSesion={manejarInicioSesion} />
      </main>
    );
  }

  const userRole = usuarioAutenticado.role;

  // CLIENTE
  if (userRole === 'cliente') {
    return (
      <main className="contenedor-app contenedor-dashboard">
        <ClienteDashboard
          nombreUsuario={usuarioAutenticado.nombre}
          token={usuarioAutenticado.token}
          onLogout={manejarCierreSesion}
        />
      </main>
    );
  }

  // ADMINISTRADOR
// ADMINISTRADOR
if (userRole === 'admin') {
  return (
    <main className="contenedor-app contenedor-dashboard">
      <AdminDashboard
        token={usuarioAutenticado.token}
        onLogout={manejarCierreSesion}
      />
    </main>
  );
}

  // EMPRESA
  return (
    <main className="contenedor-app contenedor-dashboard">
      <Dashboard
        usuarioId={usuarioAutenticado.id}
        token={usuarioAutenticado.token}
        onLogout={manejarCierreSesion}
      />
    </main>
  );
}