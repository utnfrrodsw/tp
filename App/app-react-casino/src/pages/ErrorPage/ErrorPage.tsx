import { useEffect } from "react"
import { NavLink as Link } from 'react-router-dom'


export function ErrorPage(){
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    return(
        <>
        <div className="mt-[100px] flex flex-col items-center p-5 gap-4 pb-[400px]">
            <Link to="/"> <h1 className="font-bold text-3xl hover:text-[#E2E2B6]"> UTimbaN </h1></Link>
            <p className="text-center leading-6"> The current page may have been removed, changed or is temporarily unavailable </p>
            <Link to="/"> <p className="underline hover:text-[#FABC01]"> Return to homepage </p></Link>
        </div>
        </>
    )
}