import axios from '../../../libs/axios.tsx'
import './EditUser.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from "react";
import { userContext } from "../../../App.tsx";

export function EditUser() {
    const contextData = useContext(userContext);
    const navigate = useNavigate()
    const {id} = useParams<{ id: string }>();;
    const form = useRef<HTMLFormElement | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState("");
    const [roleUser, setRoleUser] = useState("")
    const role = contextData.role

    const token = localStorage.getItem('jwt-token');

    const GetData = () => {
        axios.get(`/users/${id}`, { params: { token, role } }).then((response) => {
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setPhone(response.data.phone);
            setEmail(response.data.email);
            setBalance(response.data.balance);
            setRoleUser(response.data.role)
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0)
        GetData();
    }, [id]);

    function patchUser() {
        if (!form.current) return; 
        axios.put(`/users/${id}`, {
            token,
            role: roleUser,
            first_name: form.current.first_name.value,
            last_name: form.current.last_name.value,
            phone: form.current.phone.value,
            email: form.current.email.value,
            balance: form.current.balance.value,
        })
        .then(() => {
            navigate("/userlist")
        })
    }

    function back() {
        navigate("/userlist")
    }

    return (
        <div className='edituser'>
            <form className='formEdit' ref={form}>
                <label>First Name</label>
                <input type="text" id='first_name' className='formInput' value={firstName} onChange={e => setFirstName(e.target.value)} name='first_name' />
                <label>Last Name</label>
                <input type="text" id='last_name' className='formInput' value={lastName} onChange={e => setLastName(e.target.value)} name='last_name' />
                <label>Phone Number</label>
                <input type="text" id='phone' className='formInput' value={phone} onChange={e => setPhone(e.target.value)} name='phone' />
                <label>Email</label>
                <input type="text" id='email' className='formInput' value={email} onChange={e => setEmail(e.target.value)} name='email' />
                <label>Balance</label>
                <input type="text" id='balance' className='formInput' value={balance} onChange={e => setBalance(e.target.value)} name='balance' />
            </form>
            <div className='formButtons'>
                <button type='button' className='formSubmit' onClick={patchUser}>Update</button>
                <button type='button' className='back' onClick={back}>Back</button>
            </div>
        </div>
    );
}
