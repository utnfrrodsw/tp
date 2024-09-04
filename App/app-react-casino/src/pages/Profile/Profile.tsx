import { useEffect } from "react";
import './Profile.css';
//import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


export function Profile({id, username, email, phone, password}) {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    
    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if(tokenLogout){
            localStorage.removeItem('jwt-token'); 
            navigate('/'); 
            window.location.reload();
        }
    };
    return (
        <section className="profile-container">
            <div className="left-side">
                <div className="profile-header">
                    <img src="../src/assets/images/91218.jpg" alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <h1 className="name">{username}</h1>
                        <p className="id">ID: {id}</p>
                    </div>
                </div>
                <nav className="menu">
                    <ul>
                        <li className="menu-item"> Profile </li>
                        <li className="menu-item"> Notifications </li>
                        <li className="menu-item"> Verification </li>
                        <li className="menu-item"> Settings </li>
                        <li className="menu-item"> Transactions </li>
                        <li className="menu-item"> Connections </li>
                    </ul>
                </nav>
                <button className="logout-button" onClick={handleLogout}> Log Out </button>
            </div>
            <div className="right-side">
                <div className="user-info-section">
                    <h2 className="section-title font-bold"> My Profile </h2>
                    <form action="">
                        <div className="user-details">
                            <label className="user-details-label"> Username  </label>
                            <div className="input-container">
                                <input type="text" value={username || ''} readOnly className="input-field" />
                            </div>

                            <label className="user-details-label"> Email </label>
                            <div className="input-container">
                                <input type="email" value={email || ''} readOnly className="input-field" />
                                <button className="change-button"> Change </button>
                            </div>

                            <label className="user-details-label"> Phone </label>
                            <div className="input-container">
                                <input type="tel" value={phone || ''} readOnly className="input-field" />
                                <button className="change-button"> Change </button>
                            </div>

                           //Cambiar esto a boton change password

                            <label className="user-details-label"> Password </label>
                            <div className="input-container">
                                <input type="password" value={password || ''} readOnly className="input-field" />
                            </div>

                            <label className="user-details-label"> Confirm Password </label>
                            <div className="input-container">
                                <input type="password" value={password || ''} readOnly className="input-field" />
                                <button className="change-button"> Change </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
