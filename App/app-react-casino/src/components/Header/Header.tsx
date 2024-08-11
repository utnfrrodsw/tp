import { NavLink as Link } from 'react-router-dom'
import { LogIn } from '../../components/LogIn/LogIn';
import { useState } from 'react';
import './Header.css'

export function Header() {

    const [modalOpen, setModalOpen] = useState(false);

    const handleButtonClick = () => {
        setModalOpen(false)
    }

    return(
        <header className='fixed top-0 w-full z-20'>
            {modalOpen && (
                <LogIn onClose={handleButtonClick}/>
            )}
            <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
            <Link to="/"><img className='max-h-20' src="./src/assets/images/ruleta_v1.png" /></Link>
                <div className='space-x-10'>
                    <Link to="/admin-uses">Admin Uses</Link>
                    <Link to="/about-us">About Us</Link>
                    <Link to="/chau">Daily Free</Link>
                    <button className='gold-button' onClick={() => setModalOpen(true)}>LogIn</button>
                </div>
            </nav>
        </header>
    )
}
