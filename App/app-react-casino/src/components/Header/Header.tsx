import { NavLink as Link } from 'react-router-dom'
import { LogIn } from '../../components/LogIn/LogIn';
import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import './Header.css'
    interface User {
        id_user: number;
        balance: number;
    }
    export function Header() {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
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
        }
        
    };
    const [modalOpen, setModalOpen] = useState(false);

    const handleButtonClick = () => {
        setModalOpen(false);
    };

    return (
        <header className='fixed top-0 w-full z-20'>
            {modalOpen && <LogIn onClose={handleButtonClick} />}
            <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
                <Link to="/"><img className='max-h-16 spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                <div className='header-content'>
                    <div className='space-x-10'>
                        <a href="" className='balance'>${userData?.balance ?? 0}<img className='balance-img' src="../../src/assets/images/mp-logo.svg" alt="" /></a>
                        <Link to="/about-us" className="nav-item">About Us</Link>
                        <Link to="/chau" className="nav-item">Daily Free</Link>
                        <Link to="/profile" className="nav-item">Profile</Link>
                        <button className='gold-button' onClick={() => setModalOpen(true)}>SignUp</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
