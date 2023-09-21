import { Link } from 'react-router-dom';
import './Presupuesto.css'
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
  function Presupuesto({anuncios}){

    const { id } = useParams();
    const anuncio= anuncios.find((anuncio)=>anuncio.id === parseInt(id));

    
  const [datetimeValue, setDatetimeValue] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const currentDate = new Date().toISOString().slice(0, 16); // Obtiene la fecha y hora actual en formato "yyyy-MM-ddTHH:mm"
 
  const handleDatetimeChange = (event) => {
    // Obtener el valor seleccionado por el usuario del input datetime-local
    const newValue = event.target.value;
    setDatetimeValue(newValue);
  };
  
  const handleAddDate = () => {
    if (datetimeValue.trim() !== '') {
      // Agregar la fecha y hora seleccionada al array de fechas seleccionadas
      setSelectedDates([...selectedDates, datetimeValue]);
      // Limpiar el valor del input datetime-local
      setDatetimeValue('');
    }
  };
  
  const handleRemoveDate = (index) => {
    // Eliminar la fecha y hora seleccionada del array de fechas seleccionadas
    const newDates = [...selectedDates];
    newDates.splice(index, 1);
    setSelectedDates(newDates);
  };
  return(
  <>
    <div className="anuncio-Content">
      <div className='datos'>
          <p><h2>Detalles:</h2></p>
          <p>Número de anuncio: {anuncio.id}</p>
          <p>Título: {anuncio.titulo}</p>
          <p>Fecha de publicacion: {anuncio.fecha}</p>
          <p>Ubicacion: {anuncio.ubicacion}</p>
          <p>Propietario de anuncio: {anuncio.nombre}</p>
      </div>
      <div className='descripcion'><h3><p>Descripcion:</p></h3> {}Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla nostrum sit animi nesciunt ratione quas autem aspernatur unde voluptatum. Eos odio impedit similique aspernatur aperiam ex tempora enim quod vel.</div>
    </div>
    <form className='presupuesto-Content'>
      <div className='campos'>
        <p>Lista Materiales: </p><textarea name="materiales" id="1" cols="60" rows="10" required></textarea>
        <p>Costo total en materiales aproximado<input type="number" name="costo-materiales" min={1} required/></p>
        <p>Tiempo(En horas) aprox <input name='tiempo' type="number" min={1} required/></p>
        <p>Costo por hora <input type="number" name='costoxHora' min={1} required/></p>
      </div>
      <div className='horarios'>
        <p htmlFor="datetimePicker">Selecciona una fecha y hora:</p>
        <input 
          id="datetimePicker" 
          type="datetime-local"  
          value={datetimeValue} 
          onChange={handleDatetimeChange}
          min={currentDate}
        />
        <button type='button' onClick={handleAddDate}>+</button>
        <div>
          <h2>Fechas y Horas Seleccionadas:</h2>
          <ul>
          {selectedDates.map((date, index) => (
            <li key={index}>
              {date}
              <button type='button' onClick={() => handleRemoveDate(index)}>-</button>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <button type='button'>Atrás</button>
      <input type="submit"/>
    </form>
  </>
  )
}

export default Presupuesto;