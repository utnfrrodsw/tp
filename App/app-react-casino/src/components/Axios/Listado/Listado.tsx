import axios from 'axios'
import { useEffect, useState } from 'react';
import './Listado.css';



export function Listado() {

    const [lista, setLista] = useState([])
    const GetList = () => {
    axios.get("http://localhost:3000/api/v1/countries").then((response) =>
        setLista(response.data)    
    )}
    /*axios.post('http://localhost:3000/api/v1/categories', {
        description: 'mamahuevo'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });*/

    /*axios({
        method: 'post',
        url: 'http://localhost:3000/api/v1/users',
        data: {
            username: "mau",
            first_name: "mauri",
            last_name: "fiorin",
            birthday: "2002/12/04",
            street: "la maldita calle bro",
            phone: "3424125",
            email: "hola@gmail.com",
            password: "agusgil",
            role: "admin",
            balance: "244444444444",
            id_city: "1",
            id_province: "1",
            id_country: "1"
        }
      });*/

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