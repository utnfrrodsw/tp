import { NavLink as Link, useNavigate } from 'react-router-dom';

import { LogIn } from '../index.js'
import { BalanceModal } from './BalanceModal/BalanceModal.js';

import { IoPersonSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MdLeaderboard } from "react-icons/md";

import { useState } from 'react';
import HeaderToggle from './HeaderToggle/HeaderToggle.js';
import HeaderMenu from './HeaderMenu/HeaderMenu.js';

import './Header.css';

interface HeaderProps {
    balance: number;
    profile: string;
    role: string;
    username: string;
    setMoney: React.Dispatch<React.SetStateAction<number>>;
    idUser: string;
}

export function Header({ balance, profile, role, username, setMoney, idUser }: HeaderProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setMenuOpen] = useState(false);
    let navigate = useNavigate()
    const [isActive, setIsActive] = useState(true)

    const toggleMenu = () => {
        setMenuOpen(!open);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    };
    
    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if(tokenLogout){
            localStorage.removeItem('jwt-token'); 
            navigate('/'); 
            window.location.reload();
        }
    };

    if (role === 'user') {
        return (
            <>
                <div className='nav-item menu-open'>
                    <HeaderMenu open={open} username={username} profile={profile} />
                </div>

                <header className='header'>
                    <nav className='nav'>
                        <Link to="/"><img className='spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>

                        <div className='header-content'>
                            <div className='space-x-10'>
                                <a onClick={() => setModalOpen(true)} className='balance'>
                                    $ {balance} <img className='balance-img' src="../../src/assets/images/mp-logo-color.png" alt="" />
                                </a>
                                <Link to="/leaderboard" className="nav-item">Leaderboards</Link>
                                <div><HeaderToggle toggle={toggleMenu} open={open} /></div>
                            </div>
                        </div>
                    </nav>
                </header>

                

                {modalOpen && <BalanceModal onClose={handleModalClose} setMoney={setMoney} idUser={idUser} balance={balance} role={role}/>}
            </>
        );
    } if (role === 'admin'){
        return (
        <>
        <div className='nav-item menu-open'>
            <HeaderMenu open={open} username={username} profile={profile} />
        </div>

        <header className='header'>
                <nav className='nav'>
                    <Link to="/"><img className='spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                    <div className='header-content'>
                        <div className='space-x-10'>
                            <Link to="/userlist" className="nav-item">User List</Link>
                            <Link to="/leaderboard" className="nav-item">Leaderboard</Link>
                            <div><HeaderToggle toggle={toggleMenu} open={open} /></div>
                        </div>
                    </div>
                </nav>
        </header>
        </>
        )
    }
    else {
        return (
            <>
            <button onClick={() => setIsActive(!isActive)} className={isActive ? "invisible mobile-button" : "mobile-button"}>soy el boton del header</button>
            <header className={isActive ? "header-responsive" : "header-responsive invisible"}>            
                    <div className='nav-responsive'>
                    <button onClick={() => setIsActive(!isActive)}>hola</button>
                    <Link to="/"><img className='spinner spinner-responsive' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                            <a onClick={() => setModalOpen(true)} className='balance balance-responsive'>
                                    $ {balance} <img className='balance-img' src="../../src/assets/images/mp-logo-color.png" alt="" />
                            </a>
                            <div className='items-responsive'>
                            <Link to="/leaderboard" className="nav-item-responsive">
                                    <div className='icon-text'> 
                                        <MdLeaderboard /> <p> Leaderboard </p>
                                    </div> 
                            
                            </Link>
                            <div className='items-responsive items2-responsive'>
                                <Link to={profile} className='nav-item-responsive'> 
                                    <div className='icon-text'> 
                                        <IoPersonSharp /> <p> Profile </p>
                                    </div> 
                                </Link>
                                <button className='nav-item-responsive' onClick={handleLogout}> 
                                    <div className='icon-text'> 
                                        <FiLogOut /> <p> Log Out </p>
                                    </div>
                                </button>
                            </div>
                            </div>
                    </div>
                </header>
                <header className='header'>
                {modalOpen && <LogIn onClose={handleModalClose} />}
                <nav className='nav'>
                    <Link to="/"><img className='spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                    <div className='header-content'>
                        <div className='space-x-10'>
                            <Link to="/about-us" className="nav-item">About Us</Link>
                            <button className='gold-button' onClick={() => setModalOpen(true)}>LogIn</button>
                        </div>
                    </div>
                </nav>
            </header>
            </>
        );
    }
}

