import { NavLink as Link } from 'react-router-dom'
import './SuccessPage.css';
import { defaultScroll } from "../../../libs/globalFunctions.tsx";

export function SuccessPage(){
    defaultScroll()

    return(
        <>
        <div className="error-container">
            <Link to="/"> <h1 className="error-title"> UTimbaN </h1></Link>
            <p className="error-text"> Your payment was successful! </p>
            <p className="error-text"> Proceed playing... </p>
            <Link to="/"> <p className="error-back"> Return to homepage </p></Link>
        </div>
        </>
    )
}