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
    const [country, setCountry] = useState([]);
    const [city, setCity] = useState([]);
    const [province, setProvince] = useState([]);

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/read/${usuario.id_user}`).then((response) =>
            setData(response.data)
        );
    };

    const GetCountry = () => {
        axios.get(`http://localhost:3000/api/v1/countries/${usuario.id_country}`).then((responseCountry) =>
            setCountry(responseCountry.data)
        );
    };

    const GetCity = () => {
        axios.get(`http://localhost:3000/api/v1/cities/${usuario.id_city}`).then((responseCity) =>
            setCity(responseCity.data)
        );
    };

    const GetProvince = () => {
        axios.get(`http://localhost:3000/api/v1/provinces/${usuario.id_province}`).then((responseProvince) =>
            setProvince(responseProvince.data)
        );
    };


    useEffect(() => {
        GetCountry();
        GetCity();
        GetProvince();
    }, []);



    return (
        
        <>
            <div className='details'>
                <p>La id del usuario es {usuario.id_user}</p>
                <p>nombre: {usuario.first_name}</p>
                <p>apellido: {usuario.last_name}</p>
                <p>fecha de nacimiento: {usuario.birthday}</p>
                <p>direccion: {usuario.street}</p>
                <p>telefono: {usuario.phone}</p>
                <p>correo: {usuario.email}</p>
                <p>balance: {usuario.balance}</p>
                <p>pais: {country.nice_name}</p>
                <p>numero pais: {country.num_code}</p>
                <p>ciudad: {city.name}</p>
                <p>codigo postal: {city.postal_code}</p>
                <p>provincia: {province.name}</p>
            </div>

            <Link to="/user" className="back">volver</Link>
        </>

    );
}