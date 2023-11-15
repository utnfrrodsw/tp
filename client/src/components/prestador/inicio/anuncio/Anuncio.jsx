import React, { useState } from 'react';
import './anuncio.css';
import { Carousel, Container, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Anuncio(props) {
  console.log(props.filtrado);
  const [show, setShow] = useState(true);
  const [verfotos, setVerfotos] = useState(false);
  const dateTime = new Date(props.fechaHora);
  console.log(dateTime);
  return (
    <div className={`anuncioprincipal-card ${show ? 'anuncioprincipal-card' : 'anuncioprincipal-fullcontent'}`}>
      <div>
        <h1 className='titulo-anuncio'>{props.titulo}</h1>
        <p className='fecha-anuncio'>
          Fecha publicacion: {dateTime.toLocaleDateString()}
        </p>
        <p className='ubicacion-anuncio'>
          {props.direccion.calle} {props.direccion.numero}, {props.direccion.codPostal}
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
          <button className='boton-anuncio' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
          ): (
          <div className='boton'>
            {props.filtrado === "nuevas" ?
            <Link to={`/provider/home/add/budget/${props.id}`} className='button-link'>Presupuestar</Link>
            : <></>}
            {props.filtrado === "presupuestadas" ?
            <Link to={`/provider/home/budgeted/more/${props.id}`} className='button-link'>Ver informacion Presupuesto</Link>
            : <></>}
            {props.filtrado === "aceptadas" ?
            <Link to={`/provider/home/accepted/more/${props.id}`} className='button-link'>Ver informacion Servicio</Link>
            : <></>}
            <button className='boton-anuncio' onClick={() => { setShow(!show); }}>Ver {show ? 'más' : 'menos'}</button>
            
          </div>
          )}
    </div>
  );
}

export default Anuncio;
