import "./GamesSideBar.css"
import { NavLink as Link } from 'react-router-dom'


export function GamesSideBar() {

    return(
        <div className="gameSideBar">
            <Link to="/dice" className='dice-sidebar'> </Link>
            <Link to="/slot" className='slot-sidebar'></Link>
            <Link to="/wheel" className='wheel-sidebar'> </Link>
            <div className="SideBarMobileButton"></div>
        </div>
    )

}
