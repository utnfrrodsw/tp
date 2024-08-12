import axios from 'axios';
import './EditUser.css';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { NavLink as Link } from 'react-router-dom'
import { useState } from 'react';

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
    }

    return (
        
        <>
            <div className='edituser'>
                <form action="" className='formEdit' ref={form}>
                    <input type="text" id='firstname' className='formInput text-gray-900' value={firstName} onChange={e => setFirstName(e.target.value)} name='firstname'/>
                    <input type="text" id='lastname' className='formInput text-gray-900' value={lastName} onChange={e => setlastName(e.target.value)} name='lastname'/>
                    <input type="text" id='street' className='formInput text-gray-900' value={street} onChange={e => setStreet(e.target.value)} name='street'/>
                    <input type="text" id='phone' className='formInput text-gray-900' value={phone} onChange={e => setPhone(e.target.value)} name='phone'/>
                    <input type="text" id='email' className='formInput text-gray-900' value={email} onChange={e => setEmail(e.target.value)} name='email'/>
                    <input type="text" id='password' className='formInput text-gray-900' value={password} onChange={e => setPassword(e.target.value)} name='password'/>
                </form>
                <button type='submit' className='formSubmit' onClick={() => patchUser(form.current)}>Actualizar</button>
                <Link to="/user" className="back">volver</Link>
                <button onClick={() => defaultValues()} className='formSubmit'>Default Values</button>
            </div>
        </>

    );
}