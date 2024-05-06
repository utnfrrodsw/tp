import { NavLink as Link } from 'react-router-dom'
import './Header.css'

export function Header() {
    return(
        <header className='sticky top-0 z-10'>
                <nav className='bg-[#fabc01]/10 py-6 w-full'>
                    <div className='mx-10 flex items-center justify-between'>
                            <Link to="/"><img className='max-h-10' src="./src/assets/images/boceto_logo.png" /></Link>
                            <div className='place-items-end space-x-10'>
                                <Link to="/chau">About Us</Link>
                                <Link to="/chau">Daily Free</Link>
                                <Link to="/hola" className='border border-white py-2 px-5'>LogIn</Link>
                            </div>
                    </div>
                </nav>
        </header>
    )
}
