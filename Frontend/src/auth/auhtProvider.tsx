import { useContext, createContext, useState, useEffect } from "react"; //crear un componente que maneje el estado durante toda la app

interface AuthProviderProps {
    children: React.ReactNode
}

//crear el contexto
const AuthContext = createContext({
    isAuthenticated: false,
})

export function AuthProvider({ children }: AuthProviderProps) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    return(
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}

//exportar el hook para poder controlar en cualquier parte el acceso 
export const useAuth = () => useContext(AuthContext) 