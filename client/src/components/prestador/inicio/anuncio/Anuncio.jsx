import './anuncio.css'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import ControlledCarousel from './carousel'

function Anuncio(props){
  const titulo=props.titulo;
  const descripcion=props.descripcion;
  const nombre=props.nombre;
  //const foto=props.foto;
  const [show,setShow]=useState(true);
  return(
  <div className={`anuncio-card ${show ? "anuncio-card" : "anuncio-fullcontent"}`}>
    <div className='titulo'><h1>{titulo}</h1></div>
    <div className='descripcion'>{descripcion}</div>
    <div className='nombre'>{nombre}</div>
    <button className='boton' onClick={()=> {setShow(!show);}}>Ver {show ? 'más':'menos'}</button>
    {show ? (<h1></h1>
    ):(
        <>
          <button className='presu'>Presupuestar</button>
          <div className='photo'><ControlledCarousel /></div>
        </>
    )}
  </div>
);
}

export default Anuncio;