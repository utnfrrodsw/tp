import { useState } from 'react';
import './Dashboard.scss';
import { buscarServiciosRequest } from '../services/servicioService';
import type { Servicio } from '../services/servicioService';
import ItemServicio from './ItemServicio';
import BuscarPorEvento from './BuscarPorEvento';
import BuscarPorCategoria from './BuscarPorCategoria';
import MisTableros from './MisTableros';

// Props que me manda App.tsx (el nombre del cliente, el token y la funcion de salir)
interface ClienteDashboardProps {
  nombreUsuario: string;
  token: string;
  onLogout?: () => void;
}

export default function DashboardCliente({ nombreUsuario, token, onLogout }: ClienteDashboardProps) {
  // Esta variable dice que pantalla se esta mostrando
  const [seccion, setSeccion] = useState<'buscar' | 'eventos' | 'categorias' | 'tableros' | null>(null);

  // --- BUSCADOR ---
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [zonaBusqueda, setZonaBusqueda] = useState('');
  const [empresaBusqueda, setEmpresaBusqueda] = useState('');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

  // Uso un solo mensaje de error para todo asi no me complico
  const [mensaje, setMensaje] = useState('');

  // Busca los servicios con lo que escribi en los 3 campos
  async function buscarServicios(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    // Si no escribi nada en ningun campo no busco
    if (textoBusqueda.trim() === '' && zonaBusqueda.trim() === '' && empresaBusqueda.trim() === '') {
      return;
    }

    setBusquedaHecha(true);

    try {
      const datos = await buscarServiciosRequest(textoBusqueda.trim(), zonaBusqueda, empresaBusqueda);
      setServicios(datos);
    } catch {
      setServicios([]);
      setMensaje('No se pudieron buscar los servicios');
    }
  }

  function mostrarSeccion(nueva: 'buscar' | 'eventos' | 'categorias' | 'tableros') {
    setMensaje('');
    setSeccion(nueva);
  }

  return (
    <div className="pagina-cliente">
      {/* Barra de arriba con el nombre de la pagina y el boton de salir */}
      <div className="barra-superior-cliente">
        <h1 className="titulo-pagina-cliente">PlanIt - Cliente</h1>
        <button className="boton-salir-cliente" onClick={() => onLogout?.()}>Cerrar sesion</button>
      </div>

      <div className="contenido-cliente">
        <h2 className="bienvenida-cliente">Bienvenido a planit,  {nombreUsuario}</h2>

        {/* Menu con los 4 botones principales */}
        <div className="menu-cliente">
          <button className="boton-menu-cliente" onClick={() => mostrarSeccion('buscar')}>Buscar servicio</button>
          <button className="boton-menu-cliente" onClick={() => mostrarSeccion('eventos')}>Eventos</button>
          <button className="boton-menu-cliente" onClick={() => mostrarSeccion('categorias')}>Categorias</button>
          <button className="boton-menu-cliente" onClick={() => mostrarSeccion('tableros')}>Mis tableros</button>
        </div>

        {/* Si hubo algun error lo muestro aca */}
        {mensaje !== '' && <p className="mensaje-error-cliente">{mensaje}</p>}

        {/* Si todavia no toque ningun boton muestro un texto */}
        {seccion === null && <p className="texto-ayuda-cliente">Elegi una opcion del menu para empezar.</p>}

        {/* SECCION DEL BUSCADOR */}
        {seccion === 'buscar' && (
          <div className="caja-cliente">
            <h2 className="subtitulo-cliente">Buscar un servicio</h2>

            <form className="formulario-cliente" onSubmit={buscarServicios}>
              <label>Nombre del servicio</label>
              <input
                type="text"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                placeholder="Por ejemplo: catering"
              />

              <label>Zona de la empresa</label>
              <input
                type="text"
                value={zonaBusqueda}
                onChange={(e) => setZonaBusqueda(e.target.value)}
                placeholder="Cualquier zona"
              />

              <label>Nombre de la empresa</label>
              <input
                type="text"
                value={empresaBusqueda}
                onChange={(e) => setEmpresaBusqueda(e.target.value)}
                placeholder="Cualquier empresa"
              />

              <div className="botones-formulario-cliente">
                <button type="submit">Buscar</button>
              </div>
            </form>

            {/* Si ya busque y no encontre nada aviso */}
            {busquedaHecha && servicios.length === 0 && (
              <p className="texto-ayuda-cliente">No se encontraron servicios.</p>
            )}

            {/* Recorro los servicios con map para mostrarlos */}
            <ul className="lista-cliente lista-servicios-cliente">
              {servicios.map((servicio) => (
                <ItemServicio key={servicio.id} servicio={servicio} token={token} />
              ))}
            </ul>
          </div>
        )}

        {/* Las otras pantallas las hice en archivos aparte */}
        {seccion === 'eventos' && <BuscarPorEvento token={token} onVolver={() => setSeccion(null)} />}
        {seccion === 'categorias' && <BuscarPorCategoria token={token} onVolver={() => setSeccion(null)} />}
        {seccion === 'tableros' && <MisTableros token={token} onVolver={() => setSeccion(null)} />}
      </div>
    </div>
  );
}
