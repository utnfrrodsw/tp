import styles from './Nav.module.css';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from '../App/App';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../../types/types';

const Nav = () => {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token');

        const decoded = parseJwt(token);
        if (!decoded?.id_user) throw new Error('Token inválido');

        const response = await fetch(
          `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/verifica/${decoded.id_user}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: UserProfile = await response.json();
        if (!data) throw new Error('Usuario no encontrado');

        setUsuario(data);
      } catch (e) {
        console.error('Error al cargar perfil:', e);
      }
    };

    cargarPerfil();
  }, []);

  // Cierra el menú al redimensionar a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const confirmarLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    window.location.replace('/login');
  };

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className={styles.navContainer}>
        {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/home')}
>
            <span className={styles.logoMark}>TF</span>
            <div className={styles.logoCopy}>
              <span className={styles.logoText}>TechFix</span>
              <span className={styles.logoSubtitle}>Reparamos lo que te conecta</span>
            </div>
          </div>


        <ul className={styles.navLinks}>
          <li>
            <button type="button" className={styles.navButton} onClick={() => navigate('/home')}>
              Inicio
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => alert('La sección Servicios todavía está en desarrollo.')}
            >
              Servicios
            </button>
          </li>
          <li>
            <button type="button" className={styles.navButton} onClick={() => navigate('/gestion')}>
              Gestión
            </button>
          </li>
          <li>
            <button type="button" className={styles.navButton} onClick={() => navigate('/clientes')}>
              Clientes
            </button>
          </li>
        </ul>

        {/* Acciones desktop */}
        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => setShowLogoutModal(true)}
          >
            <span className={styles.logoutIcon}>⏻</span>
            Cerrar sesión
          </button>
          <img
            src={usuario?.urlPicture}
            alt={usuario?.userName}
            className={styles.avatar}
            onClick={() => navigate('/perfil')}
          />
        </div>


        <div className={styles.mobileRight}>
          <img
            src={usuario?.urlPicture}
            alt={usuario?.userName}
            className={styles.avatarMobile}
            onClick={() => navigate('/perfil')}
          />
          <button
            type="button"
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </nav>


      {menuOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}


      <aside className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>

        <div className={styles.drawerHeader}>
          <div className={styles.drawerUser}>
            <img
              src={usuario?.urlPicture}
              alt={usuario?.userName}
              className={styles.drawerAvatar}
            />
            <div>
              <p className={styles.drawerUserName}>{usuario?.userName ?? 'Usuario'}</p>
              <p className={styles.drawerUserSub}>Mi cuenta</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>


        <nav className={styles.drawerNav}>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/home')}
          >
            <span className={styles.drawerLinkIcon}>🏠</span>
            Inicio
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => { setMenuOpen(false); alert('La sección Servicios todavía está en desarrollo.'); }}
          >
            <span className={styles.drawerLinkIcon}>🔧</span>
            Servicios
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/gestion')}
          >
            <span className={styles.drawerLinkIcon}>📋</span>
            Gestión
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/clientes')}
          >
            <span className={styles.drawerLinkIcon}>👥</span>
            Clientes
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/perfil')}
          >
            <span className={styles.drawerLinkIcon}>👤</span>
            Mi perfil
          </button>

        </nav>

        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.drawerLogout}
            onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
          >
            <span className={styles.logoutIcon}>⏻</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Modal logout */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>⏻</div>
            <h2 className={styles.modalTitle}>¿Cerrar sesión?</h2>
            <p className={styles.modalText}>
              Vas a salir de tu cuenta actual. Para volver a ingresar, tendrás que iniciar sesión nuevamente.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={confirmarLogout}
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;