import React from 'react';
import './error.css';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Error() {


    return (
        <div className='inicio-cliente-container'>
            <h1>Error 404</h1>
            <p>
                No se encontró la página solicitada
            </p>
            <Link to='/'>Volver al inicio</Link>
        </div>
    );
}

export default Error;