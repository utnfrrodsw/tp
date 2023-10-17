import React, { useState } from 'react';
import './solicitud.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';

function Solicitud(props){

  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const auth = useAuth();

  const CerrarSolicitud = () => {
    setShow(true);
  }
  
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
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} onMouseLeave={CerrarSolicitud}>
   
      <h1 className='titulo'>{props.titulo}</h1>
      <p className='fecha'>{props.fecha}</p>
      <p className='direccion'>{props.direccion.calle} {props.direccion.numero}</p>
    
      <button className='boton' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
      
      {show ? (
        <h1> </h1>
      ) : (
        <>
          <p className='estado'>{props.estado}</p>
          <p className='descripcion'>{props.descripcion}</p>
          {props.fotos.map((foto) => (
            <img key={foto.id} src={'http://localhost:5000/images/imagesdb/'+ foto.foto} alt="foto" className="foto" />
          ))}
          <button onClick={async() => {await hendleCancelar(); props.hendleSolicitudesUpdate();}}>Cancelar Solicitud</button>
          {error && <p className='error'>Error al cancelar solicitud</p>}
        </>
      )}
    </div>
  );
}

export default Solicitud;
