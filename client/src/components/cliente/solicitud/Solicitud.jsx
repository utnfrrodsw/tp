import React, { useState} from 'react';
import './solicitud.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';
import { Modal, Carousel, Container, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Solicitud(props){

  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const [verfotos, setVerfotos] = useState(false);
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
                <button className='fotos' onClick={() => setVerfotos(true)}>ver fotos</button>
                  <Modal show={verfotos} onHide={() => setVerfotos(false)} fullscreen={true}>
                    <Modal.Header closeButton>
                      <Modal.Title>Fotos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Carousel style={{ width: '100%', height: '100%' }}>
                      {props.fotos.map((img, index) => (
                          <Carousel.Item style={{margin_top: '10px'}}>
                            <Container>
                              <Image key={index} src={'http://localhost:5000/images/imagesdb/'+ img.foto} alt="foto" className="foto" style={{ width: '40%', height: '40%' }}  />
                            </Container>
                          </Carousel.Item>
                        
                      ))}
                    </Carousel>
                    </Modal.Body>
                  </Modal>
                <button className='ver-presupuestos-button' >ver presupuestos</button>
              </section>

          </div>
        )}

        

        {show ? (
          <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          ): (
          <div>
            <button className='cancelar' onClick={async() => {await hendleCancelar(); props.hendleSolicitudesUpdate();}}>Cancelar Solicitud</button>
            {error && <p className='error'>Error al cancelar solicitud</p>}
            <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          </div>
          )}
    </div>
  );
}

export default Solicitud;


