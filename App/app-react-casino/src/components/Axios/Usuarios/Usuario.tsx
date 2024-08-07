import axios from 'axios'
import { useEffect, useState } from 'react';
import './Usuario.css';



export function Usuario() {

    const [user, setUser] = useState([])
    const GetUser = () => {
    axios.get("http://localhost:3000/api/v1/users").then((response) =>
        setUser(response.data)
    )}

   useEffect(() => {
        GetUser();
    });

    return (
        <>
        <div className="hola">
                <ul>
                    {user.map((item) => {
                        return (
                        <li key={item.id_user}> {item.id_user} {item.username} {item.role} {item.email} {item.balance} </li>
                        );
                    })}
                </ul>
        </div>
        </>

    )

}