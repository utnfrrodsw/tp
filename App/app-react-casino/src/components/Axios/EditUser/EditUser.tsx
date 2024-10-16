import axios from 'axios';
import './EditUser.css';
import { NavLink as Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';

export function EditUser() {

    const {id} = useParams();
    const [usuario, setUsuario] = useState([])
    const form = useRef()
    const [firstName, setFirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [balance, setBalance] = useState("")
    console.log(id)

    const GetData = () => {
        axios.get(`http://localhost:3000/api/v1/users/${id}`).then((response) => {
            setUsuario(response.data)
            setFirstName(response.data.first_name)
            setlastName(response.data.last_name)
            setPhone(response.data.phone)
            setEmail(response.data.email)
            setBalance(response.data.balance)
        });
    };

    useEffect(() => {
        GetData();
    }, []);

    function patchUser(datos) {
        axios.put(`http://localhost:3000/api/v1/users/${id}`, {
            first_name: `${datos.firstname.value}`,
            last_name: `${datos.lastname.value}`,
            phone: `${datos.phone.value}`,
            email: `${datos.email.value}`,
            balance: `${datos.balance.value}`,
        })
        .then((response) => {
            console.log(response);
            location.reload()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function defaultValues() {
        setFirstName(usuario.first_name)
        setlastName(usuario.last_name)
        setPhone(usuario.phone)
        setEmail(usuario.email)
        setBalance(usuario.balance)

        const inputName = document.querySelector("#firstname")
        inputName?.classList.remove("modified")

        const inputlastName = document.querySelector("#lastname")
        inputlastName?.classList.remove("modified")

        const inputPhone = document.querySelector("#phone")
        inputPhone?.classList.remove("modified")

        const inputEmail = document.querySelector("#email")
        inputEmail?.classList.remove("modified")

        const inputBalance = document.querySelector("#balance")
        inputBalance?.classList.remove("modified")

    }

    function checkName() {
        const inputName = document.querySelector("#firstname")
        if(form.current.firstname.value != usuario.first_name) {
            inputName?.classList.add("modified")
        } else {
            inputName?.classList.remove("modified")
        }
    }
    function checkLastName() {
        const inputlastName = document.querySelector("#lastname")
        if(form.current.lastname.value != usuario.last_name) {
            inputlastName?.classList.add("modified")
        } else {
            inputlastName?.classList.remove("modified")
        }
    }
    function checkPhone() {
        const inputPhone = document.querySelector("#phone")
        if(form.current.phone.value != usuario.phone) {
            inputPhone?.classList.add("modified")
        } else {
            inputPhone?.classList.remove("modified")
        }
    }
    function checkEmail() {
        const inputEmail = document.querySelector("#email")
        if(form.current.email.value != usuario.email) {
            inputEmail?.classList.add("modified")
        } else {
            inputEmail?.classList.remove("modified")
        }
    }
    function checkBalance() {
        const inputBalance = document.querySelector("#balance")
        if(form.current.balance.value != usuario.balance) {
            inputBalance?.classList.add("modified")
        } else {
            inputBalance?.classList.remove("modified")
        }
    }

    return (
        
        <>
            <div className='edituser'>
                <form action="" className='formEdit' ref={form}>
                    <label>First Name</label><input type="text" id='firstname' className='formInput text-gray-900' value={firstName} onChange={e => setFirstName(e.target.value)} onInput={() => checkName()} name='firstname'/>
                    <label>Last Name</label><input type="text" id='lastname' className='formInput text-gray-900' value={lastName} onChange={e => setlastName(e.target.value)} onInput={() => checkLastName()} name='lastname'/>
                    <label>Phone Number</label><input type="text" id='phone' className='formInput text-gray-900' value={phone} onChange={e => setPhone(e.target.value)} onInput={() => checkPhone()} name='phone'/>
                    <label>Email</label><input type="text" id='email' className='formInput text-gray-900' value={email} onChange={e => setEmail(e.target.value)} onInput={() => checkEmail()} name='email'/>
                    <label>Balance</label><input type="text" id='balance' className='formInput text-gray-900' value={balance} onChange={e => setBalance(e.target.value)} onInput={() => checkBalance()} name='balance'/>
                </form>
                <div className='formButtons'>
                    <button type='submit' className='formSubmit' onClick={() => patchUser(form.current)}>Update</button>
                    <button onClick={() => defaultValues()} className='formSubmit'>Default Values</button>
                    <Link to="/user" className="back">Back</Link>
                </div>
            </div>
        </>

    );
}