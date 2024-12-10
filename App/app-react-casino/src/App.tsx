import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from 'sonner'
import { createContext } from 'react'
import axios from './libs/axios.tsx'

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

import { FailPage } from './components/MercadoPagoPages/FailPage/FailPage.tsx'
import { PendingPage } from './components/MercadoPagoPages/PendingPage/PendingPage.tsx'
import { SuccessPage } from './components/MercadoPagoPages/SuccessPage/SuccessPage.tsx'

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
    role: "",
});

export function App() {
    const [user, setUser] = useState({
        id_user: "",
        username: "",
        phone: "",
        email: "",
        role: "",
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
            getBalance(decoded.data.id_user, token, decoded.data.role);
        }
        
    };

    const profile = '/profile/'+ user.username

    const getBalance = (id: string, token: string, role: string) => {
        axios.get(`/users/readBalance/${id}`, { params: { token, role } }).then((response) => {
            setMoney(response.data[0].balance);
        });
    };


    return(
        <>
            <userContext.Provider value={user}>
                <Header balance={money} profile={profile} setMoney={setMoney}/>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path='/register' element={<Register />} />
                        <Route path="*" element={<ErrorPage />} />

                        <Route path={'/bettinghistory'} element={<BettingHistory/>} />
                        <Route path={profile} element={<Profile/>} />

                        <Route path="/leaderboard" element={<Leaderboard/>} />
                        <Route path="/dice" element={<Dice balance={money} setMoney={setMoney}/>} />
                        <Route path="/slot" element={<Slots balance={money} setMoney={setMoney}/>} />
                        <Route path="/wheel" element={<Wheel balance={money} setMoney={setMoney}/>} />
                        
                        <Route path="/userlist" element={<UserList/>} />

                        <Route path="/userlist/details/:id" element={<Details/>} />
                        <Route path="/userlist/edituser/:id" element={<EditUser/>} />

                        <Route path='/fail' element={<FailPage/>} />
                        <Route path='/pending' element={<PendingPage />} />
                        <Route path='/success' element={<SuccessPage />} />

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