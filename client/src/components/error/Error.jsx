import React from 'react';
import './error.css';
import { useRouteError } from 'react-router-dom';

function Error() {

    const error = useRouteError();

    return (
        <div className='inicio-cliente-container'>
            <h1>Error</h1>
            <p>{error.statusText || error.message }</p>
        </div>
    );
}

export default Error;