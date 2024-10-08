import axios from 'axios';
import './Details.css';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom'

export function Details() {

    console.log(useLocation().state)
    const usuario = (useLocation().state)
    const [data, setData] = useState([])

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/read/${usuario.id_user}`).then((response) =>
            setData(response.data)
        );
    };

    useEffect(() => {
        GetData();
    }, []);

    return (
        
        <>
            <div className='details'>
                <p>La id del usuario es {usuario.id_user}</p>
            </div>

            <Link to="/user" className="back">volver</Link>
        </>

    );
}