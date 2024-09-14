import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home.tsx'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import { Header } from './components/Header/Header.tsx'
import { Footer } from './components/Footer/Footer.tsx'

import { Dice } from './components/Games/Dice/Dice.tsx'
import { Slot } from './components/Games/Slots/Slot.tsx'
import { Wheel } from './components/Games/Wheel/Wheel.tsx'

import { Listado } from './components/Axios/Listado/Listado.tsx'
import { PostUser } from './components/Axios/PostUser/PostUser.tsx'
import { GetOne } from './components/Axios/GetOne/getone.tsx'
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

interface User{
    id_user: number
    username: string
    balance: number
    role: string
    email: string
    phone: number
    password: string
}

export function App() {
    const [userData, setUserData] = useState<User | null>(null);
    const [dinero, setDinero] = useState(0);

    useEffect(() => {
        fetchUserProfile();
    }, []);
    
    

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwt-token');
        
        if (!token) {
            console.error('No se encontró la token.');
            return;
        }
            
        const decoded: any = jwtDecode(token);
        console.log("Contenido del token decodificado:", decoded.data.id_user);

        const userIdFromToken = decoded.data.id_user;
        // console.log("ID del usuario desde la token:", userIdFromToken); NO ANDA NO SE PQ

        const response = await fetch(`http://localhost:3000/api/v1/users/${userIdFromToken}`);

        const authenticatedUser: User = await response.json();
        console.log('Usuario autenticado:', authenticatedUser);

        if (authenticatedUser) {
            setUserData(authenticatedUser);
            setDinero(authenticatedUser.balance);
        }
        
    };

    const id = userData?.id_user
    let profile = '/profile/'+userData?.username

    return(
        <>
        
            <Header balance={dinero} profile={profile} role={userData?.role ?? ''} username={userData?.username ?? ''}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dice" element={<Dice />} />
                    <Route path="/slot" element={<Slot id={id} balance={dinero} onMoney={setDinero}/>} />
                    <Route path="/wheel" element={<Wheel id={id} balance={dinero} onMoney={setDinero}/>} />
                    <Route path="/live_roulette" element={<RouletteLive />} />
                    <Route path="*" element={<ErrorPage />} />
                    <Route path="/listado" element={<Listado/>} />
                    <Route path="/postuser" element={<PostUser />} />
                    <Route path="/getone" element={<GetOne />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/details" element={<Details />} />
                    <Route path="/edituser" element={<EditUser />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/terms-and-conditions" element={<Terms />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/help' element={<Help />} />
                    <Route path='/fair' element={<Fair />} />
                    <Route path='/game-policy' element={<GamePolicy />} />
                    <Route path='/admin-uses' element={<AdminUses />} />
                    <Route path={'/bettinghistory'} element={<BettingHistory/>} />
                    <Route path={profile} element={<Profile id={userData?.id_user} username={userData?.username} email={userData?.email} phone={userData?.phone} password={userData?.password} />} />

                    <Route path='/register' element={<RegisterAgus />} />
                    
                </Routes>
            <Footer/>
            <Toaster richColors position='top-right' closeButton/>
        </>
        
    )
}