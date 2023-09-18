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
        <p>Lista Materiales: </p><textarea name="materiales" id="1" cols="60" rows="10" required></textarea>
        <p>Costo materiales<input type="" name="costo-materiales" required/></p>
        <p>Tiempo <input type="number" min={1} required/></p>
        <p>Costo en horas aprox <input type="number" min={1} required/></p>
      </div>
      <div className='horarios'>
      <input id="datetimePicker" type="datetime-local"  required/>
      <button >agregar</button>
      </div>
      <button>Atrás</button>
      <p id="resultado"></p>
      <input type="submit"/>
    </form>
  </>
  )
}
function obtenerFechaHora(){
  const resultado = document.getElementById("resultado");
  resultado.textContent = 'Valor seleccionado:' 
  /* // Obtener la referencia al elemento datetime-local
  const datetimePicker = document.getElementById("datetimePicker");
            
  // Obtener el valor del elemento
  const datetimeValue = datetimePicker.value;
            
  // Puedes convertir el valor a un objeto Date si es necesario
  const date = new Date(datetimeValue);
            
  // Mostrar el valor obtenido
  const resultado = document.getElementById("resultado");
  resultado.textContent = `Valor seleccionado: ${datetimeValue}`;*/
}

export default Presupuesto;