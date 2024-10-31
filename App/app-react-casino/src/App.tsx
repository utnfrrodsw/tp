import { Routes, Route, useResolvedPath } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'

import { Dice } from './components/Games/Dice/Dice.tsx'
import { Slot } from './components/Games/Slots/Slot.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'

import { Listado } from './components/Axios/Listado/Listado.tsx'
import { User } from './components/Axios/User/User.tsx'
import { Details } from './components/Axios/Details/Details.tsx'
import { EditUser } from './components/Axios/EditUser/EditUser.tsx'
import { Leaderboard } from './components/Axios/Leaderboard/Leaderboard.tsx'

import { RegisterAgus } from './components/RegisterAgus/RegisterAgus.tsx'

import { Terms } from './pages/Terms/Terms.tsx'
import { AboutUs } from './pages/AboutUs/AboutUs.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy/privacyPolicy.tsx'
import { Help } from './pages/Help/help.tsx'
import { Fair } from './pages/Fair/fair.tsx'
import { GamePolicy } from './pages/GamePolicy/gamePolicy.tsx'
import { RouletteLive } from './pages/RouletteLive/RouletteLive.tsx'
import { ErrorPage } from './pages/ErrorPage/ErrorPage.tsx'
import { AdminUses } from './pages/AdminUses/adminUses.tsx'
import { Profile } from './pages/Profile/Profile.tsx'
import { BettingHistory } from './pages/Profile/BettingHistory/BettingHistory.tsx'

import { Toaster } from 'sonner'


export function App() {

    const [money, setMoney] = useState(0);
    const [id, setUserId] = useState('');
    const [role, setUserRole] = useState('');
    const [username, setUserName] = useState('');
    const [email, setUserEmail] = useState('');
    const [phone, setUserPhone] = useState('');
    

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
        //const userPass = decoded.data.password;

        //const response = await fetch(`http://localhost:3000/api/v1/users/${userIdFromToken}`);

        //const authenticatedUser: User = await response.json();
        //console.log('Autenthicated User:', authenticatedUser);

        if (decoded) {
            setUserId(decoded.data.id_user)
            setUserRole(decoded.data.role)
            setUserName(decoded.data.username)
            setUserEmail(decoded.data.email)
            setUserPhone(decoded.data.phone)
            setMoney(decoded.data.balance);
        }
        
    };

    let profile = '/profile/'+ username

    return(
        <>
        
            <Header balance={money} profile={profile} role={role ?? ''} username={username ?? ''} onMoney={setMoney} idUser={id ?? ''}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dice" element={<Dice id={id} balance={money} setMoney={setMoney}/>} />
                    <Route path="/slot" element={<Slot id={id} balance={money} setMoney={setMoney}/>} />
                    <Route path="/wheel" element={<Wheel id={id} balance={money} setMoney={setMoney}/>} />
                    <Route path="/live_roulette" element={<RouletteLive />} />
                    <Route path="*" element={<ErrorPage />} />
                    <Route path="/listado" element={<Listado/>} />
                    <Route path="/user" element={<User role={role} />} />

                    <Route path="/details/:id" element={<Details role={role}/>} />
                    <Route path="/edituser/:id" element={<EditUser role={role}/>} />

                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/terms-and-conditions" element={<Terms />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/help' element={<Help />} />
                    <Route path='/fair' element={<Fair />} />
                    <Route path='/game-policy' element={<GamePolicy />} />

                    <Route path='/admin-uses' element={<AdminUses />} />

                    <Route path={'/bettinghistory'} element={<BettingHistory idUser={id} username={username}/>} />
                    <Route path={profile} element={<Profile id={id} username={username} email={email} phone={phone} />} />
                    <Route path='/register' element={<RegisterAgus />} />
                    
                </Routes>
            <Footer/>
            <Toaster richColors position='top-right' closeButton/>
        </>
        
    )
}