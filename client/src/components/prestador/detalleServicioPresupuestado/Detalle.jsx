import '../presupuesto/Presupuesto.css'

function Detalle(props) {
if (!props) {
    return <p>Loading...</p>;
  }  
  return (
    <>
      <div className="anuncio-Content">
          <>
            <div className='datos'>
              <p><h2>Detalles del Anuncio:</h2></p>
              <p>Usuario: {props.nombre}</p>
              <p>Número de Anuncio: {props.idSolicitud}</p>
              <p>Fecha de publicación: {new Date(props.fechaHora).toLocaleString()}</p>
              <p>Ubicación: {props.direccion}</p> 
            </div>
            <div className='descripcion'>
              <h3>Título: {props.titulo}</h3>
              <h3><p>Descripción:</p></h3> 
              {props.descripcion}</div>
          </>
      </div>

      <div className="presupuesto-Content">
          <div className='campos'>              
              
            <div className='listaMat'>
              <p><h2>Detalles del Presupuesto:</h2></p>
              <p>Materiales: {props.materiales}</p>
            </div>
            <div className='textoCampos'>
              <p>Costo de Materiales: {props.costoMateriales}</p>
              <p>Tiempo: {props.tiempo} horas</p>
              <p>Costo por Hora: {props.costoxHora}</p>
            </div>
          </div> 
          <div className='horarios'>
              <p></p>
              <h3>Fechas Seleccionadas:</h3>
              <p>{props.fechasSeleccionadas}</p>
          </div> 
      </div>
    </>
  )
}

export default Detalle;
