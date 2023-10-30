import React, { useEffect, useState} from 'react';
import './solicitud.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';
import { Modal, Carousel, Container, Image} from 'react-bootstrap';
import PresupuestoSolicitud from '../presupuestoSolicitud/PresupuestoSolicitud.jsx';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo.jsx';
import Review from '../../reseña/Review';

function Solicitud(props){

  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const [verfotos, setVerfotos] = useState(false);
  const [verPresupuestos, setVerPresupuestos] = useState(false);
  const [presupuestosSolicitud, setPresupuestosSolicitud] = useState([]);
  const [reseniaError, setReseniaError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hacerReseña, setHacerReseña] = useState(false);
  const auth = useAuth();
  const dateTime = new Date(props.fecha);

  // eslint-disable-next-line
  useEffect(() => {
    if(verPresupuestos){
      console.log(verPresupuestos)
      setLoading(true);
      fetch(`${API_URL}/presupuesto/solicitud/${props.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPresupuestosSolicitud(data.body.presupuestos);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error)
        console.error('Error al cargar presupuestos:', error);
        setError(true);
        setLoading(false);
      });
    }
  }, [verPresupuestos]);

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

  const hendlePresupuestoPagado = () => {
    setVerPresupuestos(false);
    props.hendleSolicitudesUpdate();
  };

  const handleHacerReseña = async () => {
    try{
      setReseniaError(false);
      const response = await fetch(`${API_URL}/servicio/isreviewed/${props.id}/${props.idPrestador}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.body.isReviewed === false){
          setHacerReseña(true);
        }else{
          setHacerReseña(false);
          alert('Ya has realizado una reseña para este servicio');
        }
      }).catch((error) => {
        console.error('Error al cargar reseña:', error);
        setReseniaError(true);
        setTimeout(() => {
          setReseniaError(false);
        }, 10000);
      });
      
    }catch(err){
      console.log(err);
    }
  };

  const hendleCalificarUpdate = () => {
    setHacerReseña(false);
  }

  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} >
        <div>
          <div className={`estado-solicitud estado-${props.estado}`}>
            {props.estado === "activa" && <>Activa</>}
            {props.estado === "progreso" && <>En Proceso</>}
            {props.estado === "terminado" && <>Finalizado</>}
          </div>
          <h1 className='titulo-solicitud'>{props.titulo}</h1>
          <p className='fecha-solicitud'>{props.profesion.nombreProfesion} </p>
          <p className='fecha-solicitud' >{props.estado === "progreso" || props.estado === "terminado" ? <>{props.nombrePrestador}</> : <></>}</p>
          <p className='fecha-solicitud'>
          {props.estado === "activa"? <>{dateTime.getDay()}/{dateTime.getMonth()}/{dateTime.getFullYear()}  {dateTime.getHours()}:{dateTime.getMinutes()} </> :<></>}
          {props.estado === "progreso" || props.estado === "terminado" ? <>{props.fechaHora} </>:<></>}
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
                      <div className='contenedor-presupuestos'>
                        {loading === false ? 
                          (<>
                            {presupuestosSolicitud.length > 0 ? (
                              presupuestosSolicitud.map((presupuesto, index) => {
                                console.log(presupuesto)
                                return (
                                  <PresupuestoSolicitud 
                                    key={index}
                                    idPrestador={presupuesto.idPrestador}
                                    idSolicitud={presupuesto.idSolicitud}
                                    nombrePrestador={presupuesto.nombrePrestador}
                                    costoMateriales={presupuesto.costoMateriales}
                                    costoXHora={presupuesto.costoXHora}
                                    costoTotal={presupuesto.costoTotal}
                                    fechasDisponibles={presupuesto.fechasDisponibles}
                                    hendlePresupuestoPagado={hendlePresupuestoPagado}
                                  />
                                );
                              })
                            ) : (
                              <h2 style={{alignSelf:'center'}}>No Hay Presupuestos Enviados</h2>
                            )}
                          </>) : (
                            <LoaderFijo/>
                          )
                        }
                      </div>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                  </Modal>
                </>
                ): <></>} 
                {props.estado === "terminado" ? (
                <>
                  <button className='ver-presupuestos-button' onClick={handleHacerReseña}>Hacer Reseña</button>
                  {reseniaError && <p className='error' style={{color: "red", width: "100%", alignSelf: "center"}}>Error al cargar reseña</p>}
                  <Modal show={hacerReseña} onHide={() => setHacerReseña(false)} style={{padding: '0px'}}>
                      <Modal.Header closeButton>
                        <Modal.Title>Reseña del Servicio</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Review idSolicitud={props.id} idPrestador={props.idPrestador} hendleCalificarUpdate={hendleCalificarUpdate}/>
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


