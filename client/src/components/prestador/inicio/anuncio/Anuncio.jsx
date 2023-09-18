import './anuncio.css'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import ControlledCarousel from './carousel'

function Anuncio(props){
  const titulo=props.titulo;
  const descripcion=props.descripcion;
  const nombre=props.nombre;
  const fecha='19/11/06';
  const ubicacion= 'Rosario, Santa Fe'
  //const foto=props.foto;
  const [show,setShow]=useState(true);
  return(
  <div className={`anuncio-card ${show ? "anuncio-card" : "anuncio-fullcontent"}`}>
    <div className='titulo'>{titulo}</div>
    <div className='nombre'>{nombre}</div>
    <div className='fecha'>{fecha}</div>
    <div className='ubicacion'>{ubicacion}</div>
    <button className='boton' onClick={()=> {setShow(!show);}}>Ver {show ? 'más':'menos'}</button>
    {show ? (<h1></h1>
    ):(
        <>
          <div className='descripcion'>{descripcion}</div>
          <Link to ="/provider/budget" className='presu'>Presupuestar</Link>
          <div className='photo'><img src="https://unavatar.io/kikobeats?ttl=1h" text="First slide" /></div>
        </>
    )}
  </div>
);
}

export default Anuncio;