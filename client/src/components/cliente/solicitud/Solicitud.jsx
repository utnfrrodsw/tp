import React, { useState} from 'react';
import './solicitud.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';


function Solicitud(props){

  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const auth = useAuth();
  const dateTime = new Date(props.fecha);


  
  const hendleCancelar = async () => {
    try{
      console.log('cancelar solicitud para id ' + props.id)
      const response = await fetch(`${API_URL}/solicitud/cancelar/`+props.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      }); 
      if(response.ok){
        setError(false);
      }else{
        console.log('Error al cancelar solicitud');
        setError(true);
      }
    }catch(err){
      console.log(err);
      setError(true);
    }
  }
  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} >
        <div>
          <div className={`estado-solicitud estado-${props.estado}`}>
            {props.estado === "activa" && <>Activa</>}
            {props.estado === "enProceso" && <>En Proceso</>}
            {props.estado === "finalizado" && <>Finalizado</>}
          </div>
          <h1 className='titulo-solicitud'>{props.titulo}</h1>
          <p className='fecha-solicitud'>{dateTime.getDay()}/{dateTime.getMonth()}/{dateTime.getFullYear()}  {dateTime.getHours()}:{dateTime.getMinutes()}hs</p>
          <p className='ubicacion-solicitud'>{props.direccion.calle} {props.direccion.numero}</p>
        </div>
        {show ? (
          <> </>
        ) : (
          <div>
              <p className='descripcion-solicitud'>{props.descripcion}</p>
              <section className='botones'>
                <button className='fotos' >ver fotos</button>
                <button className='cancelar' onClick={async() => {await hendleCancelar(); props.hendleSolicitudesUpdate();}}>Cancelar Solicitud</button>
                {error && <p className='error'>Error al cancelar solicitud</p>}
              </section>
          </div>
        )}

        

        {show ? (
          <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          ): ( 
          <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          )}
    </div>
  );
}

export default Solicitud;


