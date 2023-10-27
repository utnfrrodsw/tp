import React, { useState } from 'react';
import './anuncio.css';
import { Carousel, Container, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Anuncio(props) {
  const [show, setShow] = useState(true);
  const [verfotos, setVerfotos] = useState(false);

  const dateTime = new Date(props.fecha);

  return (
    <div className={`anuncioprincipal-card ${show ? 'anuncioprincipal-card' : 'anuncioprincipal-fullcontent'}`}>
      <div>
        <div className={`estado-anuncio estado-${props.estado}`}>
          {props.estado === 'activa' && <>Activa</>}
          {props.estado === 'enProceso' && <>En Proceso</>}
          {props.estado === 'finalizado' && <>Finalizado</>}
        </div>
        <h1 className='titulo-anuncio'>{props.titulo}</h1>
        <p className='fecha-anuncio'>{props.profesion.nombreProfesion}</p>
        <p className='fecha-anuncio'>
          {dateTime.getDay()}/{dateTime.getMonth()}/{dateTime.getFullYear()} {dateTime.getHours()}:{dateTime.getMinutes()}hs
        </p>
        <p className='ubicacion-anuncio'>
          {props.direccion.calle} {props.direccion.numero}
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
              <Modal.Body>
                <Carousel style={{ width: '100%', height: '100%' }}>
                  {props.fotos.map((img, index) => (
                    <Carousel.Item style={{ margin_top: '10px' }}>
                      <Container>
                        <Image
                          key={index}
                          src={'http://localhost:5000/images/imagesdb/' + img.foto}
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
      {show ? (
        <button className='boton-anuncio' onClick={() => setShow(!show)}>
          Ver {show ? 'más' : 'menos'}
        </button>
      ) : (
        <button className='boton-anuncio' onClick={() => setShow(!show)}>
          Ver {show ? 'más' : 'menos'}
        </button>
      )}
    </div>
  );
}

export default Anuncio;
