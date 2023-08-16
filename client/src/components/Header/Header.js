import React from "react";
import { Link } from 'react-router-dom';
import './Header.css'
import userlogo from './user.png'
import notifylogo from './notify.png'


function Header() {
    return (
        <header className="header-content">
            <div className="logo-content">
                <Link to = "/"><h1 className="title">FastServices</h1></Link>
            </div>
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