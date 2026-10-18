// AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import BACKEND_URL from "@/lib/config";

interface User {
  id_user:       number;
  userName:      string;
  email:         string;
  rol:           string;
  status:        boolean;
  urlPicture:    string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, loading, refetchUser: getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};