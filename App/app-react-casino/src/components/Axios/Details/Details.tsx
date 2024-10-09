import axios from 'axios';
import './Details.css';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom'

export function Details() {
    
    interface UserType {
        id_user: number;
        username: string;
        first_name: string;
        last_name: string;
        birthday: string;
        street: string;
        phone: string;
        balance: string;
        createdAt: string;
        Provincia: string;
        Ciudad: string;
        postal_code: string;
        Pais: string;
    }

    const usuario = (useLocation().state)
    const [data, setData] = useState<UserType[]>([])
    console.log(data)

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
            <p className='detail_element'>ID Usuario: {data[0].id_user}</p>
                <p className='detail_element'>Username: {data[0].username}</p>
                <p className='detail_element'>First Name: {data[0].first_name}</p>
                <p className='detail_element'>Last Name: {data[0].last_name}</p>
                <p className='detail_element'>Birthday: {data[0].birthday}</p>
                <p className='detail_element'>Street: {data[0].street}</p>
                <p className='detail_element'>Phone: {data[0].phone}</p>
                <p className='detail_element'>Balance: {data[0].balance}</p>
                <p className='detail_element'>Province: {data[0].Provincia}</p>
                <p className='detail_element'>City: {data[0].Ciudad}</p>
                <p className='detail_element'>Postal Code: {data[0].postal_code}</p>
                <p className='detail_element'>Country: {data[0].Pais}</p>
                <Link to="/user" className="backDetails">Back</Link>
            </div>
        </>

    );
}