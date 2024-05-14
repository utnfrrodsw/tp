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
        <header className='fixed top-0 z-10 w-full'>
            {modalOpen && (
                <LogIn onClose={handleButtonClick}/>
            )}
            <nav className='bg-[#fabc01]/10 p-5 flex items-center justify-between'>
                <Link to="/"><img className='max-h-12' src="./src/assets/images/boceto_logo.png" /></Link>
                <div className='space-x-10'>
                    <Link to="/chau">About Us</Link>
                    <Link to="/chau">Daily Free</Link>
                    <button className='gold-button' onClick={() => setModalOpen(true)}>LogIn</button>
                </div>
            </nav>
        </header>
    )
}
