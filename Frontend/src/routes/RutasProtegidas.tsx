import { useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../auth/auhtProvider"

export default function RutasProtegidas(){
    const auht = useAuth()

    return auht.isAuthenticated ? <Outlet/> : <Navigate to="/"/>//si esdta Auht va a Outlet , si no va a la ruta principal(Login)!!
}