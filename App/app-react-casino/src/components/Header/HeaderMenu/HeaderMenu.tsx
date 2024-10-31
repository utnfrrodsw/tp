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
        <section className= {`headerMenu ${open ? "headerMenu-open" : "HeaderMenu-closed"}`}>
            <div className='p-2 text-center'> {username} </div>
            <hr />
            <Link to={profile} className='flex p-2 items-center gap-2 object-center text-center header-menu-item hover:bg-[#3a3173]'><IoPersonSharp /> My Profile</Link>
            <button className="flex p-2 items-center gap-2 object-center text-center header-menu-item hover:bg-[#D81536]" onClick={handleLogout}><FiLogOut /> Log Out </button>
        </section>
        
    )
}

export default HeaderMenu