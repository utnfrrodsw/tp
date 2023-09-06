import React from 'react';


export function detalle(props){

    const service = props.services

    return(
        <div className="service-detail">
        <h1>Detalle del Servicio</h1>
        <div className="service-info">
            <p><strong>Cliente:</strong> {service.clientName}</p>
            <p><strong>Tipo de Servicio:</strong> {service.serviceType}</p>
            <p><strong>Precio:</strong> ${service.price}</p>
            <p><strong>Fecha de Solicitud:</strong> {service.requestDate}</p>
            <p><strong>Estado:</strong> {service.status}</p>
            {/* Agrega más campos según sea necesario */}
        </div>
        <button className="back-button">Volver</button>
        </div>
    )

}