import styles from './Nav.module.css';
import { useNavigate } from 'react-router-dom';
//import { parseJwt } from '../App/App';
import { useEffect, useState } from 'react';
import type { User } from '@/features/users/types';
import { BACKEND_URL } from '@/lib/config';
import { LogOut, X, Home, ClipboardList, Users, User as UserIcon, UserRoundCog } from 'lucide-react';
import ThemeToggle from '../../Toggle/ThemeToggle/ThemeToggle';
import { useAuth } from '@/lib/AuthContext';


// Logo de TechFix (icono transparente en Cloudinary)
const LOGO_URL = "https://res.cloudinary.com/dll6qurcd/image/upload/v1783738139/teckfixFvicon_qt61a7.png";

const Nav = () => {
  const { user, isAuth, loading: authLoading } = useAuth()
  const [usuario, setUsuario] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        //const decoded = parseJwt(token);
        //if (!decoded?.id_user) throw new Error('Token inválido');

        const response = await fetch(`${BACKEND_URL}/api/auth/me`,
          { method: 'GET', credentials: 'include' });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: User = await response.json();
        if (!data) throw new Error('Usuario no encontrado');

        setUsuario(data);
      } catch (e) {
        console.error('Error al cargar perfil:', e);
      }
    };

    cargarPerfil();
  }, [authLoading, isAuth]);

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

  const confirmarLogout = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      )
      if (response) {
        setShowLogoutModal(false);
        window.location.replace('/login');
      } else {
        console.log("Error en logout");
      }
    } catch (error) {
      console.error("Error al intentar logout: ", error);
    }
  };

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate('/home')}>
          <img src={LOGO_URL} alt="TechFix" style={{ height: 74, width: 74, objectFit: 'contain' }} />
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
            <button type="button" className={styles.navButton} onClick={() => navigate('/gestion')}>
              Gestión
            </button>
          </li>
          <li>
            <button type="button" className={styles.navButton} onClick={() => navigate('/clientManagement')}>
              Clientes
            </button>
          </li>
          {user?.rol === 'admin' && (
            <li>
              <button type="button" className={styles.navButton} onClick={() => navigate('/userManagement')}>
                Usuarios
              </button>
            </li>
          )}
        </ul>

        {/* Acciones desktop */}
        <div className={styles.navActions}>
          {/*
          {user?.rol === 'admin' && (
            <UserToggle />
          )}
          */}
          <ThemeToggle />
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => setShowLogoutModal(true)}
          >
            <span className={styles.logoutIcon}><LogOut size={18} /></span>
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
          {/*  {user?.rol === 'admin' && (
            <UserToggle />
          )} */}
          <ThemeToggle />
          {/*  <img
            src={usuario?.urlPicture}
            alt={usuario?.userName}
            className={styles.avatarMobile}
            onClick={() => navigate('/perfil')}
          />
        */}
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
            <X size={22} />
          </button>
        </div>


        <nav className={styles.drawerNav}>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/home')}
          >
            <span className={styles.drawerLinkIcon}><Home size={20} /></span>
            Inicio
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/gestion')}
          >
            <span className={styles.drawerLinkIcon}><ClipboardList size={20} /></span>
            Gestión
          </button>
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/clientes')}
          >
            <span className={styles.drawerLinkIcon}><Users size={20} /></span>
            Clientes
          </button>
          {user?.rol === 'admin' && (
            <>

              <button type="button" className={styles.drawerLink} onClick={() => navigate('/userManagement')}>
                <span className={styles.drawerLinkIcon}><UserRoundCog size={20} /></span>
                Usuarios
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.drawerLink}
            onClick={() => handleNavClick('/perfil')}
          >
            <span className={styles.drawerLinkIcon}><UserIcon size={20} /></span>
            Mi perfil
          </button>



        </nav>

        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.drawerLogout}
            onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
          >
            <span className={styles.logoutIcon}><LogOut size={18} /></span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Modal logout */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}><LogOut size={28} /></div>
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