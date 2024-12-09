import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from 'sonner'
import { createContext } from 'react'

import { UserList } from './components/AdminPages/UserList/UserList.tsx'
import { Details } from './components/AdminPages/Details/Details.tsx'
import { EditUser } from './components/AdminPages/EditUser/EditUser.tsx'

import { Dice } from './components/Games/Dice/Dice.tsx'
import { Slots } from './components/Games/Slots/Slots.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'

import { Terms } from './components/InfoPages/Terms/Terms.tsx'
import { AboutUs } from './components/InfoPages/AboutUs/AboutUs.tsx'
import { PrivacyPolicy } from './components/InfoPages/PrivacyPolicy/privacyPolicy.tsx'
import { Help } from './components/InfoPages/Help/help.tsx'
import { Fair } from './components/InfoPages/Fair/fair.tsx'
import { GamePolicy } from './components/InfoPages/GamePolicy/gamePolicy.tsx'

import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import { HomePage } from './components/HomePage/HomePage.tsx'
import { Register } from './components/Register/Register.tsx'
import { Profile } from './components/Profile/Profile.tsx'
import { ErrorPage } from './components/ErrorPage/ErrorPage.tsx'
import { BettingHistory } from './components/Profile/BettingHistory/BettingHistory.tsx'
import { Leaderboard } from './components/Leaderboard/Leaderboard.tsx'

export const userContext = createContext({
    id_user: "",
    username: "",
    phone: "",
    email: "",
    role: ""
});

export function App() {
    const [user, setUser] = useState({
        id_user: "",
        username: "",
        phone: "",
        email: "",
        role: ""
    });
    const [money, setMoney] = useState(0);

    useEffect(() => {
        fetchUserProfile();
    }, []);
    

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwt-token');
        
        if (!token) {
            console.error('Token not found.');
            return;
        }
            
        const decoded: any = jwtDecode(token);

        if (decoded) {
            setUser(decoded.data)
            setMoney(decoded.data.balance);
        }
        
    };

    const profile = '/profile/'+ user.username

    return(
        <>
            <userContext.Provider value={user}>
                <Header balance={money} profile={profile} role={user.role ?? ''} username={user.username ?? ''} setMoney={setMoney} idUser={user.id_user ?? ''}/>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path='/register' element={<Register />} />
                        <Route path="*" element={<ErrorPage />} />

                        <Route path={'/bettinghistory'} element={<BettingHistory idUser={user.id_user} username={user.username} role={user.role}/>} />
                        <Route path={profile} element={<Profile id={user.id_user} username={user.username} email={user.email} phone={user.phone} />} />

                        <Route path="/leaderboard" element={<Leaderboard role={user.role} />} />
                        <Route path="/dice" element={<Dice id={user.id_user} balance={money} setMoney={setMoney} role={user.role} />} />
                        <Route path="/slot" element={<Slots id={user.id_user} balance={money} setMoney={setMoney} role={user.role} />} />
                        <Route path="/wheel" element={<Wheel id={user.id_user} balance={money} setMoney={setMoney} role={user.role} />} />
                        
                        <Route path="/userlist" element={<UserList role={user.role} />} />

                        <Route path="/userlist/details/:id" element={<Details role={user.role} />} />
                        <Route path="/userlist/edituser/:id" element={<EditUser role={user.role}  />} />

                        <Route path="/terms-and-conditions" element={<Terms />} />
                        <Route path='/about-us' element={<AboutUs />} />
                        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                        <Route path='/help' element={<Help />} />
                        <Route path='/fair' element={<Fair />} />
                        <Route path='/game-policy' element={<GamePolicy />} />
                    </Routes>
                <Footer/>
                <Toaster richColors position='top-right' closeButton/>
            </userContext.Provider>
        </>
        
    )
}