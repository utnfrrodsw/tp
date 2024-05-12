import { NavLink as Link } from 'react-router-dom'
import './Header.css'

function clickLogin() {
    const login = document.querySelector('#login');
    login?.classList.toggle('notShow');
}

export function Header() {
    return(
        <header className='fixed top-0 z-10 w-full'>
            <nav className='bg-[#fabc01]/10 p-6 flex items-center justify-between'>
                <Link to="/"><img className='max-h-12' src="./src/assets/images/boceto_logo.png" /></Link>
                <div className='space-x-10'>
                    <Link to="/chau">About Us</Link>
                    <Link to="/chau">Daily Free</Link>
                    <button className='gold-button' onClick={clickLogin}>LogIn</button>
                </div>
            </nav>
        </header>
    )
}
