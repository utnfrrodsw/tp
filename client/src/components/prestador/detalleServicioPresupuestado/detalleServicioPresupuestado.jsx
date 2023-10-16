import './Presupuesto.css'
import React, { useState } from 'react';

function DetalleServicio() {
  const id_anuncio=1234;
  const titulo="titulo anuncio";
  const fecha_publicacion=12/12/12;
  const ubicacion="Algun lado, alguna prov";
  const nombre= "alguna persona";
  const descripcion="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla nostrum sit animi nesciunt ratione quas autem aspernatur unde voluptatum. Eos odio impedit similique aspernatur aperiam ex tempora enim quod vel.";
  const listaMAT="varias cosas muchos materiales";
  const costoMAT=85;
  const tiempoAprox=90;
  const costoXHora=1800;
  const horariosDisp="12/12/12 09:30:00 11/11/11 08:00:00";
return(
  <>
    <div className="anuncio-Content">
      <div className='datos'>
          <p><h2>Detalles:</h2></p>
          <p>Número de anuncio: {id_anuncio}</p>
          <p>Título: {titulo}</p>
          <p>Fecha de publicacion: {fecha_publicacion}</p>
          <p>Ubicacion: {ubicacion}</p>
          <p>Propietario de anuncio:{nombre}</p>
      </div>
      <div className='descripcion'><h3><p>Descripcion:</p></h3> {descripcion}</div>
    </div>
    <div className='presupuesto-Content'>
      <div className='campos'>
        <div className='listaMat'>
          <p>Lista Materiales:</p> 
          <p>{listaMAT}</p>
        </div>
        <div className='textoCampos'>
          <p>Costo total en materiales aproximado</p>
          <p>Tiempo(En horas) aproximado</p> 
          <p>Costo por hora </p>
        </div>
        <div className='entradasCampos'>
            <p>{costoMAT}</p>
            <p>{tiempoAprox}</p>
            <p>{costoXHora}</p>
        </div>
      </div>
      <div className='horarios'>
        <div>
          <h2>Fechas y Horas Seleccionadas:</h2>
          <p>{horariosDisp}</p>
        </div>
      </div>
      <button type='button'>Atrás</button>
    </div>
  </>
  )
}

export default DetalleServicio;