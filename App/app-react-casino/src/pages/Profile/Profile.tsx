import { useEffect } from "react";
import './Profile.css';

export function Profile() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="profile-container">
            <div className="left-side">
                <div className="profile-header">
                    <img src="../src/assets/images/91218.jpg" alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <h1 className="name">lukS</h1>
                        <p className="id">ID: 91218</p>
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
                <button className="logout-button">Cerrar sesión</button>
            </div>
            <div className="right-side">
                <div className="user-info-section">
                    <h2 className="section-title">Información del usuario</h2>
                    <form action="">
                        <div className="user-details">
                            <label className="user-details-label">Nombre de usuario</label>
                            <div className="input-container">
                                <input type="text" value="lukS" readOnly className="input-field" />
                            </div>

                            <label className="user-details-label">Correo electrónico</label>
                            <div className="input-container">
                                <input type="email" value="lucasmaggi03@gmail.com" readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>

                            <label className="user-details-label">Número de teléfono</label>
                            <div className="input-container">
                                <input type="tel" value="3412710361" readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>

                            <label className="user-details-label">Password</label>
                            <div className="input-container">
                                <input type="password" value="121412412" readOnly className="input-field" />
                            </div>

                            <label className="user-details-label">Confirm Password</label>
                            <div className="input-container">
                                <input type="password" value="121412412" readOnly className="input-field" />
                                <button className="change-button">Cambiar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
