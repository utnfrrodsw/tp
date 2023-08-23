import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Evaluaciones = () => {
  const evaluacionesData = [
    { id: 1, titulo: 'Evaluación 1', descripcion: 'Descripción de la evaluación 1' },
    { id: 2, titulo: 'Evaluación 2', descripcion: 'Descripción de la evaluación 2' },
    // ... Agrega más evaluaciones aquí
  ];

  return (
    <Container>
      <h2 className="mt-4">Evaluaciones</h2>
      <Row>
        {evaluacionesData.map(evaluacion => (
          <Col key={evaluacion.id} md={4}>
            <Card className="my-3">
              <Card.Body>
                <Card.Title>{evaluacion.titulo}</Card.Title>
                <Card.Text>{evaluacion.descripcion}</Card.Text>
                <Button variant="primary">Ver Detalles</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Evaluaciones;
