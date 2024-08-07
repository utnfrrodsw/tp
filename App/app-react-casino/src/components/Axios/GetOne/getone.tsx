import axios from 'axios'
import { useEffect, useState } from 'react';
import './getone.css';

export function GetOne() {
    const [lista, setLista] = useState([])
    const GetList = () => {
    axios({
        method: "get",
        url: "http://localhost:3000/api/v1/countries/${this.id_country}",
    }).then((response) =>
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
                        <li key={item.id_country}> {item.name} </li>
                        );
                    })}
                </ul>
        </div>
        </>

    )

}