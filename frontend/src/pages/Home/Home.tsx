import { useEffect, useState } from "react";
import Nav from "@/components/layout/Nav/Nav";
import styles from "./Home.module.css";
import type { Order } from "@/types/types";
import type { User } from '@/features/users/types';
import Footer from "@/components/Footer/Footer";
import OrderMiniCard from "@/components/OrderComponent/OrderMiniCard/OrderMiniCard";
import { BACKEND_URL } from '@/lib/config';
import { ClipboardList, Plus, Wallet, Zap, Search, Check, FileText, Clock, Wrench, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [stats, setStats] = useState({ activas: 0, pendientesPresupuesto: 0, enReparacion: 0, entregadasMes: 0 });
  const [ordenes, setOrdenes] = useState<Order[]>([]);
  //const [mostrarToast, setMostrarToast] = useState<boolean>(true);
  const navigate = useNavigate();
  const [mostrarToast, setMostrarToast] = useState<boolean>(() => {
    return sessionStorage.getItem('showLoginToast') === 'true';
  });

  const [toastSaliendo, setToastSaliendo] = useState<boolean>(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {

        const response = await fetch(`${BACKEND_URL}/api/auth/me`,
          { credentials: 'include' });

        if (!response.ok) return;

        const data: User = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };

    cargarUsuario();
  }, []);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders/stats`, { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    cargarStats();
  }, []);

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders`, { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        const lista: Order[] = Array.isArray(data) ? data : data.data ?? [];
        setOrdenes(lista);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
      }
    };
    cargarOrdenes();
  }, []);

  useEffect(() => {
    if (!mostrarToast) return;

    sessionStorage.removeItem('showLoginToast');

    const salidaTimer = window.setTimeout(() => {
      setToastSaliendo(true);
    }, 2800);

    const ocultarTimer = window.setTimeout(() => {
      setMostrarToast(false);
      setToastSaliendo(false);
    }, 3400);

    return () => {
      window.clearTimeout(salidaTimer);
      window.clearTimeout(ocultarTimer);
    };
  }, [mostrarToast]);

  const esTecnico = usuario?.rol === "tecnico" || usuario?.rol === "admin";
  const ultimasOrdenes = [...ordenes]
    .sort((a, b) => String(b.id_order).localeCompare(String(a.id_order)))
    .slice(0, 6);

  /*
    TODO CLIENTE:
    Reactivar cuando el backend tenga implementado el rol "cliente".
    La idea es mostrar una experiencia distinta para clientes:
    - Mis equipos
    - Mis presupuestos
    - Historial de arreglos
    - Tipo de cliente
  */
  // const esCliente = usuario && !esTecnico;

  return (
    <div className={styles.page}>
      <Nav />

      {mostrarToast && (
        <div className={`${styles.toast} ${toastSaliendo ? styles.toastExit : ''}`}>
          <div className={styles.toastIcon}><Check size={20} /></div>
          <div>
            <p className={styles.toastTitle}>Sesión iniciada</p>
            <p className={styles.toastText}>Acceso validado correctamente.</p>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <section className={styles.heroCard}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>Taller de reparaciones</div>

            <h1 className={styles.title}>
              Bienvenido{usuario?.userName ? `, ${usuario.userName}` : ""}.
            </h1>

            <p className={styles.description}>
              {esTecnico
                ? "Tenés todo listo para gestionar órdenes, revisar equipos en reparación y crear nuevos trabajos de forma rápida."
                : "Tu cuenta está activa. Desde este panel vas a poder consultar tus equipos, presupuestos, reparaciones realizadas y el estado de tus órdenes."}
            </p>

            {esTecnico ? (
              <div className={styles.primaryActions}>
                <button type="button" className={styles.mainAction} onClick={() => navigate('/manageOrder')}>
                  <span className={styles.actionIcon}><ClipboardList size={22} /></span>
                  <span>
                    <strong>Ver órdenes</strong>
                    <small>Revisar trabajos activos</small>
                  </span>
                </button>

                <button type="button" className={styles.secondaryAction} onClick={() => navigate('/createOrder')}>
                  <span className={styles.actionIcon}><Plus size={22} /></span>
                  <span>
                    <strong>Nueva orden</strong>
                    <small>Registrar equipo entrante</small>
                  </span>
                </button>
              </div>
            ) : (
              <>
                <div className={styles.userMessage}>
                  <span className={styles.userMessageIcon}><Search size={20} /></span>
                  <span>
                    Tu cuenta está activa. Cuando el backend tenga disponible el rol cliente,
                    este panel mostrará tus equipos, presupuestos e historial de reparaciones.
                  </span>
                </div>
              </>
            )}
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.quickPanel}>
              <div className={styles.quickPanelHeader}>
                <span className={styles.quickPanelIcon}><Zap size={22} /></span>
                <div>
                  <p className={styles.quickPanelTitle}>Accesos rápidos</p>
                  <p className={styles.quickPanelText}>Gestioná el taller sin perder tiempo.</p>
                </div>
              </div>

              <div className={styles.quickPanelList}>
                <button type="button" className={styles.quickPanelItem} onClick={() => navigate('/manageOrder')}>
                  <span><ClipboardList size={18} /></span>
                  <strong>Consultar órdenes</strong>
                </button>

                <button type="button" className={styles.quickPanelItem} onClick={() => navigate('/createOrder')}>
                  <span><Plus size={18} /></span>
                  <strong>Crear nueva orden</strong>
                </button>

                <button type="button" className={styles.quickPanelItem} onClick={() => navigate('/manageOrder')}>
                  <span><Wallet size={18} /></span>
                  <strong>Ver presupuestos</strong>
                </button>
              </div>
            </div>
          </div>
        </section>

        {esTecnico && (
          <section className={styles.quickGrid}>
            <div className={styles.quickCard} onClick={() => navigate('/manageOrder?filtro=activas')}>
              <FileText className={styles.quickIcon} size={20} />
              <span className={styles.quickNumber}>{stats.activas}</span>
              <span className={styles.quickLabel}>Órdenes activas</span>
            </div>

            <div className={styles.quickCard} onClick={() => navigate('/manageOrder?filtro=pendientes')}>
              <Clock className={styles.quickIcon} size={20} />
              <span className={styles.quickNumber}>{stats.pendientesPresupuesto}</span>
              <span className={styles.quickLabel}>Pendientes de presupuesto</span>
            </div>

            <div className={styles.quickCard} onClick={() => navigate('/manageOrder?filtro=reparacion')}>
              <Wrench className={styles.quickIcon} size={20} />
              <span className={styles.quickNumber}>{stats.enReparacion}</span>
              <span className={styles.quickLabel}>En reparación</span>
            </div>

            <div className={styles.quickCard} onClick={() => navigate('/manageOrder?filtro=entregado')}>
              <CircleCheck className={styles.quickIcon} size={20} />
              <span className={styles.quickNumber}>{stats.entregadasMes}</span>
              <span className={styles.quickLabel}>Entregadas este mes</span>
            </div>
          </section>
        )}

        {esTecnico && ultimasOrdenes.length > 0 && (
          <section className={styles.ordenesSection}>
            <div className={styles.ordenesHeader}>
              <h2 className={styles.ordenesTitle}>Últimas órdenes</h2>
              <button type="button" className={styles.ordenesVerTodas} onClick={() => navigate('/manageOrder')}>
                Ver todas
              </button>
            </div>
            <div className={styles.ordenesGrid}>
              {ultimasOrdenes.map((orden) => (
                <OrderMiniCard key={orden.id_order} order={orden} onClick={() => navigate('/manageOrder')} />
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Home;