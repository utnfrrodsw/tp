import { NavLink as Link } from 'react-router-dom'
import './Header.css'

export function Header() {
    return(
        <header className='fixed top-0 z-10 w-full'>
            <nav className='bg-[#fabc01]/10 p-6 flex items-center justify-between'>
                <Link to="/"><img className='max-h-12' src="./src/assets/images/boceto_logo.png" /></Link>
                <div className='space-x-10'>
                    <Link to="/chau">About Us</Link>
                    <Link to="/chau">Daily Free</Link>
                    <Link to="/login" className='gold-button'>LogIn</Link>
                </div>
            </nav>
        </header>
    )
}
