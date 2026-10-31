import { useEffect, useState } from 'react';
import { listEventosRequest } from '../../eventos/services/eventoService';
import type { Evento } from '../../eventos/services/eventoService';
import { listCategoriasRequest } from '../../eventos/services/categoriaService';
import type { Categoria } from '../../eventos/services/categoriaService';
import { buscarServiciosPorCategoriaRequest } from '../services/servicioService';
import type { Servicio } from '../services/servicioService';
import ItemServicio from './ItemServicio';

// Pantalla para buscar servicios eligiendo primero un evento y despues una categoria
export default function BuscarPorEvento({ token, onVolver }: { token: string; onVolver: () => void }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [eventoElegido, setEventoElegido] = useState<Evento | null>(null);
  const [categoriaElegida, setCategoriaElegida] = useState<Categoria | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [mensaje, setMensaje] = useState('');

  // Apenas entro traigo los eventos y las categorias juntos
  useEffect(() => {
    async function traerDatos() {
      try {
        const listaEventos = await listEventosRequest(token);
        const listaCategorias = await listCategoriasRequest(token);

        // Los borradores no los muestro porque todavia no estan publicados
        setEventos(listaEventos.filter((evento) => !evento.draft));
        setCategorias(listaCategorias);
      } catch {
        setMensaje('No se pudieron cargar los eventos');
      }
    }

    traerDatos();
  }, [token]);

  function elegirEvento(evento: Evento) {
    setEventoElegido(evento);
    // Limpio lo de antes asi no me quedan servicios del evento anterior
    setCategoriaElegida(null);
    setServicios([]);
    setMensaje('');
  }

  async function elegirCategoria(categoria: Categoria) {
    setCategoriaElegida(categoria);
    setServicios([]);
    setMensaje('');

    try {
      const datos = await buscarServiciosPorCategoriaRequest(categoria.id);
      setServicios(datos);
    } catch {
      setMensaje('No se pudieron buscar los servicios');
    }
  }

  // Me quedo solo con las categorias del evento que elegi
  const categoriasDelEvento = eventoElegido
    ? categorias.filter((categoria) => categoria.evento.id === eventoElegido.id)
    : [];

  return (
    <div className="caja-cliente">
      <h2 className="subtitulo-cliente">Buscar por evento</h2>
      <button className="boton-volver-cliente" onClick={onVolver}>Volver</button>

      {mensaje !== '' && <p className="mensaje-error-cliente">{mensaje}</p>}
      {eventos.length === 0 && <p className="texto-ayuda-cliente">No hay eventos disponibles.</p>}

      {/* Lista de eventos */}
      <ul className="lista-cliente">
        {eventos.map((evento) => (
          <li key={evento.id} className="item-lista-cliente">
            <span><b>{evento.nombre}</b></span>
            <span className="botones-item-cliente">
              <button onClick={() => elegirEvento(evento)}>Ver categorias</button>
            </span>
          </li>
        ))}
      </ul>

      {/* Categorias del evento que elegi */}
      {eventoElegido !== null && (
        <div>
          <h3>Categorias de {eventoElegido.nombre}</h3>

          {categoriasDelEvento.length === 0 && (
            <p className="texto-ayuda-cliente">Este evento no tiene categorias.</p>
          )}

          <ul className="lista-cliente">
            {categoriasDelEvento.map((categoria) => (
              <li key={categoria.id} className="item-lista-cliente">
                <span><b>{categoria.nombre}</b></span>
                <span className="botones-item-cliente">
                  <button onClick={() => elegirCategoria(categoria)}>Ver servicios</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Servicios de la categoria que elegi */}
      {categoriaElegida !== null && (
        <div>
          <h3>Servicios de {categoriaElegida.nombre}</h3>

          {servicios.length === 0 && <p className="texto-ayuda-cliente">No hay servicios en esta categoria.</p>}

          <ul className="lista-cliente lista-servicios-cliente">
            {servicios.map((servicio) => (
              <ItemServicio key={servicio.id} servicio={servicio} token={token} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
