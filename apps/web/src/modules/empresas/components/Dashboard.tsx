import { useEffect, useState } from 'react';
import './Dashboard.scss';
import {
  listServiciosRequest,
  createServicioRequest,
  updateServicioRequest,
  deleteServicioRequest,
  subirImagenServicioRequest,
  crearCheckoutPlanProRequest,
  confirmarPlanProRequest,
  getUsuarioPlanRequest
} from '../services/servicioService';
import type { Servicio } from '../services/servicioService';
import { listCategoriasRequest } from '../../eventos/services/categoriaService';
import type { Categoria } from '../../eventos/services/categoriaService';
import { formatearTitulo } from '../../../shared/formatters';

// Props que me manda App.tsx (el id de la empresa, el token y la funcion de salir)
interface DashboardProps {
  onLogout?: () => void;
  usuarioId?: number;
  token: string;
}

// Con el plan gratis la empresa puede tener como mucho esta cantidad de servicios cargados
const LIMITE_SERVICIOS_PLAN_GRATIS = 3;

// Objeto vacio para resetear el formulario
const servicioVacio: { nombre: string; descripcion: string; imagen: string; categoriaId: number; estado: 'borrador' | 'revision' } = {
  nombre: '', descripcion: '', imagen: '', categoriaId: 0, estado: 'borrador'
};

// Traduce el estado del servicio a un texto para mostrar en la lista
function textoEstadoServicio(estado: Servicio['estado']): string {
  if (estado === 'borrador') {
    return 'borrador';
  } else if (estado === 'revision') {
    return 'en revision, esperando al administrador';
  } else {
    return 'publicado';
  }
}

export default function Dashboard({ onLogout, usuarioId, token }: DashboardProps) {
  // Esta variable dice si se esta mostrando la lista de servicios
  const [seccion, setSeccion] = useState<'servicios' | null>(null);

  // --- SERVICIOS ---
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formServicioVisible, setFormServicioVisible] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(null);
  const [formServicio, setFormServicio] = useState(servicioVacio);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  // --- PLAN PRO ---
  const [plan, setPlan] = useState<'gratis' | 'pro'>('gratis');
  const [creandoPagoPro, setCreandoPagoPro] = useState(false);
  const [mensajePago, setMensajePago] = useState<{
    tipo: 'exito' | 'error';
    mensaje: string;
  } | null>(null);

  // Las categorias las crea el admin, yo solo las uso para el select
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Uso un solo mensaje de error para todo asi no me complico
  const [mensaje, setMensaje] = useState('');


  // Traigo los servicios de la empresa de la base de datos
  async function cargarServicios() {
    if (!usuarioId) return;

    try {
      const datos = await listServiciosRequest(usuarioId, token);
      setServicios(datos);
    } catch {
      setMensaje('No se pudieron cargar los servicios');
    }
  }

  async function cargarCategorias() {
    try {
      const datos = await listCategoriasRequest(token);
      setCategorias(datos);
    } catch {
      setCategorias([]);
    }
  }

  // Traigo el plan actual de la empresa (gratis o pro)
  async function cargarPlan() {
    if (!usuarioId) return;

    try {
      const planDelUsuario = await getUsuarioPlanRequest(usuarioId, token);
      setPlan(planDelUsuario);
    } catch {
      // Si no lo puedo traer lo dejo en gratis, no es grave
      setPlan('gratis');
    }
  }

  // Cuando toco el boton del menu muestro la seccion y traigo los datos
  function mostrarServicios() {
    setMensaje('');
    setSeccion('servicios');
    setFormServicioVisible(false);
    cargarServicios();
    cargarCategorias();
    cargarPlan();
  }

  // Al entrar al dashboard traigo el plan para saber si ya es Pro
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cargarPlan hace un fetch y recien ahi actualiza el estado
    cargarPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  // Mercado Pago nos redirige de vuelta aca con parametros en la url
  // (por ejemplo ?pago=pro&status=approved&payment_id=123). Los leo una
  // sola vez cuando se carga la pagina y confirmo el pago si corresponde.
  useEffect(() => {
    if (!usuarioId) return;

    const parametros = new URLSearchParams(window.location.search);
    const pago = parametros.get('pago');

    if (pago !== 'pro') return;

    const paymentId = parametros.get('payment_id');
    const status = parametros.get('status');

    // Saco los parametros de la url para que si recargo la pagina no se vuelva a procesar
    window.history.replaceState({}, '', window.location.pathname);

    if (status !== 'approved' || !paymentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- es el resultado de leer la url al entrar, no un render en loop
      setMensajePago({
        tipo: 'error',
        mensaje: 'El pago no se aprobo. Si fue un error, podes intentar pasar a Pro de nuevo.'
      });
      return;
    }

    confirmarPlanProRequest(usuarioId, paymentId, token)
      .then(() => {
        setPlan('pro');
        setMensajePago({
          tipo: 'exito',
          mensaje: 'Listo! Tu cuenta ahora es Pro, ya podes subir todos los servicios que quieras.'
        });
      })
      .catch(() => {
        setMensajePago({
          tipo: 'error',
          mensaje: 'Mercado Pago aprobo el pago pero no pudimos confirmarlo en el servidor.'
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  // Subo la imagen al servidor y me guardo la url que me devuelve
  async function seleccionarImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo || !usuarioId) return;

    setSubiendoImagen(true);
    setMensaje('');

    try {
      const url = await subirImagenServicioRequest(usuarioId, archivo);
      setFormServicio((actual) => ({ ...actual, imagen: url }));
    } catch {
      setMensaje('No se pudo subir la imagen');
    } finally {
      setSubiendoImagen(false);
      e.target.value = '';
    }
  }

  // Guarda un servicio nuevo o edita el que estoy tocando
  async function guardarServicio(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    if (!usuarioId) return;

    if (!formServicio.categoriaId) {
      setMensaje('Tenes que elegir una categoria');
      return;
    }

    // Si estoy creando un servicio nuevo (no editando) y ya llegue al limite del plan
    // gratis, no dejo guardar. El boton ya deberia estar deshabilitado, pero controlo
    // de nuevo aca por las dudas.
    if (!servicioEditando && plan === 'gratis' && servicios.length >= LIMITE_SERVICIOS_PLAN_GRATIS) {
      setMensaje('Llegaste al limite de ' + LIMITE_SERVICIOS_PLAN_GRATIS + ' servicios del plan gratis. Pasate a Pro para seguir subiendo.');
      return;
    }

    const datos = { ...formServicio, nombre: formatearTitulo(formServicio.nombre) };

    try {
      if (servicioEditando) {
        await updateServicioRequest(servicioEditando.id, usuarioId, datos, token);
      } else {
        await createServicioRequest(usuarioId, datos, token);
      }
      await cargarServicios();
      setFormServicioVisible(false);
      setServicioEditando(null);
      setFormServicio(servicioVacio);
    } catch {
      setMensaje('No se pudo guardar el servicio');
    }
  }

  // Crea el pago del plan Pro en Mercado Pago y manda a la empresa al checkout
  async function manejarPasarAPro() {
    if (!usuarioId) return;

    setCreandoPagoPro(true);
    setMensajePago(null);
    try {
      const checkout = await crearCheckoutPlanProRequest(usuarioId, token);
      // En desarrollo usamos el sandbox, en produccion se deberia usar initPoint
      const urlDePago = checkout.sandboxInitPoint ?? checkout.initPoint;
      window.location.assign(urlDePago);
    } catch (error) {
      setMensajePago({
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'No se pudo iniciar el pago del plan Pro.'
      });
    } finally {
      setCreandoPagoPro(false);
    }
  }

  async function borrarServicio(servicio: Servicio) {
    if (!usuarioId) return;

    // Pregunto antes porque sino se borra de una
    if (!window.confirm('Seguro que queres borrar el servicio ' + servicio.nombre + '?')) return;

    try {
      await deleteServicioRequest(servicio.id, usuarioId, token);
      await cargarServicios();
    } catch {
      setMensaje('No se pudo borrar el servicio');
    }
  }

  // Si tiene el plan gratis y ya llego al limite, no puede cargar mas servicios
  const llegoAlLimiteDelPlanGratis = plan === 'gratis' && servicios.length >= LIMITE_SERVICIOS_PLAN_GRATIS;

  return (
    <div className="pagina-empresa">
      {/* Barra de arriba con el nombre de la pagina y el boton de salir */}
      <div className="barra-superior-empresa">
        <h1 className="titulo-pagina-empresa">PlanIt - Empresa</h1>
        <button className="boton-salir-empresa" onClick={() => onLogout?.()}>Cerrar sesion</button>
      </div>

      <div className="contenido-empresa">
        <h2 className="bienvenida-empresa">Bienvenido a Planit, empresa</h2>

        {/* Resultado del pago de Mercado Pago: va afuera del menu para que se vea al volver */}
        {mensajePago && (
          <div
            role={mensajePago.tipo === 'error' ? 'alert' : 'status'}
            className={
              mensajePago.tipo === 'exito'
                ? 'alerta-pago-empresa alerta-pago-exito'
                : 'alerta-pago-empresa alerta-pago-error'
            }
          >
            <p className="alerta-pago-titulo">
              {mensajePago.tipo === 'exito' ? 'Pago registrado' : 'Pago no registrado'}
            </p>
            <p className="alerta-pago-texto">{mensajePago.mensaje}</p>
          </div>
        )}

        {/* Menu (por ahora la empresa solo puede manejar sus servicios) */}
        <div className="menu-empresa">
          <button className="boton-menu-empresa" onClick={mostrarServicios}>Servicios</button>
        </div>

        {/* Si hubo algun error lo muestro aca */}
        {mensaje !== '' && <p className="mensaje-error-empresa">{mensaje}</p>}

        {/* Si todavia no toque el boton muestro un texto */}
        {seccion === null && <p className="texto-ayuda-empresa">Elegi una opcion del menu para empezar.</p>}

        {/* SECCION DE SERVICIOS */}
        {seccion === 'servicios' && (
          <div className="caja-empresa">
            <h2 className="subtitulo-empresa">Lista de servicios</h2>

            {/* Si ya es plan Pro se lo digo, si no le muestro cuantos le quedan */}
            {plan === 'pro' ? (
              <p className="texto-ayuda-empresa">Tenes el plan Pro: podes cargar todos los servicios que quieras.</p>
            ) : (
              <p className="texto-ayuda-empresa">
                Plan gratis: llevas {servicios.length} de {LIMITE_SERVICIOS_PLAN_GRATIS} servicios.
              </p>
            )}

            {!formServicioVisible && (
              <div className="acciones-servicios-empresa">
                <button
                  className="boton-nuevo-empresa"
                  onClick={() => {
                    setServicioEditando(null);
                    // Si hay categorias pongo la primera por defecto
                    setFormServicio({ ...servicioVacio, categoriaId: categorias[0]?.id ?? 0 });
                    setFormServicioVisible(true);
                  }}
                  disabled={categorias.length === 0 || llegoAlLimiteDelPlanGratis}
                >
                  Agregar servicio
                </button>

                {/* Si llego al limite del plan gratis le muestro el boton para pasar a Pro */}
                {llegoAlLimiteDelPlanGratis && (
                  <button
                    className="boton-nuevo-empresa"
                    onClick={manejarPasarAPro}
                    disabled={creandoPagoPro}
                  >
                    {creandoPagoPro ? 'Preparando el pago...' : 'Pasar a Pro'}
                  </button>
                )}
              </div>
            )}

            {/* El formulario sirve para crear y para editar, cambia el titulo nomas */}
            {formServicioVisible && (
              <form className="formulario-empresa" onSubmit={guardarServicio}>
                <h3>{servicioEditando ? 'Editar servicio' : 'Nuevo servicio'}</h3>

                <label>Nombre</label>
                <input
                  type="text"
                  value={formServicio.nombre}
                  onChange={(e) => setFormServicio({ ...formServicio, nombre: e.target.value })}
                  required
                />

                <label>Descripcion</label>
                <textarea
                  value={formServicio.descripcion}
                  onChange={(e) => setFormServicio({ ...formServicio, descripcion: e.target.value })}
                />

                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={seleccionarImagen}
                  disabled={subiendoImagen}
                />

                {subiendoImagen && <p className="texto-ayuda-empresa">Subiendo imagen...</p>}

                {/* Muestro la imagen chiquita para ver si subio bien */}
                {formServicio.imagen !== '' && (
                  <img src={formServicio.imagen} alt="Imagen del servicio" className="imagen-previa-empresa" />
                )}

                <label>Categoria</label>
                <select
                  value={formServicio.categoriaId}
                  onChange={(e) => setFormServicio({ ...formServicio, categoriaId: Number(e.target.value) })}
                  required
                >
                  <option value={0} disabled>Elegi una categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>

                <label className="label-check-empresa">
                  <input
                    type="checkbox"
                    checked={formServicio.estado === 'borrador'}
                    onChange={(e) => setFormServicio({ ...formServicio, estado: e.target.checked ? 'borrador' : 'revision' })}
                  />
                  Guardar como borrador
                </label>

                {formServicio.estado === 'revision' && (
                  <p className="texto-ayuda-empresa">
                    Al guardar, el servicio queda en revision hasta que un administrador lo apruebe.
                  </p>
                )}

                <div className="botones-formulario-empresa">
                  <button type="submit" disabled={subiendoImagen}>Guardar</button>
                  <button type="button" onClick={() => setFormServicioVisible(false)}>Cancelar</button>
                </div>
              </form>
            )}

            {categorias.length === 0 && (
              <p className="texto-ayuda-empresa">Todavia no hay categorias, pedile al administrador que cree alguna.</p>
            )}
            {categorias.length > 0 && servicios.length === 0 && (
              <p className="texto-ayuda-empresa">Todavia no cargaste ningun servicio.</p>
            )}

            {/* Recorro el array de servicios con map para mostrarlos */}
            <ul className="lista-empresa lista-servicios-empresa">
              {servicios.map((servicio) => (
                <li key={servicio.id} className="item-lista-empresa card-servicio-empresa">
                  <span className="detalle-item-empresa">
                    {servicio.imagen ? (
                      <img src={servicio.imagen} alt="" className="imagen-servicio-empresa" />
                    ) : null}
                    <span>
                      <b>{servicio.nombre}</b> - categoria: {servicio.categoria.nombre} ({textoEstadoServicio(servicio.estado)})
                    </span>
                  </span>
                  <span className="botones-item-empresa">
                    <button
                      onClick={() => {
                        setServicioEditando(servicio);

                        // Si el servicio ya esta publicado y la empresa lo edita, lo mando
                        // de nuevo a revision porque cambio el contenido que el admin aprobo.
                        let estadoParaEditar: 'borrador' | 'revision';
                        if (servicio.estado === 'publicado') {
                          estadoParaEditar = 'revision';
                        } else {
                          estadoParaEditar = servicio.estado;
                        }

                        setFormServicio({
                          nombre: servicio.nombre,
                          descripcion: servicio.descripcion ?? '',
                          imagen: servicio.imagen ?? '',
                          categoriaId: servicio.categoria.id,
                          estado: estadoParaEditar
                        });
                        setFormServicioVisible(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => borrarServicio(servicio)}>Borrar</button>
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
