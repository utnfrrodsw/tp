import { useState } from 'react';
import type { Servicio } from '../services/servicioService';
import { addServicio, listTableros } from '../services/tableroService';
import type { Tablero } from '../services/tableroService';

// Esto es un servicio de la lista, lo hice aparte porque sino el dashboard quedaba muy largo
export default function ItemServicio({ servicio, token }: { servicio: Servicio; token: string }) {
  const [tableros, setTableros] = useState<Tablero[]>([]);
  const [mostrarTableros, setMostrarTableros] = useState(false);
  const [tableroElegido, setTableroElegido] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Muestro o escondo el select con mis tableros
  async function verTableros() {
    if (mostrarTableros) {
      setMostrarTableros(false);
      return;
    }

    setMensaje('');

    try {
      const datos = await listTableros(token);
      setTableros(datos);
      setMostrarTableros(true);
    } catch {
      setMensaje('No se pudieron cargar los tableros');
    }
  }

  // Guardo el servicio en el tablero que elegi
  async function guardarEnTablero() {
    if (tableroElegido === '') return;

    setMensaje('');

    try {
      await addServicio(token, Number(tableroElegido), servicio.id);
      setMensaje('Guardado en el tablero');
      setMostrarTableros(false);
      setTableroElegido('');
    } catch {
      setMensaje('No se pudo guardar el servicio');
    }
  }

  return (
    <li className="item-lista-cliente card-servicio-cliente">
      <span className="detalle-item-cliente">
        {servicio.imagen ? (
          <img src={servicio.imagen} alt="" className="imagen-servicio-cliente" />
        ) : null}
        <span>
        <b>{servicio.nombre}</b> - {servicio.categoria.nombre}
        <br />
        Empresa: {servicio.empresa.nombre}
        {servicio.empresa.zona ? ' (' + servicio.empresa.zona + ')' : ''}
        {servicio.empresa.telefono ? ' - Tel: ' + servicio.empresa.telefono : ''}
        {servicio.descripcion ? <><br />{servicio.descripcion}</> : null}

        {/* Si toque el boton muestro el select de tableros abajo */}
        {mostrarTableros && tableros.length > 0 && (
          <span className="guardar-tablero-cliente">
            <select value={tableroElegido} onChange={(e) => setTableroElegido(e.target.value)}>
              <option value="">Elegi un tablero</option>
              {tableros.map((tablero) => (
                <option key={tablero.id} value={tablero.id}>{tablero.nombre}</option>
              ))}
            </select>
            <button onClick={guardarEnTablero} disabled={tableroElegido === ''}>Guardar</button>
          </span>
        )}

        {mostrarTableros && tableros.length === 0 && (
          <span className="mensaje-error-cliente"> Todavia no tenes tableros, crea uno primero.</span>
        )}

        {mensaje !== '' && <span className="texto-ayuda-cliente"> {mensaje}</span>}
        </span>
      </span>

      <span className="botones-item-cliente">
        <button onClick={verTableros}>Agregar a tablero</button>
      </span>
    </li>
  );
}
