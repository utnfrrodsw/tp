import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetalleEvaluacion.css';

const DetallesEvaluacion = () => {
  // Obtenemos el parámetro de la URL que corresponde al ID de la evaluación
  const { id } = useParams();

  // Supongamos que tienes un array de evaluaciones con sus detalles
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

  // Buscamos la evaluación correspondiente al ID proporcionado
  const evaluacion = evaluacionesData.find(e => e.id === parseInt(id));

  if (!evaluacion) {
    return <div>Evaluación no encontrada</div>;
  }

  return (
    <section>
    <div className="detalle-evaluacion">
      <h2>{evaluacion.titulo}</h2>
      <p>{evaluacion.descripcion}</p>
      <p>Puntaje: {evaluacion.puntaje}</p>
      {/* Aquí puedes mostrar otros detalles de la evaluación */}
      
    </div>
    <div>
       <button> <Link to="/evaluations">Evaluaciones</Link> {/* Agrega el enlace */}</button>
       <button><Link to="/provider/home">Inicio</Link> {/* Agrega el enlace */}</button>
    </div>
    </section>
  );
};

export default DetallesEvaluacion;
