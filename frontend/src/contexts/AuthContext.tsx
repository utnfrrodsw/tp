import React, { createContext, useContext, useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (userData: Usuario, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ AGREGAR
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ AGREGAR

  // ✅ CARGAR DATOS AL INICIAR
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsuario = localStorage.getItem('usuario');

    console.log('🔍 AuthContext - Cargando datos:', { savedToken: !!savedToken, savedUsuario: !!savedUsuario });

    if (savedToken && savedUsuario) {
      try {
        const userData = JSON.parse(savedUsuario);
        setToken(savedToken);
        setUsuario(userData);
        console.log('✅ Usuario cargado:', userData);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: Usuario, authToken: string) => {
    console.log('🔍 AuthContext - Login:', userData);
    setUsuario(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = !!usuario && !!token;

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};