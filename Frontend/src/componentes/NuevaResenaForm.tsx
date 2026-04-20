// src/componentes/NuevaReseñaForm.tsx
import React, { useState } from 'react';
import { agregarReseña } from '../services/resenaService';
import { getAccessToken } from '../services/authService';

const NuevaReseñaForm = ({ libroId, onReseñaAgregada }: { libroId: number, onReseñaAgregada: () => void }) => {
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return alert('Debes iniciar sesión');

    try {
      await agregarReseña(libroId, comentario, estrellas, token);
      setComentario('');
      setEstrellas(5);
      onReseñaAgregada(); // recargar lista
    } catch (err) {
      alert('Error al enviar reseña');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Escribe tu reseña" required />
      <input type="number" value={estrellas} onChange={e => setEstrellas(Number(e.target.value))} min={1} max={5} required />
      <button type="submit">Agregar Reseña</button>
    </form>
  );
};

export default NuevaReseñaForm;
