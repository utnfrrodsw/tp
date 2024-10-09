import axios from 'axios';
import './EditUser.css';
import { useLocation } from 'react-router-dom';
import { NavLink as Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';

export function EditUser() {

    const usuario = (useLocation().state)

    function patchUser(datos) {
        console.log(datos)
        axios.put(`http://localhost:3000/api/v1/users/${usuario.id_user}`, {
            first_name: `${datos.firstname.value}`,
            last_name: `${datos.lastname.value}`,
            street: `${datos.street.value}`,
            phone: `${datos.phone.value}`,
            email: `${datos.email.value}`,
            password: `${datos.password.value}`,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const form = useRef()
    const [firstName, setFirstName] = useState(usuario.first_name)
    const [lastName, setlastName] = useState(usuario.last_name)
    const [street, setStreet] = useState(usuario.street)
    const [phone, setPhone] = useState(usuario.phone)
    const [email, setEmail] = useState(usuario.email)
    const [password, setPassword] = useState(usuario.password)

    function defaultValues() {
        setFirstName(usuario.first_name)
        setlastName(usuario.last_name)
        setStreet(usuario.street)
        setPhone(usuario.phone)
        setEmail(usuario.email)
        setPassword(usuario.password)

        const inputName = document.querySelector("#firstname")
        inputName?.classList.remove("modified")

        const inputlastName = document.querySelector("#lastname")
        inputlastName?.classList.remove("modified")

        const inputStreet = document.querySelector("#street")
        inputStreet?.classList.remove("modified")

        const inputPhone = document.querySelector("#phone")
        inputPhone?.classList.remove("modified")

        const inputEmail = document.querySelector("#email")
        inputEmail?.classList.remove("modified")

        const inputPassword = document.querySelector("#password")
        inputPassword?.classList.remove("modified")

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
    function checkStreet() {
        const inputStreet = document.querySelector("#street")
        if(form.current.street.value != usuario.street) {
            inputStreet?.classList.add("modified")
        } else {
            inputStreet?.classList.remove("modified")
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
    function checkPassword() {
        const inputPassword = document.querySelector("#password")
        if(form.current.password.value != usuario.password) {
            inputPassword?.classList.add("modified")
        } else {
            inputPassword?.classList.remove("modified")
        }
    }

    useEffect(() => {
        checkName()
    }, []);

    return (
        
        <>
            <div className='edituser'>
                <form action="" className='formEdit' ref={form}>
                    <label>First Name</label><input type="text" id='firstname' className='formInput text-gray-900' value={firstName} onChange={e => setFirstName(e.target.value)} onInput={() => checkName()} name='firstname'/>
                    <label>Last Name</label><input type="text" id='lastname' className='formInput text-gray-900' value={lastName} onChange={e => setlastName(e.target.value)} onInput={() => checkLastName()} name='lastname'/>
                    <label>Street</label><input type="text" id='street' className='formInput text-gray-900' value={street} onChange={e => setStreet(e.target.value)} onInput={() => checkStreet()} name='street'/>
                    <label>Phone Number</label><input type="text" id='phone' className='formInput text-gray-900' value={phone} onChange={e => setPhone(e.target.value)} onInput={() => checkPhone()} name='phone'/>
                    <label>Email</label><input type="text" id='email' className='formInput text-gray-900' value={email} onChange={e => setEmail(e.target.value)} onInput={() => checkEmail()} name='email'/>
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