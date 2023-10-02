import React, { useState } from 'react';
import './solicitud.css';

function Solicprincipal(props){
  const nombre = props.nombre;
  const descripcion = props.descripcion;
  const estado = props.estado;
  const precio = props.precio;
  const fecha = '21/09/2023';
  const ubicacion = 'Rosario, Santa Fe';
  // const foto=props.foto;}

  const [show, setShow] = useState(true);

  const CerrarSolicitud = () => {
    setShow(true);
  }
  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} onMouseLeave={CerrarSolicitud}>
   
      <div className='nombre'>{nombre}</div>
      <div className='fecha'>{fecha}</div>
      <div className='ubicacion'>{ubicacion}</div>
    
      <button className='boton' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
      
      {show ? (
        <h1> </h1>
      ) : (
        <>
          <h1 className="h1-heading">Estado:</h1>
          <div className='estado'>{estado}</div>

          <h2 className="h2-heading">Descripción:</h2>
          <div className='descripcion'>{descripcion}</div>

          <h3 className="h3-heading">Precio:</h3>
          <div className='precio'>{precio}</div>
        </>
      )}
    </div>
  );
}

export default Solicprincipal;
