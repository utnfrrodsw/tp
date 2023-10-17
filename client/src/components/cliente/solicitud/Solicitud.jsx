import React, { useState } from 'react';
import './solicitud.css';

function Solicitud(props){

  const titulo=props.titulo
  const fecha=props.fecha
  const direccion=props.direccion
  const descripcion=props.descripcion
  const estado=props.estado
  const fotos=props.fotos

  const [show, setShow] = useState(true);

  const CerrarSolicitud = () => {
    setShow(true);
  }
  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} onMouseLeave={CerrarSolicitud}>
   
      <h1 className='titulo'>{titulo}</h1>
      <p className='fecha'>{fecha}</p>
      <p className='direccion'>{direccion.calle} {direccion.numero}</p>
    
      <button className='boton' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
      
      {show ? (
        <h1> </h1>
      ) : (
        <>
          <p className='estado'>{estado}</p>
          <p className='descripcion'>{descripcion}</p>
          {fotos.map((foto) => (
            <img key={foto.id} src={'http://localhost:5000/images/imagesdb/'+ foto.foto} alt="foto" className="foto" />
          ))}
        </>
      )}
    </div>
  );
}

export default Solicitud;
