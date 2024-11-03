import './HeaderMenu.css'
import { NavLink as Link, useNavigate } from 'react-router-dom'
import { IoPersonSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

interface HeaderMenuProps {
    open: boolean; 
    username: string; 
    profile: string; 
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ open, username, profile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if(tokenLogout){
            localStorage.removeItem('jwt-token'); 
            navigate('/'); 
            window.location.reload();
        }
    };


    return(
        <section className= {`header-menu ${open ? "header-menu-open" : "Header-menu-closed"}`}>
            <div className='header-menu-name'> {username} </div>
            <hr />
            <Link to={profile} className='header-menu-item'><IoPersonSharp /> My Profile</Link>
            <button className='header-menu-item' onClick={handleLogout}><FiLogOut /> Log Out </button>
        </section>
        
    )
}

export default HeaderMenu