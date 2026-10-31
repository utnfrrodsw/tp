import { useEffect, useState } from 'react';
import { listEventosRequest } from '../../eventos/services/eventoService';
import type { Evento } from '../../eventos/services/eventoService';
import {
  createTablero,
  deleteTablero,
  listTableros,
  removeServicio,
  updateTablero
} from '../services/tableroService';
import type { Tablero } from '../services/tableroService';

// Pantalla donde el cliente maneja sus tableros
export default function MisTableros({ token, onVolver }: { token: string; onVolver: () => void }) {
  const [tableros, setTableros] = useState<Tablero[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [tableroEditando, setTableroEditando] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [eventoId, setEventoId] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Traigo los tableros y los eventos apenas entro
  useEffect(() => {
    async function traerDatos() {
      try {
        const misTableros = await listTableros(token);
        const listaEventos = await listEventosRequest(token);

        setTableros(misTableros);
        setEventos(listaEventos.filter((evento) => !evento.draft));
      } catch {
        setMensaje('No se pudieron cargar los tableros');
      }
    }

    traerDatos();
  }, [token]);

  async function cargarTableros() {
    try {
      const datos = await listTableros(token);
      setTableros(datos);
    } catch {
      setMensaje('No se pudieron cargar los tableros');
    }
  }

  // El formulario sirve para crear y para editar, cambia el titulo nomas
  function abrirFormulario(tablero?: Tablero) {
    setTableroEditando(tablero ? tablero.id : null);
    setNombre(tablero ? tablero.nombre : '');
    setEventoId(tablero?.evento?.id ? String(tablero.evento.id) : '');
    setMensaje('');
    setFormVisible(true);
  }

  async function guardarTablero(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    if (eventoId === '' || nombre.trim() === '') return;

    try {
      if (tableroEditando !== null) {
        await updateTablero(token, tableroEditando, nombre, Number(eventoId));
      } else {
        await createTablero(token, nombre, Number(eventoId));
      }
      await cargarTableros();
      setFormVisible(false);
      setTableroEditando(null);
      setNombre('');
      setEventoId('');
    } catch {
      setMensaje('No se pudo guardar el tablero');
    }
  }

  async function borrarTablero(tablero: Tablero) {
    // Pregunto antes porque sino se borra de una
    if (!window.confirm('Seguro que queres borrar el tablero ' + tablero.nombre + '?')) return;

    try {
      await deleteTablero(token, tablero.id);
      await cargarTableros();
    } catch {
      setMensaje('No se pudo borrar el tablero');
    }
  }

  // Saca un servicio de adentro de un tablero
  async function quitarServicio(tableroId: number, servicioId: number) {
    try {
      await removeServicio(token, tableroId, servicioId);
      await cargarTableros();
    } catch {
      setMensaje('No se pudo quitar el servicio');
    }
  }

  return (
    <div className="caja-cliente">
      <h2 className="subtitulo-cliente">Mis tableros</h2>
      <button className="boton-volver-cliente" onClick={onVolver}>Volver</button>

      {mensaje !== '' && <p className="mensaje-error-cliente">{mensaje}</p>}

      {!formVisible && (
        <button className="boton-nuevo-cliente" onClick={() => abrirFormulario()}>Crear tablero</button>
      )}

      {formVisible && (
        <form className="formulario-cliente" onSubmit={guardarTablero}>
          <h3>{tableroEditando === null ? 'Nuevo tablero' : 'Editar tablero'}</h3>

          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            required
          />

          <label>Evento</label>
          <select value={eventoId} onChange={(e) => setEventoId(e.target.value)} required>
            <option value="">Elegi un evento</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>{evento.nombre}</option>
            ))}
          </select>

          {eventos.length === 0 && <p className="texto-ayuda-cliente">No hay eventos publicados.</p>}

          <div className="botones-formulario-cliente">
            <button type="submit" disabled={eventos.length === 0}>Guardar</button>
            <button type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {tableros.length === 0 && <p className="mensaje-error-cliente">Todavia no tenes tableros.</p>}

      {/* Recorro mis tableros y adentro de cada uno los servicios guardados */}
      {tableros.map((tablero) => (
        <div key={tablero.id} className="tablero-cliente">
          <div className="item-lista-cliente">
            <span>
              <b>{tablero.nombre}</b> - evento: {tablero.evento?.nombre ?? 'sin evento'}
            </span>
            <span className="botones-item-cliente">
              <button onClick={() => abrirFormulario(tablero)}>Editar</button>
              <button onClick={() => borrarTablero(tablero)}>Borrar</button>
            </span>
          </div>

          {tablero.servicios.length === 0 && (
            <p className="texto-ayuda-cliente">Todavia no guardaste servicios aca.</p>
          )}

          <ul className="lista-cliente lista-servicios-cliente">
            {tablero.servicios.map((servicio) => (
              <li key={servicio.id} className="item-lista-cliente card-servicio-cliente">
                <span className="detalle-item-cliente">
                  {servicio.imagen ? (
                    <img src={servicio.imagen} alt="" className="imagen-servicio-cliente" />
                  ) : null}
                  <span>{servicio.nombre} - {servicio.categoria.nombre}</span>
                </span>
                <span className="botones-item-cliente">
                  <button onClick={() => quitarServicio(tablero.id, servicio.id)}>Quitar</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
