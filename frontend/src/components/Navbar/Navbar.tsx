import { usuariosApi } from '../../services/usuariosApi';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRoleReturn } from '../../cookie/useProtectRoute';
import LogoutButton from '../LogoutButton/LogoutButton';
type Usuario = {
  nombre: string;
  foto: string;
};

type Option = {
  nombre: string;
  url: string;
};

function Navbar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const rol = useRoleReturn();
  const navigate = useNavigate();
  const handleToggleNav = () => {
    setShowNav((prev) => !prev);
  };
  useEffect(() => {
    const getUsuario = async () => {
      try {
        const res = await usuariosApi.getByCookie();
        setUsuario(res.data.data);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
      }
    };
    if (rol != '') getUsuario();
  }, [rol]);
  // juan.perez@email.com
  // Controlar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (showNav) {
      document.body.style.overflow = 'hidden ';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNav]);

  // opciones del menú según el rol
  const options: Option[] =
    rol === 'cliente'
      ? [
          {
            nombre: 'Servicios',
            url: '/servicios',
          },
          {
            nombre: 'Historia de turnos',
            url: '/historial',
          },
          {
            nombre: 'Sobre nosotros',
            url: '/about',
          },
        ]
      : [
          {
            nombre: 'Servicios',
            url: '/servicios',
          },
          {
            nombre: 'Sobre nosotros',
            url: '/about',
          },
        ];
  // Mapeo de las opciones para renderizarlas
  const showOptions = options.map((option) => (
    <li
      key={option.nombre}
      className="list-none mx-2 rounded-b-md lg:m-0 mt-1  hover:text-black sm:p-4 lg:p-0 border-b-2 border-gray-500  hover:bg-gray-300 transition-all duration-300 lg:hover:bg-transparent lg:border-b-0 "
    >
      <Link
        to={option.url}
        className="text-center lg:text-white text-black transition-300 lg:hover:text-naranja-1"
        onClick={() => setShowNav(false)}
      >
        {option.nombre}
      </Link>
    </li>
  ));

  const handleLogout = () => {
    // Eliminar el token (por ejemplo, de las cookies o localStorage)
    document.cookie = 'token=; Max-Age=0; path=/;'; // Elimina la cookie del token
    localStorage.removeItem('token'); // Si el token está en localStorage
    console.log('Token eliminado. Cerrando sesión...');
    navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
  };

  // Renderizado del componente Navbar
  return (
    <>
      {/* Navbar  en estilo Desktop */}
      <nav className="   flex w-full min-h-15  items-center justify-between p-0 bg-gradient-to-r from-neutral-500/45 to-neutral-200/85 backdrop-blur-md z-10">
        <div className="lg:block w-full hidden">
          <div className="lg:flex hidden items-center flex-1 p-3">
            <Link to="/">
              <img
                className="w-12 h-12 mr-5 shrink-0"
                src="/images/logo.png"
                alt="Logo"
              />
            </Link>
            <ul className="hidden lg:flex gap-6 items-center">{showOptions}</ul>
            {/* muestra si esta registrado o no */}
            <div className="hidden lg:flex items-center justify-end ml-auto ">
              {usuario ? (
                <>
                  <button
                    className="flex items-center gap-2 bg-naranja-1 px-4 p-2 rounded-3xl"
                    onClick={() => {
                      setShowUserMenu((prev) => !prev);
                    }}
                  >
                    <span className="text-sm font-medium">
                      {usuario.nombre}
                    </span>
                    <img
                      src={usuario.foto}
                      alt="Foto de perfil"
                      className="w-7 h-7 rounded-full object-cover ml-2"
                    />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-16 right-4 bg-white border z-60 border-gray-300 rounded-md shadow-lg w-50">
                      <Link className="w-full text-black py-1.5" to="/perfil">
                        {' '}
                        Editar perfil{' '}
                      </Link>
                      <LogoutButton onLogout={handleLogout} />
                    </div>
                  )}
                </>
              ) : (
                <Link
                  className="bg-orange-500 text-white font-medium px-5 py-2 rounded-xl transition-all duration-300 hover:bg-orange-600"
                  to="/login"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Navbar en estilo Mobile */}
        <div className="lg:hidden w-full ">
          <div ref={navRef} onClick={handleToggleNav}>
            {!showNav ? (
              <>
                <div className="flex flex-row items-center justify-between w-full p-3 ">
                  <Link to="/" className="flex-shrink-0 mr-auto">
                    <img
                      className="w-12 h-12 shrink-0"
                      src="/images/logo.png"
                      alt="Logo"
                    />
                  </Link>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Abrir menú"
                    fill="#fff"
                    className="flex"
                  >
                    <rect x="4" y="6" width="16" height="2" rx="1" />
                    <rect x="4" y="11" width="16" height="2" rx="1" />
                    <rect x="4" y="16" width="16" height="2" rx="1" />
                  </svg>
                </div>
              </>
            ) : (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Cerrar menú"
                fill="#fff"
                className="hidden"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </div>
          {showNav && (
            <div className="w-full  z-10 relative ">
              <ul className="bg-white w-full h-screen">
                <li className="flex justify-end p-4 pt-2">
                  <button
                    onClick={() => setShowNav(false)}
                    aria-label="Cerrar menú"
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="hover:bg-gray-200 group"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-orange-500"
                      />
                    </svg>
                  </button>
                </li>
                {showOptions}
                <li className="flex flex-row justify-center items-center mt-4">
                  {usuario ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="my-5">
                        <LogoutButton
                          onLogout={handleLogout}
                          isCollapsed={false}
                        />
                      </div>
                      <Link
                        to="/perfil"
                        onClick={() => setShowNav(false)}
                        className="bg-orange-500 justify-center items-center text-white font-medium flex flex-row px-5 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:border-orange-500 hover:border-1 hover:shadow-2xl hover:text-naranja-1 w-10/12 text-center"
                      >
                        <p className="mx-auto">{usuario?.nombre}</p>
                        <img
                          className="h-10 w-10 rounded-full ml-2"
                          src={'/images/fotoUserId.png'}
                          alt="Foto de perfil"
                        />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShowNav(false)}
                      className="bg-orange-500 text-white font-medium px-5 py-2  rounded-xl transition-all duration-300 hover:bg-gray-100 hover:border-orange-500 hover:border-1 hover:shadow-2xl hover:text-naranja-1 w-10/12 text-center"
                    >
                      Iniciar sesión
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
