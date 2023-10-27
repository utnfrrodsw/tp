import React, { useEffect, useState} from 'react';
import './solicitud.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';
import { Modal, Carousel, Container, Image} from 'react-bootstrap';
import PresupuestoSolicitud from '../presupuestoSolicitud/PresupuestoSolicitud.jsx';

function Solicitud(props){

  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const [verfotos, setVerfotos] = useState(false);
  const [verPresupuestos, setVerPresupuestos] = useState(false);
  const [presupuestosSolicitud, setPresupuestosSolicitud] = useState([]);
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

  useEffect(() => {
    /*if(verPresupuestos){
      const response = fetch(`${API_URL}/presupuesto/solicitud/${props.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPresupuestosSolicitud(data.body.presupuestos);
      })
      if(response.ok){
        setError(false)
      }else{
        console.log('Error al cargar presupuestos');
        setError(true);
      };
    }*/
  });
  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} >
        <div>
          <div className={`estado-solicitud estado-${props.estado}`}>
            {props.estado === "activa" && <>Activa</>}
            {props.estado === "progreso" && <>En Proceso</>}
            {props.estado === "terminado" && <>Finalizado</>}
          </div>
          <h1 className='titulo-solicitud'>{props.titulo}</h1>
          <p className='fecha-solicitud'>{props.profesion.nombreProfesion}
          {props.estado === "progreso" || props.estado === "terminado" ? <>: nombre prestador</> : <></>}</p>
          <p className='fecha-solicitud'>
          {props.estado === "activa"? <>{dateTime.getDay()}/{dateTime.getMonth()}/{dateTime.getFullYear()}  {dateTime.getHours()}:{dateTime.getMinutes()} </> :<></>}
          {props.estado === "progreso" || props.estado === "terminado" ? <>hora y fecha del trabajo </>:<></>}
           hs
          </p>
          <p className='ubicacion-solicitud'>{props.direccion.calle} {props.direccion.numero}</p>
        </div>
        {show ? (
          <> </>
        ) : (
          <div>
              <p className='descripcion-solicitud'>{props.descripcion}</p>
              <section className='botones'>
                <button className='fotos' onClick={() => setVerfotos(true)}>ver fotos</button>
                  <Modal show={verfotos} onHide={() => setVerfotos(false)} fullscreen={true} className='modales-solicitud'>
                    <Modal.Header closeButton>
                      <Modal.Title>Fotos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Carousel style={{ width: '100%', height: '100%' }}>
                      {props.fotos.map((img, index) => (
                          <Carousel.Item style={{margin_top: '10px'}}>
                            <Container>
                              <Image key={index} src={'http://localhost:5000/images/imagesdb/'+ img.foto} alt="foto" className="foto" style={{ width: '45%', height: '45%' }}  />
                            </Container>
                          </Carousel.Item>
                      ))}
                    </Carousel>
                    </Modal.Body>
                  </Modal>
                
                {props.estado === "activa" ? (
                <>
                  <button className='ver-presupuestos-button' onClick={() => setVerPresupuestos(true)} >ver presupuestos</button>
                  <Modal show={verPresupuestos} onHide={() => setVerPresupuestos(false)} fullscreen={true} className='modales-solicitud'>
                      <Modal.Header closeButton>
                        <Modal.Title>Presupuestos</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{display: 'flex', justifyContent:'center'}}>
                      {presupuestosSolicitud.length > 0 ? (
                        presupuestosSolicitud.map((presupuesto) => {
                          <PresupuestoSolicitud presupuesto={presupuesto}/>
                        }
                      )): <PresupuestoSolicitud/>}
                      </Modal.Body>
                    </Modal>
                </>
                ): <></>}
                {props.estado === "terminado" ? (
                <>
                  <button className='ver-presupuestos-button'>Hacer Reseña</button>
                  <Modal show={verPresupuestos} onHide={() => setVerPresupuestos(false)} fullscreen={true} style={{padding: '0px'}}>
                      <Modal.Header closeButton>
                        <Modal.Title>Presupuestos</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                      

                      </Modal.Body>
                    </Modal>
                </>
                ): <></>}
              </section>

          </div>
        )}

        

        {show ? (
          <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          ): (
          <div>
            {props.estado === "activa" ?
            <button className='cancelar' onClick={async() => {await hendleCancelar(); props.hendleSolicitudesUpdate();}}>Cancelar Solicitud</button>
            : <></>}
            <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
            {error && <p className='error' style={{color: "red", backgroundColor: "white", width: "20%", alignSelf: "self-end"}}>Error al cancelar solicitud</p>}
          </div>
          )}
    </div>
  );
}

export default Solicitud;


