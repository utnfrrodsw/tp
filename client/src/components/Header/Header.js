import React from "react";
import { Link} from 'react-router-dom';
import './Header.css'

function Header() {
    return (
        <header className="header-content">
            <div className="logo-content">
                <Link to = "/"><h1 className="title">FastServices</h1></Link>
            </div>
            <div class="header-links">
                <div className="links">
                    <Link to = "/perfil">perfil</Link>
                    <Link to = "/notificaciones">notificaciones</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;