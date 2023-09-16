import React from 'react';
import { Link } from 'react-router-dom';
import './Presupuesto.css'
  function Presupuesto(){
  return(
  <>
    <div className="anuncio-Content">
      <div className='datos'>
          <p><h2>Detalles:</h2></p>
          <p>Número de anuncio: XXXYYY</p>
          <p>Título: Se busca gasista</p>
          <p>Fecha de publicacion: 22/22/22</p>
          <p>Ubicacion: San Fernando Del Valle de Catamarca</p>
          <p>Propietario de anuncio: Pablo Lampone</p>
      </div>
      <div className='descripcion'><h3><p>Descripcion:</p></h3> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla nostrum sit animi nesciunt ratione quas autem aspernatur unde voluptatum. Eos odio impedit similique aspernatur aperiam ex tempora enim quod vel.</div>
    </div>
    <form className='presupuesto-Content'>
      <div className='campos'>
        <p>Costo materiales</p>
        <p>Tiempo</p>
        <p>Costo en horas aprox</p>
      </div>
      <div className='horarios'></div>
    </form>
  </>
  )
}

export default Presupuesto;