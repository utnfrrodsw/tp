import React from 'react';
import './solicitud.css';

function Solicitud(props) {

    /* estas propiedades se deben cambiar */
    const nombre = props.nombre;
    const estado = props.estado;
    const precio = props.precio;

    return (
        <div className="solicitud-card">
            <h2 className="nombre">{nombre}</h2>
            <p className="estado">{estado}</p>
            <p className="precio"> {estado === 'pendiente' ? 'No presupuestado' : `Precio: $${precio}`}</p>
        </div>
    );
}


export default Solicitud;

