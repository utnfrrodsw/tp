import { NavLink as Link } from 'react-router-dom'
import './FailPage.css';
import { defaultScroll } from "../../../libs/globalFunctions.tsx";


export function FailPage(){
    defaultScroll()
    return(
        <>
        <div className="error-container">
            <Link to="/"> <h1 className="error-title"> UTimbaN </h1></Link>
            <p className="error-text"> We encountered an error with your payment </p>
            <Link to="/"> <p className="error-back"> Return to homepage </p></Link>
        </div>
        </>
    )
}