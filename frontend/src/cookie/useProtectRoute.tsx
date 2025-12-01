// hooks/useProtectRoute.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth.tsx';

type Rol = 'cliente' | 'prestador' | 'notprestador';

export const useProtectRoute = (rolesPermitidos?: Rol[]) => {
  const { usuario, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return; // Esperar a que termine de cargar

    // Si no hay usuario, redirigir al inicio

    // Si no se especificaron roles, redirigir según el rol del usuario
    if (!rolesPermitidos && usuario) {
      if (usuario.rol === 'cliente') {
        navigate('/'); // Redirigir al inicio
      } else if (usuario.rol === 'prestador') {
        navigate('/dashboard'); // Redirigir al dashboard
      }
      return;
    } else {
      if (!usuario) {
        return;
      }
    }

    // Si se especificaron roles y el usuario no los tiene
    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      //si los roles permitidos incluye "prestador" y es cliente. Lo redirijo a la homepage
      if (
        rolesPermitidos.includes('notprestador') &&
        usuario.rol === 'prestador'
      ) {
        navigate('/dashboard'); // Redirigir al dashboard
        return; // Permitir acceso
      }
      if (rolesPermitidos.includes('prestador') && usuario.rol === 'cliente') {
        navigate('/'); // Redirigir al inicio
        return;
      } else if (
        rolesPermitidos.includes('cliente') &&
        usuario.rol === 'prestador'
      ) {
        //si el permitido es cliente y es prestador, lo redirijo a la dashboard
        navigate('/dashboard');
      }
    }
  }, [usuario, loading, rolesPermitidos, navigate]);

  return { usuario, loading };
};

export const useRoleReturn = () => {
  const { usuario } = useAuth();
  return usuario?.rol ?? '';
};
