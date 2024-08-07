import axios from 'axios'
import './PostUser.css';



export function PostUser() {

    axios.post('http://localhost:3000/api/v1/users', {
        username: 'mau',
        first_name: 'mauri',
        last_name: 'fiorin',
        birthday: '20020610',
        street: 'la maldita calle bro',
        phone: '3424125',
        email: 'hola@gmail.com',
        password: 'agusgil',
        role: 'admin',
        balance: '2147483647',
        id_city: '1',
        id_province: '1',
        id_country: '1'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    axios.post('http://localhost:3000/api/v1/categories', {
        description: 'mamahuevo'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    return (
        <>
        </>

    )

}