import { useState, useEffect } from "react";
import axios from 'axios';

export function RegisterAgus(){
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

      const[username, setUsername] = useState('');
      const[first_name, setFirstName] = useState('');
      const[last_name, setLastName] = useState('');
      const[birthday, setBirthday] = useState('');
      const[street, setStreet] = useState('');
      const[phone, setPhone] = useState('');
      const[email, setEmail] = useState('');
      const[password, setPassword] = useState('');
      const[message, setMessage] = useState('');

      const handleSubmit = async () => {
        try{
            const response = 
                await axios.post('http://localhost:3000/api/v1/register',
                    {username, first_name, last_name, birthday, street, phone, email, password});
            setMessage('Registrado correctamente');
            console.log(response.data)
            console.log('Registrado correctamente')
        } catch (error) {
            setMessage('Ocurrio un error al registrarse')
            console.error(error)
        }
    };

    return(
        <div className="mt-[100px]">
            <h1> Register </h1>
            <div className="flex flex-col">
                <input type="text" className="text-gray-900 p-2 mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" className="text-gray-900 p-2 mb-2" placeholder="First name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" name="lastname" className="text-gray-900 p-2 mb-2" placeholder="Last name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                <input type="date" name="birthday" className="text-gray-900 p-2 mb-2" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                <input type="text" name="street" className="text-gray-900 p-2 mb-2" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                <input type="text" name="phone" className="text-gray-900 p-2 mb-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input type="email" name="email" className="text-gray-900 p-2 mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" className="text-gray-900 p-2 mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer" onClick={handleSubmit}>Submit</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}