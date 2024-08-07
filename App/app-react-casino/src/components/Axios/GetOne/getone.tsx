import axios from 'axios'
import { useEffect, useState } from 'react';
import './getone.css';

export function GetOne() {
    const GetList = () => {
    axios({
        method: "get",
        url: "http://localhost:3000/api/v1/countries/1",
    }).then((response) =>
        console.log(response.data) 
    )}

    useEffect(() => {
        GetList();
    });

    return (
        <>
            <div className="hola">
                <p>hola</p>
            </div>
        </>

    )

}