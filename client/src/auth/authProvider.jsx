import { createContext, useState, useContext, useEffect} from 'react';
import { API_URL } from './constants';

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: () => {},
    getRefreshToken: () => {},
});

export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState({});
    const [refreshToken, setRefreshToken] = useState("");

    useEffect(() => {
        checkAuth();
    },[]);

    async function requestNewAccessToken(){
        try{
            const response = await fetch(`${API_URL}/usuario/refreshToken`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + refreshToken,
                },
            })
            if(response.ok){
                const json = await response.json();
                setAccessToken(json.body.accessToken);
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
                    Authorization: "Bearer "+ accessToken,
                },
            })

            if(response.ok){
                const json = await response.json();

                if(json.error){
                    throw new Error(json.error);
                }
                return json;
            }else{
                throw new Error(response.statusText);
            }

        }catch(error){
            console.log(error);
            return null;
        }
    };

    async function checkAuth(){
        if(accessToken){
            //el usuario esta autenticado

        }else{
            //el usuario no esta autenticado
            const token = getRefreshToken();
            if(token){
                const newAccessToken = await requestNewAccessToken(token);
                if(newAccessToken){
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                        saveSessionInfo(userInfo, newAccessToken, token);
                    }
                    setIsAuthenticated(true);
                    setUser(userInfo);
                }
            }
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
        const tokenData = localStorage.getItem("token") || null;
        if(tokenData){
            const token = JSON.parse(tokenData);
            return token;
        }
        return null;
    }

    function saveUser(userData){
        saveSessionInfo(userData.body.user, userData.body.token, userData.body.refreshToken);
    }

    return(
    <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, getRefreshToken}}>
        {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);