import React, { useEffect, useState} from 'react';
import './solicitud.css';
import { REACT_APP_PHOTO } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider';
import { Modal, Carousel, Container, Image, Button, Spinner} from 'react-bootstrap';
import PresupuestoSolicitud from '../presupuestoSolicitud/PresupuestoSolicitud.jsx';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo.jsx';
import Review from '../../reseña/Review';
import { getPresupuestosSolicitud } from '../../../services/Presupuesto.js';
import { deleteSolicitud, fetchGetReseña, fetchConfirmarRechazar} from '../../../services/Solicitud.js';


function Solicitud(props){
  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);
  const [errorGetPresupuestos, setErrorGetPresupuestos] = useState(""); // eslint-disable-line no-unused-vars
  const [errorConfirmarRechazar, setErrorConfirmarRechazar] = useState(""); // eslint-disable-line no-unused-vars
  const [verfotos, setVerfotos] = useState(false);
  const [verPresupuestos, setVerPresupuestos] = useState(false);
  const [presupuestosSolicitud, setPresupuestosSolicitud] = useState([]);
  const [reseniaError, setReseniaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadAceptarRechazar, setLoadAceptarRechazar] = useState(false);
  const [loadCancelar, setLoadCancelar] = useState(false); // eslint-disable-line no-unused-vars
  const [hacerReseña, setHacerReseña] = useState(false);
  const auth = useAuth();

  // eslint-disable-next-line
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPresupuestosSolicitud(props.id, auth.getAccessToken());
        if(response.statusCode === 200){
          setPresupuestosSolicitud(response.body.presupuestos);
        }else{
          setErrorGetPresupuestos("Error al obtener presupuestos");
        }
      } catch (error) {
        setErrorGetPresupuestos(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (verPresupuestos) {
      fetchData();
    }
  }, [verPresupuestos, props.id, auth.getAccessToken]);

  const hendleCancelar = async () => {
    setLoadCancelar(true);
    try{
      const response = await deleteSolicitud(props.id, auth.getRefreshToken());
      if(response.statusCode === 200){
        setError(false);
        props.hendleSolicitudesUpdate();
      }else{
        setError(true);
      }
    }catch(err){
      setError(true);
    }finally{
      setLoadCancelar(false);
    }
  }

  const hendlePresupuestoPagado = () => {
    setVerPresupuestos(false);
    props.hendleSolicitudesUpdate();
  };

  const handleHacerReseña = async () => {
    try{
      setReseniaError("");
      const response = await fetchGetReseña(props.id, props.idPrestador, auth.getAccessToken());
      if(response.statusCode === 200){
        setHacerReseña(true);
      }else{
        setHacerReseña(false);
        setReseniaError("Error al hacer reseña");
        setTimeout(() => {
          setReseniaError("");
        }, 10000);
      }
    }catch(error){
      setReseniaError(error);
      setTimeout(() => {
        setReseniaError("");
      }, 10000);
    }
  };

  const hendleCalificarUpdate = () => {
    setHacerReseña(false);
    props.hendleSolicitudesUpdate();
  }

  const handleConfirmarRechazar = async (estado) => {
    try{
      setLoadAceptarRechazar(true);
      const response = await fetchConfirmarRechazar(props.id, estado, auth.getRefreshToken());
      if(response.statusCode === 200){
        setErrorConfirmarRechazar("");
        props.hendleSolicitudesUpdate();
      }else{
        setErrorConfirmarRechazar("Error al confirmar/rechazar");
      }
    }catch(error){
      setErrorConfirmarRechazar(error);
    }finally{
      setLoadAceptarRechazar(false);
      setTimeout(() => {
        setErrorConfirmarRechazar("");
      }, 10000);
    }
  }
  
  return (
    <div className={`solicprincipal-card ${show ? "solicprincipal-card" : "solicprincipal-fullcontent"}`} >
        <div>
          <div className={`estado-solicitud estado-${props.estado} estado-${props.estadoServicio}`}>
            {props.estado === "activa" && <>Activa</>}
            {props.estado === "progreso" && props.estadoServicio === "progreso" && <>En Progreso</>}
            {props.estado === "progreso" && props.estadoServicio === "aConfirmar" && <>Esperando Confirmacion</>}
            {props.estado === "terminado" && <>Finalizado</>}
          </div>
          <h1 className='titulo-solicitud'>{props.titulo}</h1>
          <p className='fecha-solicitud'>{props.profesion.nombreProfesion} </p>
          {props.estado === "progreso" || props.estado === "terminado" ? <p className='fecha-solicitud'>{props.nombrePrestador}</p> : <></>}
          {props.estado === "activa"? (<p className='fecha-solicitud'>Fecha Solicitud: {props.fecha}</p>) :<></>}
          {props.estado === "progreso" || props.estado === "terminado" ? <p className='fecha-solicitud'>Fecha Servicio: {props.fecha} </p>:<></>}
          <p className='ubicacion-solicitud'>{props.direccion.calle} {props.direccion.numero}, {props.direccion.localidad.nombre} {props.direccion.localidad.provincia}</p>
        </div>
        {show ? (
          <> </>
        ) : (
          <div>
              <p className='descripcion-solicitud'>{props.descripcion}</p>
              {props.estado === "terminado" ? <p className='descripcion-solicitud'> {props.cartelResenia} </p>:<></>}
              <section className='botones'>
                <Button className='fotos' onClick={() => setVerfotos(true)}>ver fotos</Button>
                  <Modal show={verfotos} onHide={() => setVerfotos(false)} fullscreen={true} className='modales-solicitud'>
                    <Modal.Header closeButton>
                      <Modal.Title>Fotos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Carousel style={{ width: '100%', height: '100%' }}>
                      {props.fotos.map((img, index) => (
                          <Carousel.Item style={{margin_top: '10px'}}>
                            <Container>
                              <Image key={index} src={ REACT_APP_PHOTO + '/images/imagesdb/'+ img.foto} alt="foto" className="foto" style={{ width: '45%', height: '45%' }}  />
                            </Container>
                          </Carousel.Item>
                      ))}
                    </Carousel>
                    </Modal.Body>
                  </Modal>

                {props.estado === "activa" ? (
                <>
                  <Button className='ver-presupuestos-button' onClick={() => setVerPresupuestos(true)} >ver presupuestos</Button>
                  <Modal show={verPresupuestos} onHide={() => setVerPresupuestos(false)} fullscreen={true} className='modales-solicitud'>
                    <Modal.Header closeButton >
                      <Modal.Title >Presupuestos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className = 'contenedor-presupuestos'>
                        {loading === false ? 
                          (<>
                            {presupuestosSolicitud.length > 0 ? (
                              presupuestosSolicitud.map((presupuesto) => {
                                return (
                                  <PresupuestoSolicitud 
                                    key={presupuesto.idPrestador}
                                    idPrestador={presupuesto.idPrestador}
                                    rating={parseFloat(presupuesto.rating.rating)}
                                    idSolicitud={presupuesto.idSolicitud}
                                    nombrePrestador={presupuesto.nombrePrestador}
                                    materiales={presupuesto.materiales}
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
                      {errorGetPresupuestos && <p className='error' style={{color: "red", width: "100%", alignSelf: "center"}}>{errorGetPresupuestos}</p>}
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                  </Modal>
                </>
                ): <></>}


                {props.estado === "progreso" && props.estadoServicio === "aConfirmar" ? (
                  <section className='botones-confirmacion-container'>
                    {loadAceptarRechazar ? <><Spinner/>Enviando...</>: <>
                      <Button className='button-confirmar' onClick={() => handleConfirmarRechazar("terminado")}>Confirmar</Button>
                      <Button className='button-rechazar' onClick={() => handleConfirmarRechazar("progreso")}>Rechazar</Button>
                    </>}
                    {errorConfirmarRechazar !== "" && <p className='error' style={{color: "red", width: "100%", alignSelf: "center"}}>{errorConfirmarRechazar}</p>}
                  </section>
                ): <></>}

                {props.estado === "terminado" ? (
                <>
                {props.cartelResenia === "No Calificado" &&
                  <Button className='ver-presupuestos-button' onClick={handleHacerReseña}>Hacer Reseña</Button>}
                  {reseniaError !== "" && <p className='error' style={{color: "red", width: "100%", alignSelf: "center"}}>{reseniaError}</p>}
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
            <button className='cancelar' onClick={async() => {await hendleCancelar(); props.hendleSolicitudesUpdate();}}>
              {loadCancelar ? <> 
              <Spinner as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              Cancelando... </>: <>Cancelar Solicitud</>}</button>
            : <></>}
            <button className='boton-solicitud' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
            {error && <p className='error' style={{color: "red", backgroundColor: "white", width: "20%", alignSelf: "self-end"}}>Error al cancelar solicitud</p>}
          </div>
          )}
    </div>
  );
}

export default Solicitud;


