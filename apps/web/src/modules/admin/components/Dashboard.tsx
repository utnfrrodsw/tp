import { useState } from 'react';
import './Dashboard.scss';
import {
  listEventosRequest,
  createEventoRequest,
  updateEventoRequest,
  deleteEventoRequest
} from '../../eventos/services/eventoService';
import type { Evento } from '../../eventos/services/eventoService';
import {
  listCategoriasRequest,
  createCategoriaRequest,
  updateCategoriaRequest,
  deleteCategoriaRequest
} from '../../eventos/services/categoriaService';
import type { Categoria } from '../../eventos/services/categoriaService';
import { listUsuariosRequest, setUsuarioActivoRequest } from '../services/usuarioService';
import type { Usuario } from '../services/usuarioService';
import {
  listServiciosRevisionRequest,
  aprobarServicioRequest,
  denegarServicioRequest
} from '../services/servicioAdminService';
import type { ServicioRevision } from '../services/servicioAdminService';
import { formatearTitulo } from '../../../shared/formatters';

// Props que me manda App.tsx (el token para la API y la funcion de salir)
interface AdminDashboardProps {
  token: string;
  onLogout?: () => void;
}

// Objetos vacios para resetear los formularios
const eventoVacio = { nombre: '', descripcion: '', imagen: '', draft: true };
const categoriaVacia = { nombre: '', descripcion: '', eventoId: 0 };

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  // Esta variable dice que seccion se esta mostrando abajo de los botones
  const [seccion, setSeccion] = useState<'eventos' | 'categorias' | 'cuentas' | 'servicios' | null>(null);

  // --- EVENTOS ---
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [formEventoVisible, setFormEventoVisible] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [formEvento, setFormEvento] = useState(eventoVacio);

  // --- CATEGORIAS ---
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formCategoriaVisible, setFormCategoriaVisible] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [formCategoria, setFormCategoria] = useState(categoriaVacia);

  // --- EMPRESAS ---
  const [cuentas, setCuentas] = useState<Usuario[]>([]);

  // --- SERVICIOS EN REVISION ---
  const [serviciosRevision, setServiciosRevision] = useState<ServicioRevision[]>([]);

  // Uso un solo mensaje de error para todo asi no me complico
  const [mensaje, setMensaje] = useState('');

  // Traigo los eventos de la base de datos
  async function cargarEventos() {
    try {
      const datos = await listEventosRequest(token);
      setEventos(datos);
    } catch {
      setMensaje('No se pudieron cargar los eventos');
    }
  }

  async function cargarCategorias() {
    try {
      const datos = await listCategoriasRequest(token);
      setCategorias(datos);
    } catch {
      setMensaje('No se pudieron cargar las categorias');
    }
  }

  async function cargarCuentas() {
    try {
      const [empresas, clientes] = await Promise.all([
        listUsuariosRequest('empresa', token),
        listUsuariosRequest('cliente', token)
      ]);
      setCuentas([...empresas, ...clientes]);
    } catch {
      setMensaje('No se pudieron cargar las cuentas');
    }
  }

  async function cargarServiciosRevision() {
    try {
      const datos = await listServiciosRevisionRequest(token);
      setServiciosRevision(datos);
    } catch {
      setMensaje('No se pudieron cargar los servicios en revision');
    }
  }

  // Cuando toco un boton del menu muestro la seccion y traigo los datos
  function mostrarEventos() {
    setMensaje('');
    setSeccion('eventos');
    setFormEventoVisible(false);
    cargarEventos();
  }

  function mostrarCategorias() {
    setMensaje('');
    setSeccion('categorias');
    setFormCategoriaVisible(false);
    cargarCategorias();
    cargarEventos(); // los necesito para el select del formulario
  }

  function mostrarCuentas() {
    setMensaje('');
    setSeccion('cuentas');
    cargarCuentas();
  }

  function mostrarServicios() {
    setMensaje('');
    setSeccion('servicios');
    cargarServiciosRevision();
  }

  // Guarda un evento nuevo o edita el que estoy tocando
  async function guardarEvento(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    const datos = { ...formEvento, nombre: formatearTitulo(formEvento.nombre) };

    try {
      if (eventoEditando) {
        await updateEventoRequest(eventoEditando.id, datos, token);
      } else {
        await createEventoRequest(datos, token);
      }
      await cargarEventos();
      setFormEventoVisible(false);
      setEventoEditando(null);
      setFormEvento(eventoVacio);
    } catch {
      setMensaje('No se pudo guardar el evento');
    }
  }

  async function borrarEvento(evento: Evento) {
    // Pregunto antes porque sino se borra de una
    if (!window.confirm('Seguro que queres borrar el evento ' + evento.nombre + '?')) return;

    try {
      await deleteEventoRequest(evento.id, token);
      await cargarEventos();
    } catch {
      setMensaje('No se pudo borrar el evento');
    }
  }

  async function guardarCategoria(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    if (!formCategoria.eventoId) {
      setMensaje('Tenes que elegir un evento');
      return;
    }

    try {
      if (categoriaEditando) {
        await updateCategoriaRequest(categoriaEditando.id, formCategoria, token);
      } else {
        await createCategoriaRequest(formCategoria, token);
      }
      await cargarCategorias();
      setFormCategoriaVisible(false);
      setCategoriaEditando(null);
      setFormCategoria(categoriaVacia);
    } catch {
      setMensaje('No se pudo guardar la categoria');
    }
  }

  async function borrarCategoria(categoria: Categoria) {
    if (!window.confirm('Seguro que queres borrar la categoria ' + categoria.nombre + '?')) return;

    try {
      await deleteCategoriaRequest(categoria.id, token);
      await cargarCategorias();
    } catch {
      setMensaje('No se pudo borrar la categoria');
    }
  }

  // Si la cuenta esta activa la suspendo y si esta suspendida la activo
  async function cambiarEstadoCuenta(cuenta: Usuario) {
    if (!window.confirm('Queres cambiar el estado de la cuenta ' + cuenta.nombre + '?')) return;

    const activoNuevo = !cuenta.activo;
    setMensaje('');
    setCuentas((actuales) => actuales.map((item) => (
      item.id === cuenta.id ? { ...item, activo: activoNuevo } : item
    )));

    try {
      await setUsuarioActivoRequest(cuenta.id, activoNuevo, token);
    } catch {
      setCuentas((actuales) => actuales.map((item) => (
        item.id === cuenta.id ? { ...item, activo: cuenta.activo } : item
      )));
      setMensaje('No se pudo cambiar el estado de la cuenta');
    }
  }

  // Aprueba el servicio: pasa a publicado y ya se puede ver en las busquedas
  async function aprobarServicio(servicio: ServicioRevision) {
    if (!window.confirm('Seguro que queres aprobar y publicar el servicio ' + servicio.nombre + '?')) return;

    try {
      await aprobarServicioRequest(servicio.id, token);
      await cargarServiciosRevision();
    } catch {
      setMensaje('No se pudo aprobar el servicio');
    }
  }

  // Deniega el servicio: se borra de una, la empresa lo tiene que volver a cargar
  async function denegarServicio(servicio: ServicioRevision) {
    if (!window.confirm('Seguro que queres denegar el servicio ' + servicio.nombre + '? Se va a borrar.')) return;

    try {
      await denegarServicioRequest(servicio.id, token);
      await cargarServiciosRevision();
    } catch {
      setMensaje('No se pudo denegar el servicio');
    }
  }

  return (
    <div className="pagina-admin">
      {/* Barra de arriba con el nombre de la pagina y el boton de salir */}
      <div className="barra-superior">
        <h1 className="titulo-pagina">PlanIt - Administrador</h1>
        <button className="boton-salir" onClick={() => onLogout?.()}>Cerrar sesion</button>
      </div>

      <div className="contenido">
        <h2 className="bienvenida">Bienvenido al panel de administracion</h2>

        {/* Menu con los 4 botones principales */}
        <div className="menu">
          <button className="boton-menu" onClick={mostrarEventos}>Eventos</button>
          <button className="boton-menu" onClick={mostrarCategorias}>Categorias</button>
          <button className="boton-menu" onClick={mostrarCuentas}>Cuentas</button>
          <button className="boton-menu" onClick={mostrarServicios}>Servicios en revision</button>
        </div>

        {/* Si hubo algun error lo muestro aca */}
        {mensaje !== '' && <p className="mensaje-error">{mensaje}</p>}

        {/* Si todavia no toque ningun boton muestro un texto */}
        {seccion === null && <p className="texto-ayuda">Elegi una opcion del menu para empezar.</p>}

        {/* SECCION DE EVENTOS */}
        {seccion === 'eventos' && (
          <div className="caja">
            <h2 className="subtitulo">Lista de eventos</h2>

            {!formEventoVisible && (
              <button
                className="boton-nuevo"
                onClick={() => {
                  setEventoEditando(null);
                  setFormEvento(eventoVacio);
                  setFormEventoVisible(true);
                }}
              >
                Agregar evento
              </button>
            )}

            {/* El formulario sirve para crear y para editar, cambia el titulo nomas */}
            {formEventoVisible && (
              <form className="formulario" onSubmit={guardarEvento}>
                <h3>{eventoEditando ? 'Editar evento' : 'Nuevo evento'}</h3>

                <label>Nombre</label>
                <input
                  type="text"
                  value={formEvento.nombre}
                  onChange={(e) => setFormEvento({ ...formEvento, nombre: e.target.value })}
                  required
                />

                <label>Descripcion</label>
                <textarea
                  value={formEvento.descripcion}
                  onChange={(e) => setFormEvento({ ...formEvento, descripcion: e.target.value })}
                />

                <label>Imagen (URL)</label>
                <input
                  type="text"
                  value={formEvento.imagen}
                  onChange={(e) => setFormEvento({ ...formEvento, imagen: e.target.value })}
                />

                <label className="label-check">
                  <input
                    type="checkbox"
                    checked={formEvento.draft}
                    onChange={(e) => setFormEvento({ ...formEvento, draft: e.target.checked })}
                  />
                  Guardar como borrador
                </label>

                <div className="botones-formulario">
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={() => setFormEventoVisible(false)}>Cancelar</button>
                </div>
              </form>
            )}

            {eventos.length === 0 && <p className="texto-ayuda">Todavia no hay eventos.</p>}

            {/* Recorro el array de eventos con map para mostrarlos */}
            <ul className="lista">
              {eventos.map((evento) => (
                <li key={evento.id} className="item-lista">
                  <span>
                    <b>{evento.nombre}</b> ({evento.draft ? 'borrador' : 'publicado'})
                  </span>
                  <span className="botones-item">
                    <button
                      onClick={() => {
                        setEventoEditando(evento);
                        setFormEvento({
                          nombre: evento.nombre,
                          descripcion: evento.descripcion ?? '',
                          imagen: evento.imagen ?? '',
                          draft: evento.draft
                        });
                        setFormEventoVisible(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => borrarEvento(evento)}>Borrar</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECCION DE CATEGORIAS */}
        {seccion === 'categorias' && (
          <div className="caja">
            <h2 className="subtitulo">Lista de categorias</h2>

            {!formCategoriaVisible && (
              <button
                className="boton-nuevo"
                onClick={() => {
                  setCategoriaEditando(null);
                  // Si hay eventos pongo el primero por defecto
                  setFormCategoria({ ...categoriaVacia, eventoId: eventos[0]?.id ?? 0 });
                  setFormCategoriaVisible(true);
                }}
                disabled={eventos.length === 0}
              >
                Agregar categoria
              </button>
            )}

            {formCategoriaVisible && (
              <form className="formulario" onSubmit={guardarCategoria}>
                <h3>{categoriaEditando ? 'Editar categoria' : 'Nueva categoria'}</h3>

                <label>Nombre</label>
                <input
                  type="text"
                  value={formCategoria.nombre}
                  onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
                  required
                />

                <label>Descripcion</label>
                <textarea
                  value={formCategoria.descripcion}
                  onChange={(e) => setFormCategoria({ ...formCategoria, descripcion: e.target.value })}
                />

                <label>Evento</label>
                <select
                  value={formCategoria.eventoId}
                  onChange={(e) => setFormCategoria({ ...formCategoria, eventoId: Number(e.target.value) })}
                  required
                >
                  <option value={0} disabled>Elegi un evento</option>
                  {eventos.map((evento) => (
                    <option key={evento.id} value={evento.id}>{evento.nombre}</option>
                  ))}
                </select>

                <div className="botones-formulario">
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={() => setFormCategoriaVisible(false)}>Cancelar</button>
                </div>
              </form>
            )}

            {eventos.length === 0 && <p className="texto-ayuda">Primero crea un evento.</p>}
            {eventos.length > 0 && categorias.length === 0 && <p className="texto-ayuda">Todavia no hay categorias.</p>}

            <ul className="lista">
              {categorias.map((categoria) => (
                <li key={categoria.id} className="item-lista">
                  <span>
                    <b>{categoria.nombre}</b> - evento: {categoria.evento.nombre}
                  </span>
                  <span className="botones-item">
                    <button
                      onClick={() => {
                        setCategoriaEditando(categoria);
                        setFormCategoria({
                          nombre: categoria.nombre,
                          descripcion: categoria.descripcion ?? '',
                          eventoId: categoria.evento.id
                        });
                        setFormCategoriaVisible(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => borrarCategoria(categoria)}>Borrar</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECCION DE CUENTAS: empresas y clientes */}
        {seccion === 'cuentas' && (
          <div className="caja">
            <h2 className="subtitulo">Empresas y clientes</h2>

            {cuentas.length === 0 && <p className="texto-ayuda">No hay cuentas registradas.</p>}

            <ul className="lista">
              {cuentas.map((cuenta) => (
                <li key={cuenta.id} className="item-lista">
                  <span>
                    <b>{cuenta.nombre}</b> - {cuenta.rol === 'empresa' ? 'Empresa' : 'Cliente'} - {cuenta.email} ({cuenta.activo ? 'activa' : 'suspendida'})
                  </span>
                  <span className="botones-item">
                    <button onClick={() => cambiarEstadoCuenta(cuenta)}>
                      {cuenta.activo ? 'Suspender' : 'Activar'}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECCION DE SERVICIOS EN REVISION */}
        {seccion === 'servicios' && (
          <div className="caja">
            <h2 className="subtitulo">Servicios esperando aprobacion</h2>

            {serviciosRevision.length === 0 && (
              <p className="texto-ayuda">No hay servicios en revision por el momento.</p>
            )}

            <ul className="lista lista-servicios">
              {serviciosRevision.map((servicio) => (
                <li key={servicio.id} className="item-lista card-servicio">
                  <span className="detalle-item">
                    {servicio.imagen ? (
                      <img src={servicio.imagen} alt="" className="imagen-servicio" />
                    ) : null}
                    <span>
                      <b>{servicio.nombre}</b> - categoria: {servicio.categoria.nombre} - empresa: {servicio.empresa.nombre}
                    </span>
                  </span>
                  <span className="botones-item">
                    <button onClick={() => aprobarServicio(servicio)}>Aprobar</button>
                    <button onClick={() => denegarServicio(servicio)}>Denegar</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
