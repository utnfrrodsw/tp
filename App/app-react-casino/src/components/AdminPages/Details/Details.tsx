import axios from '../../../libs/axios.tsx'
import './Details.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useParams} from 'react-router-dom'
import { defaultScroll } from "../../../libs/globalFunctions.tsx";
import { useContext } from "react";
import { userContext } from "../../../App.tsx";

export function Details() {
    defaultScroll()

    const contextData = useContext(userContext);
    const navigate = useNavigate()
    const [user, setUser] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        birthday: "",
        phone: "",
        balance: "",
        Country: ""
    });
    const {id} = useParams();
    const role = contextData.role

    const token = localStorage.getItem('jwt-token');

    const GetData = () => {
        axios.get(`/users/read/${id}`, { params: { token, role } }).then((response) => {
            setUser(response.data[0])
        });
    };

    useEffect(() => {
        GetData();
    }, []);

    function back() {
        navigate("/userlist")
    }

    return (
        
        <>
            <div className='details'>
                <p className='detail-element'>ID User: {id}</p>
                <p className='detail-element'>Username: {user.username}</p>
                <p className='detail-element'>Email: {user.email}</p>
                <p className='detail-element'>First Name: {user.first_name}</p>
                <p className='detail-element'>Last Name: {user.last_name}</p>
                <p className='detail-element'>Birthday: {user.birthday}</p>
                <p className='detail-element'>Phone: {user.phone}</p>
                <p className='detail-element'>Balance: {user.balance}</p>
                <p className='detail-element'>Country: {user.Country}</p>
                <button type='button' className='backDetails' onClick={back}>Back</button>
            </div>
        </>

    );
}