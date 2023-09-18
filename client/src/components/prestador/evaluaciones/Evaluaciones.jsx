import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

  return (
    <section className='fondoEvaluation'>
      <Row>
        {evaluacionesData.map(evaluacion => (
          <Col key={evaluacion.id} md={4}>
            <Card className="evaluacion-card">
              <Card.Body>
                <Card.Title className="evaluacion-titulo">{evaluacion.titulo}</Card.Title>
                 
                <div className="evaluacion-puntaje">{generarEstrellas(evaluacion.puntaje)}</div>
                <Link to={`/evaluations/${evaluacion.id}`} className="evaluacion-button">Ver Detalles</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Evaluaciones;
