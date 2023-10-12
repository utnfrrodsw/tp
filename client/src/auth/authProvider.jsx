import { createContext, useState, useContext, useEffect} from 'react';
import { API_URL } from './constants';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: () => {},
    getRefreshToken: () => {},
    getUser: () => ({}),
    logout: () => {},
});

export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    },[]);

    async function requestNewAccessToken(refreshToken){
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
            console.log(error);
            return null;
        }
    }

    async function getUserInfo(accessToken){
        try{
            const response = await fetch(`${API_URL}/usuario/auth`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            console.log(response);
            if(response.ok){
                const json = await response.json();

                if(json.error){
                    throw new Error(json.error);
                }
                return json.body;
            }else{
                console.log(response.statusText);
                throw new Error(response.statusText);
            }

        }catch(error){
            console.log(error);
            return null;
        }
    };

    

    function saveSessionInfo(userInfo, accessToken, refreshToken){
        setAccessToken(accessToken);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setIsAuthenticated(true);
        setUser(userInfo);
    }

    function getAccessToken(){
        return accessToken;
    }

    function getRefreshToken(){
        const tokenData = localStorage.getItem("token");
        if(tokenData){
            const token = JSON.parse(tokenData);
            return token;
        }
        return null;
    }

    function saveUser(userData){
        saveSessionInfo(userData.body.user, userData.body.token, userData.body.refreshToken);
    }

    function getUser(){
        return user;
    }

    function logout(){
        localStorage.removeItem("token");
        setAccessToken("");
        setRefreshToken("");
        setUser(undefined);
        setIsAuthenticated(false);
    }

    async function checkAuth(){
        if(accessToken){
            //el usuario esta autenticado
            const userInfo = await getUserInfo(accessToken);
            if(userInfo){
                saveSessionInfo(userInfo, accessToken, getRefreshToken());
                setIsLoading(false);
                return;
            }
        }else{
            //el usuario no esta autenticado
            const token = getRefreshToken();
            if(token){
                const newAccessToken = await requestNewAccessToken(token);
                console.log("newAccessToken: " + newAccessToken)
                if(newAccessToken){
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                        saveSessionInfo(userInfo, newAccessToken, token);
                        setIsLoading(false);
                        return;
                    }
                }
            }
        }
        setIsLoading(false);
    };

    return(
    <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, logout}}>
        {isLoading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);