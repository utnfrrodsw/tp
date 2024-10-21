import "./GamesSideBar.css"
import { NavLink as Link } from 'react-router-dom'


export function GamesSideBar() {

    return(
        <div className="gameSideBar">
            <Link to="/dice" className='h-[160px] w-[160px] p-6 bg-[url("./src/assets/images/games-dice.png")] bg-center bg-cover bg-contain'> </Link>
            <Link to="/slot" className='h-[160px] w-[160px] p-6 bg-[url("./src/assets/images/games-slots.png")] bg-center bg-cover bg-contain'></Link>
            <Link to="/wheel" className='h-[160px] w-[160px] p-6 bg-[url("./src/assets/images/games-wheel.png")] bg-center bg-cover bg-contain'> </Link>
            <div className="SideBarMobileButton"></div>
        </div>
    )

}
