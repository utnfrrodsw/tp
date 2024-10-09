import axios from 'axios';
import './Details.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom'
import {useParams} from 'react-router-dom'

export function Details() {

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthday, setBirthday] = useState("")
    const [street, setStreet] = useState("")
    const [phone, setPhone] = useState("")
    const [balance, setBalance] = useState("")
    const [province, setProvince] = useState("")
    const [city, setCity] = useState("")
    const [postalcode, setPostalcode] = useState("")
    const [country, setCountry] = useState("")
    const {id} = useParams();

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/read/${id}`).then((response) => {
            setUsername(response.data[0].username)
            setFirstName(response.data[0].first_name)
            setLastName(response.data[0].last_name)
            setBirthday(response.data[0].birthday)
            setStreet(response.data[0].street)
            setPhone(response.data[0].phone)
            setBalance(response.data[0].balance)
            setProvince(response.data[0].Provincia)
            setCity(response.data[0].Ciudad)
            setPostalcode(response.data[0].postal_code)
            setCountry(response.data[0].Pais)
            console.log(response.data[0])
        });
    };

    useEffect(() => {
        GetData();
    }, []);

    return (
        
        <>
            <div className='details'>
                <p className='detail_element'>ID Usuario: {id}</p>
                <p className='detail_element'>Username: {username}</p>
                <p className='detail_element'>First Name: {firstName}</p>
                <p className='detail_element'>Last Name: {lastName}</p>
                <p className='detail_element'>Birthday: {birthday}</p>
                <p className='detail_element'>Street: {street}</p>
                <p className='detail_element'>Phone: {phone}</p>
                <p className='detail_element'>Balance: {balance}</p>
                <p className='detail_element'>Province: {province}</p>
                <p className='detail_element'>City: {city}</p>
                <p className='detail_element'>Postal Code: {postalcode}</p>
                <p className='detail_element'>Country: {country}</p>
                <Link to="/user" className="backDetails">Back</Link>
            </div>
        </>

    );
}