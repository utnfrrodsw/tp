import React from "react";
import { Link } from 'react-router-dom';
import './Header.css'
import userlogo from './user.png'
import notifylogo from './notify.png'
import { NavLink } from '../navlink/Navlink.jsx';
import logo from "./logoPosta.png"



function Header() {
    return (
        <header className="header-content">
            <div className="logo-content">
                <Link to = "/"><img src={logo} alt="No disp" className="logo"/></Link>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink to = "/client/home">Cliente</NavLink>
                    </li>
                    <li>
                        <NavLink to = "/">Prestador</NavLink>
                    </li>
                        {/*esto luego se cambia*/}
                </ul>
            </nav>


            <div class="header-links">
                <div className="links">
                    <Link to = "/notify"><img src={notifylogo} alt="" className="notifylogo"/></Link>
                    <Link to = "/user"><img src={userlogo} alt="" className="userlogo"/></Link>
                </div>
            </div>

        </header>
    );
}

export default Header;