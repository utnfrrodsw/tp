import { useEffect } from "react";
import { Link } from "react-router-dom";
import './adminUses.css'; // Asegúrate de crear este archivo CSS.

export function AdminUses() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="admin-uses-container"> 
            <Link to="/user" className="admin-link">Users</Link> 
            <Link to="/getone" className="admin-link">GetOne</Link> 
            <Link to="/listado" className="admin-link">Listado</Link> 
            <Link to="/postuser" className="admin-link">PostUser</Link> 
        </div>
    );
}
