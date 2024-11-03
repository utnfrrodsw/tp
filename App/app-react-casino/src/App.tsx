import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Toaster } from 'sonner'

import { Header, Footer, HomePage, Register, Profile, ErrorPage, BettingHistory, Leaderboard } from "./components";
import { Terms, AboutUs, PrivacyPolicy, Help, Fair, GamePolicy } from './components/InfoPages'
import { Dice, Slots, Wheel } from './components/Games'
import { UserList, Details, EditUser } from './components/AdminPages'


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
        
            <Header balance={money} profile={profile} role={role ?? ''} username={username ?? ''} setMoney={setMoney} idUser={id ?? ''}/>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path="*" element={<ErrorPage />} />

                    <Route path={'/bettinghistory'} element={<BettingHistory idUser={id} username={username} role={role}/>} />
                    <Route path={profile} element={<Profile id={id} username={username} email={email} phone={phone} />} />

                    <Route path="/leaderboard" element={<Leaderboard role={role} />} />
                    <Route path="/dice" element={<Dice id={id} balance={money} setMoney={setMoney} role={role} />} />
                    <Route path="/slot" element={<Slots id={id} balance={money} setMoney={setMoney} role={role} />} />
                    <Route path="/wheel" element={<Wheel id={id} balance={money} setMoney={setMoney} role={role} />} />
                    
                    <Route path="/userlist" element={<UserList role={role} />} />

                    <Route path="/userlist/details/:id" element={<Details role={role} />} />
                    <Route path="/userlist/edituser/:id" element={<EditUser role={role}  />} />

                    <Route path="/terms-and-conditions" element={<Terms />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/help' element={<Help />} />
                    <Route path='/fair' element={<Fair />} />
                    <Route path='/game-policy' element={<GamePolicy />} />
                </Routes>
            <Footer/>
            <Toaster richColors position='top-right' closeButton/>
        </>
        
    )
}