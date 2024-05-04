import { NavLink as Link } from 'react-router-dom'
import './Header.css'

export function Header() {
    return(
        <div className='header'>
                <Link to="/"><img src="./src/assets/images/boceto_logo.png" /></Link>
                <Link to="/chau">Principal</Link>
                <Link to="/hola">Principal</Link>
        </div>
    )
}
