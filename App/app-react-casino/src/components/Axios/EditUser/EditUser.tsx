import axios from 'axios';
import './EditUser.css';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { NavLink as Link } from 'react-router-dom'

export function EditUser() {

    const usuario = (useLocation().state)
    console.log(usuario.id_user)

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

    return (
        
        <>
            <div className='edituser'>
                <form action="" className='formEdit' ref={form}>
                    <input type="text" id='firstname' className='formInput text-gray-900' placeholder={usuario.first_name} name='firstname'/>
                    <input type="text" id='lastname' className='formInput text-gray-900' placeholder={usuario.last_name} name='lastname'/>
                    <input type="text" id='street' className='formInput text-gray-900' placeholder={usuario.street} name='street'/>
                    <input type="text" id='phone' className='formInput text-gray-900' placeholder={usuario.phone} name='phone'/>
                    <input type="text" id='email' className='formInput text-gray-900' placeholder={usuario.email} name='email'/>
                    <input type="text" id='password' className='formInput text-gray-900' placeholder={usuario.password} name='password'/>
                </form>
                <button type='submit' className='formSubmit' onClick={() => patchUser(form.current)}>Actualizar</button>
                <Link to="/user" className="back">volver</Link>
            </div>
        </>

    );
}