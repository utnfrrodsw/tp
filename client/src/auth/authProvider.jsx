import { createContext, useState, useContext, useEffect} from 'react';
import { API_URL } from './constants';
import Loader from '../components/load/lodearCentro/Loader';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: () => {},
    getRefreshToken: () => {},
    getUser: () => ({}),
    logout: () => {},
});

export function AuthProvider({children}) {
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [accessToken, setAccessToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    },[]);

    async function requestNewAccessToken(refreshToken){
        // pide un nuevo token de entrada enviando el de refresco
        try{
            const response = await fetch(`${API_URL}/usuario/refreshToken`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            })
            if(response.ok){
                const json = await response.json();
                //setAccessToken(json.body.accessToken);
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            }else{
                throw new Error(response.statusText);
            }
        }catch(error){
            
            return null;
        }
    }

    async function getUserInfo(accessToken){
        // trae la info del usuario con el token de entrada
        try{
            const response = await fetch(`${API_URL}/usuario/auth`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body;
            }else{
                
                throw new Error(response.statusText);
            }

        }catch(error){
            
            return null;
        }
    };

    function saveSessionInfo(userInfo, accessToken, refreshToken){
        setAccessToken(accessToken); // guarda token de entrada
        localStorage.setItem("token", JSON.stringify(refreshToken)); // guarda token de refresco en localstorage
        setIsAuthenticated(true); // setea el estado de autenticacion
        setUser(userInfo); // guarda el usuario en el estado
    }

    function getAccessToken(){
        return accessToken;
    }

    function getRefreshToken(){
        const tokenData = localStorage.getItem("token"); // obtiene el token de refresco del localstorage
        if(tokenData){ // chequea si hay un token de refresco
            const token = JSON.parse(tokenData); // parsea el token de refresco
            return token; 
        }
        return null; // no hay token de refresco
    }

    function saveUser(userData){
        localStorage.setItem("user", JSON.stringify(userData.body.user)); // guarda el usuario en localstorage
        saveSessionInfo(userData.body.user, userData.body.token, userData.body.refreshToken); // guarda info de los tokens
    }

    function getUser(){
        return user; // devuelve el usuario del estado
    }

    function logout(){
        localStorage.removeItem("token"); // borra el token de refresco del localstorage
        localStorage.removeItem("user"); // borra el usuario del localstorage
        setAccessToken(""); // borra el token de entrada
        setUser(undefined); // borra el usuario del estado
        setIsAuthenticated(false); // setea el estado de autenticacion
    }

    async function checkAuth(){
        if(accessToken){ // chequea si hay un token de entrada
            //el usuario esta autenticado
            const userInfo = await getUserInfo(accessToken); // pide la info del usuario con el token de entrada
            if(userInfo){
                saveSessionInfo(userInfo, accessToken, getRefreshToken()); // guarda info de los tokens
                setIsLoading(false);
                return;
            }
        }else{ // no hay token de entrada
            //el usuario no esta autenticado
            const token = getRefreshToken(); 
            if(token){ // chequea si hay un token de refresco
                const newAccessToken = await requestNewAccessToken(token); // pide un nuevo token de entrada enviando el de refresco
                
                if(newAccessToken){ // chequea si el nuevo token de entrada es valido
                    const userInfo = await getUserInfo(newAccessToken); // pide la info del usuario con el nuevo token de entrada
                    if(userInfo){ // chequea si la info del usuario es valida
                        saveSessionInfo(userInfo, newAccessToken, token); // guarda info de los tokens
                        setIsLoading(false); 
                        return;
                    }
                }
            }
            // no hay token de refresco
        }
        setIsLoading(false);
    };

    return(
    <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, logout}}>
        {isLoading ? <Loader />: children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);