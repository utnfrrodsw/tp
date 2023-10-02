import React, { useState } from 'react';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import './Evaluaciones.css';

const Evaluaciones = () => {
  const evaluacionesData = [
    {
      id: 1,
      titulo: 'Reparación de Fuga de Agua',
      descripcion: 'Excelente servicio, el plomero llegó a tiempo y solucionó la fuga de agua de manera eficiente. Muy satisfecho con su trabajo.',
      puntaje: 5,
    },
    {
      id: 2,
      titulo: 'Instalación de Tuberías Nuevas',
      descripcion: 'El plomero hizo un trabajo impecable al instalar las tuberías nuevas en mi hogar. Se aseguró de que todo estuviera funcionando correctamente.',
      puntaje: 4,
    },
    {
      id: 3,
      titulo: 'Reparación de Inodoro',
      descripcion: 'Rápida respuesta a mi llamada de emergencia. El plomero arregló el inodoro en poco tiempo y explicó claramente el problema. Buen servicio.',
      puntaje: 3,
    },
    {
      id: 4,
      titulo: 'Limpieza de Desagües',
      descripcion: 'El plomero limpió los desagües de mi casa y ahora el agua fluye sin problemas. Un trabajo necesario y bien hecho.',
      puntaje: 5,
    },
    {
      id: 5,
      titulo: 'Reemplazo de Canilla',
      descripcion: 'El plomero reemplazó el canilla de la cocina de manera profesional. Trabajó rápido y dejó todo limpio. Buen precio.',
      puntaje: 4,
    },
    // Agrega más evaluaciones aquí
  ];

  const generarEstrellas = puntaje => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span key={i} className={i <= puntaje ? 'estrella activa' : 'estrella'}>
          ★
        </span>
      );
    }
    return estrellas;
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);

  const openModal = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section className='fondoEvaluation'>
      <Row>
        {evaluacionesData.map(evaluacion => (
          <Col key={evaluacion.id} md={4}>
             <div className="evaluacion-card">
              <Card.Body>
                <Card.Title > <div className="evaluacion-titulo">{evaluacion.titulo}</div></Card.Title>
                <div className="evaluacion-puntaje">{generarEstrellas(evaluacion.puntaje)}</div>
                <button onClick={() => openModal(evaluacion)} className="evaluacion-button">Ver Detalles</button>
              </Card.Body> 
              </div>
            
           
          </Col>
        ))}
      </Row>

      {/* Ventana modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Evaluación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvaluacion && (
            <div>
              <h4 className='title'>{selectedEvaluacion.titulo}</h4>
              <p className='desc'>{selectedEvaluacion.descripcion}</p>
              <p className='puntaje'>Puntaje: {selectedEvaluacion.puntaje}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Evaluaciones;
