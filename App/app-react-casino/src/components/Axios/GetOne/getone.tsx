import axios from 'axios'
import './getone.css';

export function GetOne() {

    axios({
        method: "get",
        url: "http://localhost:3000/api/v1/countries/1",
    }).then((response) =>
        console.log(response.data) 
    )

    return (
        <>
            <div className="hola">
                <p>hola</p>
            </div>
        </>

    )

}