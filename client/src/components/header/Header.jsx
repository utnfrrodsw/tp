import React from "react";
import { Link } from 'react-router-dom';
import { NavLink } from '../navlink/Navlink.jsx';
import './Header.css';
import logo from "./logoPosta.png";
import notifylogo from './notify.png';
import userlogo from './user.png';

function Header() {
    return (
        <header className="header-content">
            <div className="logo-content">
                <Link to="/"><img src={logo} alt="No disp" className="logo" /></Link>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/client/home">Cliente</NavLink>
                    </li>
                    <li>
                        <NavLink to="/provider/home">Prestador</NavLink>
                    </li>
                </ul>
            </nav>

            <div className="header-links">
                <div className="links">
                    <Link to="/notify"><img src={notifylogo} alt="" className="notifylogo" /></Link>
                    <Link to="/user"><img src={userlogo} alt="" className="userlogo" /></Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
