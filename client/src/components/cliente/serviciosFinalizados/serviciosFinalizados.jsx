import React from 'react';
import './ServiciosFinalizados.css';

const HistorialServiciosCliente = () => {
  // Supongamos que tienes un arreglo de servicios finalizados para el cliente
  const serviciosFinalizados = [
    {
      id: 1,
      nombrePrestador: 'Prestador 1',
      nombreServicio: 'Servicio 1',
      fecha: '10 de agosto de 2023',
      descripcion: 'Descripción detallada del servicio 1. Este servicio incluyó múltiples tareas y se completó de manera satisfactoria.',
      costo: '$100',
      calificacion: 4.5,
    },
    {
      id: 2,
      nombrePrestador: 'Prestador 2',
      nombreServicio: 'Servicio 2',
      fecha: '15 de septiembre de 2023',
      descripcion: 'Descripción detallada del servicio 2. El cliente quedó muy satisfecho con el resultado.',
      costo: '$75',
      calificacion: 5.0,
    },
    {
      id: 3,
      nombrePrestador: 'Prestador 3',
      nombreServicio: 'Servicio 3',
      fecha: '20 de octubre de 2023',
      descripcion: 'Descripción detallada del servicio 3. Se realizaron varias etapas y se entregaron los resultados a tiempo.',
      costo: '$120',
      calificacion: 4.8,
    },
    // Agrega más servicios finalizados aquí
  ];

  return (
    <section className='fondoHistorialServicio'>
    <div className="historial-servicios-cliente-container">
      <h2>Servicios finalizados</h2>
      <div className="servicios-lista">
        {serviciosFinalizados.map((servicio) => (
          <div key={servicio.id} className="servicio-item">
            <h3>Servicio: {servicio.nombreServicio}</h3>
            <p>Prestador: {servicio.nombrePrestador}</p>
            <p>Fecha: {servicio.fecha}</p>
            <p>Descripción: {servicio.descripcion}</p>
            <p>Costo: {servicio.costo}</p>
            <p>Calificación: {servicio.calificacion}</p>
            {/* Agrega más detalles sobre el servicio si es necesario */}
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default HistorialServiciosCliente;
