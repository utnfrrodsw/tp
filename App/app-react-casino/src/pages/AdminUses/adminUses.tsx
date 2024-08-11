import { useEffect } from "react"
import { Link } from "react-router-dom"

export function AdminUses() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return(
        <>
        <div className="p-5 px-2 mt-[100px]"> 
        <Link to="/user" className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
        Users </Link> 
        <Link to="/getone" className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
        GetOne </Link> 
        <Link to="/listado" className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
        Listado </Link> 
        <Link to="/postuser" className="ne-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer">
        PostUser </Link> 

        

            
            
            
            
        </div>
        </>
    )
}