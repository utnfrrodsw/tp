import { useEffect, useState } from 'react';
import { buscarServiciosPorCategoriaRequest } from '../services/servicioService';
import type { Servicio } from '../services/servicioService';
import { listCategoriasRequest } from '../../eventos/services/categoriaService';
import type { Categoria } from '../../eventos/services/categoriaService';
import ItemServicio from './ItemServicio';

// Pantalla para buscar servicios eligiendo una categoria
export default function BuscarPorCategoria({ token, onVolver }: { token: string; onVolver: () => void }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaElegida, setCategoriaElegida] = useState<Categoria | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [mensaje, setMensaje] = useState('');

  // Apenas entro a la pantalla traigo las categorias
  useEffect(() => {
    listCategoriasRequest(token)
      .then(setCategorias)
      .catch(() => setMensaje('No se pudieron cargar las categorias'));
  }, [token]);

  // Cuando toco una categoria busco los servicios que tiene
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

  return (
    <div className="caja-cliente">
      <h2 className="subtitulo-cliente">Buscar por categoria</h2>
      <button className="boton-volver-cliente" onClick={onVolver}>Volver</button>

      {mensaje !== '' && <p className="mensaje-error-cliente">{mensaje}</p>}
      {categorias.length === 0 && <p className="texto-ayuda-cliente">No hay categorias disponibles.</p>}

      {/* Lista de categorias para elegir */}
      <ul className="lista-cliente">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="item-lista-cliente">
            <span><b>{categoria.nombre}</b> - evento: {categoria.evento.nombre}</span>
            <span className="botones-item-cliente">
              <button onClick={() => elegirCategoria(categoria)}>Ver servicios</button>
            </span>
          </li>
        ))}
      </ul>

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
