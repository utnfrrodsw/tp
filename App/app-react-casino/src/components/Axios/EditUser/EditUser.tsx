import axios from 'axios';
import './EditUser.css';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink as Link } from 'react-router-dom'

export function EditUser() {

    const usuario = (useLocation().state)
    console.log(usuario.id_user)

    function patchUser() {
        axios.put(`http://localhost:3000/api/v1/users/${usuario.id_user}`, {
            first_name: 'mauridd',
            last_name: 'fiorindd',
            street: 'la maldita ca',
            phone: '3424125',
            email: 'dasdasd@gmail.com',
            password: 'a345',
            balance: '21',
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        
        <>
            <div className='edituser'>
                <form action="" className='formEdit'>
                    <input type="text" id='firstname' className='formInput' placeholder={usuario.first_name} name='firstname'/>
                    <input type="text" id='lastname' className='formInput' placeholder={usuario.last_name} name='lastname'/>
                    <input type="text" id='street' className='formInput' placeholder={usuario.street} name='street'/>
                    <input type="text" id='phone' className='formInput' placeholder={usuario.phone} name='phone'/>
                    <input type="text" id='email' className='formInput' placeholder={usuario.email} name='email'/>
                    <input type="text" id='password' className='formInput' placeholder={usuario.password} name='password'/>
                </form>
                <button type='submit' className='formSubmit' onClick={() => patchUser()}>Actualizar</button>
                <Link to="/user" className="back">volver</Link>
            </div>
        </>

    );
}