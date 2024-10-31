import axios from 'axios';
import './Details.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom'
import {useParams} from 'react-router-dom'

export function Details({role}) {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthday, setBirthday] = useState("")
    const [phone, setPhone] = useState("")
    const [balance, setBalance] = useState(0)
    const [country, setCountry] = useState("")
    const {id} = useParams();

    const token = localStorage.getItem('jwt-token');

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/read/${id}`, { params: { token, role } }).then((response) => {
            setUsername(response.data[0].username)
            setFirstName(response.data[0].first_name)
            setLastName(response.data[0].last_name)
            setBirthday(response.data[0].birthday)
            setPhone(response.data[0].phone)
            setBalance(response.data[0].balance)
            setCountry(response.data[0].Country)
            console.log(response.data[0])
        });
    };

    useEffect(() => {
        GetData();
    }, []);

    return (
        
        <>
            <div className='details'>
                <p className='detail_element'>ID User: {id}</p>
                <p className='detail_element'>Username: {username}</p>
                <p className='detail_element'>First Name: {firstName}</p>
                <p className='detail_element'>Last Name: {lastName}</p>
                <p className='detail_element'>Birthday: {birthday}</p>
                <p className='detail_element'>Phone: {phone}</p>
                <p className='detail_element'>Balance: {balance}</p>
                <p className='detail_element'>Country: {country}</p>
                <Link to="/user" className="backDetails">Back</Link>
            </div>
        </>

    );
}