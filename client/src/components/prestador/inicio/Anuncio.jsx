import React from 'react';
import './anuncio.css'

function Anuncio(props){
  const titulo=props.titulo;
  const descripcion=props.descripcion;
  const nombre=props.nombre;
  
  return(
  <div className='anuncio-card'>
    <div className='photo'><img src="" alt="not Found" /></div>
    <div className='titulo'><h1>{titulo}</h1></div>
    <div className='descripcion'>{descripcion}</div>
    <div className='nombre'>{nombre}</div>
  </div>
);
}

export default Anuncio;