import { useEffect, useState } from "react";
import './Profile.css';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface User {
    id_user: number;
    username: string;
    email: string;
    phone: string;
    password: string;
}

export function Profile() {
    const [userData, setUserData] = useState<User | null>(null);
    const navigate = useNavigate();

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
    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if(tokenLogout){
            localStorage.removeItem('jwt-token');
            setUserData(null); 
            navigate('/'); 
        }
    };
    return (
        <section className="profile-container">
            <div className="left-side">
                <div className="profile-header">
                    <img src="../src/assets/images/91218.jpg" alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <h1 className="name">{userData?.username}</h1>
                        <p className="id">ID: {userData?.id_user}</p>
                    </div>
                </div>
                <nav className="menu">
                    <ul>
                        <li className="menu-item">Perfil</li>
                        <li className="menu-item">Notificaciones</li>
                        <li className="menu-item">Verificación</li>
                        <li className="menu-item">Configuración</li>
                        <li className="menu-item">Transacciones</li>
                        <li className="menu-item">Conexiones</li>
                    </ul>
                </nav>
                <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <div className="right-side">
                <div className="user-info-section">
                    <h2 className="section-title">Información del usuario</h2>
                    <form action="">
                        <div className="user-details">
                            <label className="user-details-label">Nombre de usuario</label>
                            <div className="input-container">
                                <input type="text" value={userData?.username || ''} readOnly className="input-field" />
                            </div>

                            <label className="user-details-label">Correo electrónico</label>
                            <div className="input-container">
                                <input type="email" value={userData?.email || ''} readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>

                            <label className="user-details-label">Número de teléfono</label>
                            <div className="input-container">
                                <input type="tel" value={userData?.phone || ''} readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>

                            <label className="user-details-label">Contraseña</label>
                            <div className="input-container">
                                <input type="password" value={userData?.password || ''} readOnly className="input-field" />
                            </div>

                            <label className="user-details-label">Confirmar Contraseña</label>
                            <div className="input-container">
                                <input type="password" value={userData?.password || ''} readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
