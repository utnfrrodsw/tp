import { NavLink as Link } from 'react-router-dom'
import { LogIn } from '../../components/LogIn/LogIn';
import { useState } from 'react';
import './Header.css'

export function Header() {


    const [modalOpen, setModalOpen] = useState(false);

    const handleButtonClick = () => {
        setModalOpen(false)
    }

    //                    <Link to="/admin-uses">Admin Uses</Link>
    // <Link to="/login" className="gold-button">LoginAgus</Link>
    //  <Link to="/register" className="gold-button">RegisterAgus</Link> 
    return(
        <header className='fixed top-0 w-full z-20'>
            {modalOpen && (
                <LogIn onClose={handleButtonClick}/>
            )}
            <nav className='bg-[#fabc01]/10 p-3 flex items-center justify-between nav'>
            <Link to="/"><img className='max-h-16 spinner' src="./src/assets/images/min_icon3.png" alt='Imagen Ruleta'  /></Link>
                <div className='space-x-10'>

                    <Link to="/about-us" className="nav-item"> About Us </Link>
                    <Link to="/chau" className="nav-item"> Daily Free </Link>
                    <Link to="/profile" className="nav-item"> Profile </Link>


                    <button className='gold-button' onClick={() => setModalOpen(true)}>SignUp</button>
                </div>
            </nav>
        </header>
    )
}
