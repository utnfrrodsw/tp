import { useState, useEffect } from "react";
import axios from 'axios';

export function LoginAgus(){
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try{
            const response = 
                await axios.post('http://localhost:3000/api/v1/login',
                    {username, password});
            setMessage('Sesion iniciada');
            console.log('Sesion iniciada')
        } catch (error) {
            setMessage('Ocurrio un error al iniciar sesion')
            console.error(error)
        }
    };

    return(
        <div className="mt-[100px]">
            <h1> Username and password </h1>
            <div className="flex flex-col p-2">
                <input className="text-gray-900 p-2 mb-2" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="text-gray-900 p-2 mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="me-2 items-center p-2 mt-2 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer" onClick={handleSubmit}>Submit</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}
