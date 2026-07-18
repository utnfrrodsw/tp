import { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { parseJwt } from "../App/App";
import styles from "./Home.module.css";
import  type {UserProfile}  from "../../types/types";
import Footer from "./../../components/Footer/Footer";

const Home = () => {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  //const [mostrarToast, setMostrarToast] = useState<boolean>(true);
  const [mostrarToast, setMostrarToast] = useState<boolean>(() => {
  return sessionStorage.getItem('showLoginToast') === 'true';
});

const [toastSaliendo, setToastSaliendo] = useState<boolean>(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = parseJwt(token);
        if (!decoded?.id_user) return;

        const response = await fetch(
          `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/verifica/${decoded.id_user}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const data: UserProfile = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };

    cargarUsuario();
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
          <div className={styles.toastIcon}>✓</div>
          <div>
            <p className={styles.toastTitle}>Sesión iniciada</p>
            <p className={styles.toastText}>Acceso validado correctamente.</p>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <section className={styles.heroCard}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>TechFix · Taller de Reparaciones</div>

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
                <button type="button" className={styles.mainAction}>
                  <span className={styles.actionIcon}>📋</span>
                  <span>
                    <strong>Ver órdenes</strong>
                    <small>Revisar trabajos activos</small>
                  </span>
                </button>

                <button type="button" className={styles.secondaryAction}>
                  <span className={styles.actionIcon}>＋</span>
                  <span>
                    <strong>Nueva orden</strong>
                    <small>Registrar equipo entrante</small>
                  </span>
                </button>
              </div>
            ) : (
              <>
                <div className={styles.userMessage}>
                  <span className={styles.userMessageIcon}>🔎</span>
                  <span>
                    Tu cuenta está activa. Cuando el backend tenga disponible el rol cliente,
                    este panel mostrará tus equipos, presupuestos e historial de reparaciones.
                  </span>
                </div>
                        
                {/*
                  TODO CLIENTE:
                  Reactivar este bloque cuando exista el rol "cliente" en backend.
                
                  <div className={styles.clientActions}>
                    <button type="button" className={styles.clientAction}>
                      <span className={styles.clientActionIcon}>📱</span>
                      <span>
                        <strong>Mis equipos</strong>
                        <small>Celulares, computadoras y dispositivos registrados</small>
                      </span>
                    </button>
                
                    <button type="button" className={styles.clientAction}>
                      <span className={styles.clientActionIcon}>🧾</span>
                      <span>
                        <strong>Mis presupuestos</strong>
                        <small>Consultá importes, estados y aprobaciones pendientes</small>
                      </span>
                    </button>
                
                    <button type="button" className={styles.clientAction}>
                      <span className={styles.clientActionIcon}>🛠️</span>
                      <span>
                        <strong>Historial de arreglos</strong>
                        <small>Revisá qué reparaciones se realizaron sobre tus equipos</small>
                      </span>
                    </button>
                  </div>
                */}
              </>
            )}
          </div>

            <div className={styles.heroVisual}>
              <div className={styles.quickPanel}>
                <div className={styles.quickPanelHeader}>
                  <span className={styles.quickPanelIcon}>⚡</span>
                  <div>
                    <p className={styles.quickPanelTitle}>Accesos rápidos</p>
                    <p className={styles.quickPanelText}>Gestioná el taller sin perder tiempo.</p>
                  </div>
                </div>

                <div className={styles.quickPanelList}>
                  <button type="button" className={styles.quickPanelItem}>
                    <span>📋</span>
                    <strong>Consultar órdenes</strong>
                  </button>

                  <button type="button" className={styles.quickPanelItem}>
                    <span>➕</span>
                    <strong>Crear nueva orden</strong>
                  </button>

                  <button type="button" className={styles.quickPanelItem}>
                    <span>💰</span>
                    <strong>Ver presupuestos</strong>
                  </button>
                </div>
              </div>
            </div>
        </section>

        {esTecnico && (
          <section className={styles.quickGrid}>
            <div className={styles.quickCard}>
              <span className={styles.quickNumber}>24</span>
              <span className={styles.quickLabel}>Órdenes activas</span>
            </div>

            <div className={styles.quickCard}>
              <span className={styles.quickNumber}>7</span>
              <span className={styles.quickLabel}>Pendientes de presupuesto</span>
            </div>

            <div className={styles.quickCard}>
              <span className={styles.quickNumber}>15</span>
              <span className={styles.quickLabel}>En reparación</span>
            </div>

            <div className={styles.quickCard}>
              <span className={styles.quickNumber}>32</span>
              <span className={styles.quickLabel}>Entregadas este mes</span>
            </div>
          </section>
        )}
        
        {/*
          TODO CLIENTE:
          Reactivar esta sección cuando el backend tenga:
          - rol "cliente"
          - órdenes asociadas al cliente
          - equipos asociados al cliente
          - presupuestos asociados al cliente
          - historial de reparaciones

          {esCliente && (
            <section className={styles.clientDashboard}>
              <div className={styles.clientSummaryCard}>
                <div>
                  <p className={styles.clientKicker}>Panel de cliente</p>
                  <h2 className={styles.clientTitle}>Seguimiento de tus reparaciones</h2>
                  <p className={styles.clientText}>
                    Esta sección está preparada para mostrar tus órdenes, presupuestos, equipos registrados
                    y reparaciones realizadas cuando el backend tenga esos datos disponibles.
                  </p>
                </div>

                <span className={styles.clientStatusPill}>Cliente estándar</span>
              </div>

              <div className={styles.clientGrid}>
                <div className={styles.clientInfoCard}>
                  <span className={styles.clientInfoIcon}>📦</span>
                  <strong>Órdenes en curso</strong>
                  <p>Acá se mostrarán las reparaciones que todavía están activas.</p>
                </div>

                <div className={styles.clientInfoCard}>
                  <span className={styles.clientInfoIcon}>💬</span>
                  <strong>Presupuestos por responder</strong>
                  <p>Acá aparecerán los presupuestos pendientes de aceptación o rechazo.</p>
                </div>

                <div className={styles.clientInfoCard}>
                  <span className={styles.clientInfoIcon}>✅</span>
                  <strong>Arreglos realizados</strong>
                  <p>Acá vas a poder revisar qué trabajos técnicos se hicieron sobre cada equipo.</p>
                </div>
              </div>
            </section>
          )}
        */}

      </main>
      <Footer />
    </div>
  );
};

export default Home;