import React from 'react';
import './anuncio.css'
import { Link } from 'react-router-dom';
function Anuncio(props){
  const titulo=props.titulo;
  const descripcion=props.descripcion;
  const nombre=props.nombre;
  //const linkcito=props.linkcito
  
  return(
  <div className='anuncio-card'>
    <div className='photo'>
      <img className='img' src='https://unavatar.io/kikobeats?ttl=1h' alt="not Found" />
    </div>
    <div className='titulo'><h1>{titulo}</h1></div>
    <div className='descripcion'>{descripcion}</div>
    <div className='nombre'>{nombre}</div>
    <div className='boton'><Link to="/provider/adDetails" className="link">Ver mas</Link></div>
  </div>
);
}

export default Anuncio;