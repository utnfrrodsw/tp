import { NavLink as Link } from 'react-router-dom';
import { LogIn } from '../../components/LogIn/LogIn';
import { BalanceModal } from '../../components/BalanceModal/BalanceModal';
import { useState } from 'react';
import HeaderToggle from './HeaderToggle/HeaderToggle';
import HeaderMenu from './HeaderMenu/HeaderMenu';

import './Header.css';

interface HeaderProps {
    balance: string;
    profile: string;
    role: string;
    username: string;
}

export function Header({ balance, profile, role, username }: HeaderProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!open);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    };

    if (role === 'user') {
        return (
            <>
                <div className='nav-item fixed top-[88px] z-50 w-[15%] right-0 h-2'>
                    <HeaderMenu open={open} username={username} profile={profile} />
                </div>

                <header className='fixed top-0 w-full z-20'>
                    <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
                        <Link to="/"><img className='max-h-16 spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>

                        <div className='header-content'>
                            <div className='space-x-10'>
                                <a onClick={() => setModalOpen(true)} className='balance'>
                                    $ {balance} <img className='balance-img' src="../../src/assets/images/mp-logo.svg" alt="" />
                                </a>
                                <Link to="/leaderboards" className="nav-item">Leaderboards</Link>
                                <Link to="/daily" className="nav-item">Daily Free</Link>
                                <div><HeaderToggle toggle={toggleMenu} open={open} /></div>
                            </div>
                        </div>
                    </nav>
                </header>

                {modalOpen && <BalanceModal onClose={handleModalClose} />}
            </>
        );
    } if (role === 'admin'){
        return (
        <>
        <div className='nav-item fixed top-[88px] z-50 w-[15%] right-0 h-2'>
            <HeaderMenu open={open} username={username} profile={profile} />
        </div>

        <header className='fixed top-0 w-full z-20'>
                <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
                    <Link to="/"><img className='max-h-16 spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                    <div className='header-content'>
                        <div className='space-x-10'>
                            <Link to="/admin-uses" className="nav-item">Admin Uses</Link>
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
            <header className='fixed top-0 w-full z-20'>
                {modalOpen && <LogIn onClose={handleModalClose} />}
                <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
                    <Link to="/"><img className='max-h-16 spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta' /></Link>
                    <div className='header-content'>
                        <div className='space-x-10'>
                            <Link to="/about-us" className="nav-item">About Us</Link>
                            <button className='gold-button' onClick={() => setModalOpen(true)}>SignUp</button>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
