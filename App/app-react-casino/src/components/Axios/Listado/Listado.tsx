import axios from 'axios'
import { useEffect, useState } from 'react';
import './Listado.css';



export function Listado() {

    const [lista, setLista] = useState([])
    const GetList = () => {
    axios.get("http://localhost:3000/api/v1/countries").then((response) =>
        setLista(response.data)
    )}

   useEffect(() => {
        GetList();
    });

    return (
        <>
        <div className="hola">
                <ul>
                    {lista.map((item) => {
                        return (
                        <li key={item.id_country}> {item.iso} {item.name} {item.phone_code} </li>
                        );
                    })}
                </ul>
        </div>
        </>

    )

}