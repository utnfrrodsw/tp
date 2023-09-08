import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import './Evaluaciones.css';

const Evaluaciones = () => {
  const evaluacionesData = [
    { id: 1, titulo: 'Evaluación 1', descripcion: 'Descripción de la evaluación 1', puntaje: 4 },
    { id: 2, titulo: 'Evaluación 2', descripcion: 'Descripción de la evaluación 2', puntaje: 5 },
    { id: 3, titulo: 'Evaluación 3', descripcion: 'Descripción de la evaluación 3', puntaje: 3 },
    { id: 4, titulo: 'Evaluación 4', descripcion: 'Descripción de la evaluación 4', puntaje: 2 },
    { id: 5, titulo: 'Evaluación 5', descripcion: 'Descripción de la evaluación 5', puntaje: 5 },
    { id: 6, titulo: 'Evaluación 6', descripcion: 'Descripción de la evaluación 6', puntaje: 2 },
    // ... Agrega más evaluaciones aquí
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

  return (
    <section className='fondoEvaluation'>
      <Row>
        {evaluacionesData.map(evaluacion => (
          <Col key={evaluacion.id} md={4}>
            <Card className="evaluacion-card">
              <Card.Body>
                <Card.Title className="evaluacion-titulo">{evaluacion.titulo}</Card.Title>
                <Card.Text className="evaluacion-descripcion">{evaluacion.descripcion}</Card.Text>
                <div className="evaluacion-puntaje">{generarEstrellas(evaluacion.puntaje)}</div>
                <Button variant="primary" className="evaluacion-button">Ver Detalles</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Evaluaciones;
