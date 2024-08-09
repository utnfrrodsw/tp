import "./GamesSideBar.css"
import { NavLink as Link } from 'react-router-dom'


export function GamesSideBar() {

    return(
        <div className="gameSideBar">
            <Link to="/live_roulette"><img src="./src/assets/images/boceto_logo.png" alt="Ruleta" className="game"/></Link>
            <Link to="/dice"><img src="./src/assets/images/dice.webp" alt="DICE" className="game"/></Link>
            <Link to="/slot"><img src="./src/assets/images/slots.webp" alt="Slots" className="game"/></Link>
            <Link to="/wheel"><img src="./src/assets/images/wheel.webp" alt="Mega Wheel" className="game"/></Link>
        </div>
    )

}
