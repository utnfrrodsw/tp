import React, { useState } from 'react';
import './anuncio.css';
import { Carousel, Container, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {REACT_APP_PHOTO} from '../../../../auth/constants.js';

function Anuncio(props) {
  
  const [show, setShow] = useState(true);
  const [verfotos, setVerfotos] = useState(false);
  const dateTime = new Date(props.fechaHora);
  
  return (
    <div className={`anuncioprincipal-card ${show ? 'anuncioprincipal-card' : 'anuncioprincipal-fullcontent'}`}>
      <div>
          <div className={`estado-solicitud anuncio-${props.estado}-filtrado-${props.filtrado}`}>
            {props.estado === "activa" && props.filtrado === "nuevas" && <>Nuevo</>}
            {props.estado === "activa" && props.filtrado === "presupuestadas" && <>Presupuestada</>}
            {props.estado === "progreso" && props.filtrado === "presupuestadas" && <>Caducada</>}
            {props.estado === "progreso" && props.filtrado === "aceptadas" && <>Progreso</>}
            {props.estado === "terminado" && props.filtrado === "aceptadas" && <>Finalizado</>}
          </div>
        <h1 className='titulo-anuncio'>{props.titulo}</h1>
        <p className='fecha-anuncio'>
          Fecha publicacion: {dateTime.toLocaleDateString()}
        </p>
        <p className='ubicacion-anuncio'>
          {props.direccion.localidad.nombre},{props.direccion.localidad.provincia}
        </p>
      </div>
      {show ? (
        <> </>
      ) : (
        <div>
          <p className='descripcion-anuncio'>{props.descripcion}</p>
          <section className='botones'>
            <button className='fotos' onClick={() => setVerfotos(true)}>
              ver fotos
            </button>
            <Modal show={verfotos} onHide={() => setVerfotos(false)} fullscreen={true}>
              <Modal.Header closeButton>
                <Modal.Title>Fotos</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{backgroundColor: 'rgb(33, 53, 85)'}}>
                <Carousel style={{ width: '100%', height: '100%' }}>
                  {props.fotos.map((img, index) => (
                    <Carousel.Item style={{ margin_top: '10px' }}>
                      <Container>
                        <Image
                          key={index}
                          src={REACT_APP_PHOTO + '/images/imagesdb/'+ img.foto}
                          alt='foto'
                          className='foto'
                          style={{ width: '60%', height: '60%' }}
                        />
                      </Container>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Modal.Body>
            </Modal>
          </section>
        </div>
      )}
      <button className='boton-anuncio' onClick={() => { setShow(!show); }} >Ver {show ? 'más' : 'menos'}</button>
      {show ? (
          <></>
          ): (
          <div className='botones'>
            {props.filtrado === "nuevas" ?
            <Link to={`/provider/home/add/budget/${props.id}`} className='button-link'>Presupuestar</Link>
            : <></>}
            {props.filtrado === "presupuestadas" ?
            <Link to={`/provider/home/budgeted/more/${props.id}`} className='button-link'>Ver informacion Presupuesto</Link>
            : <></>}
            {props.filtrado === "aceptadas" ?
            <Link to={`/provider/home/accepted/more/${props.id}`} className='button-link'>Ver informacion Servicio</Link>
            : <></>}            
          </div>
          )}
    </div>
  );
}

export default Anuncio;
