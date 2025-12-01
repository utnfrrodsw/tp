import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../cookie/useAuth';
import LogoutButton from '../LogoutButton/LogoutButton.tsx';


export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DashNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  menuItems?: MenuItem[];
  showMobileNav?: boolean;
  setShowMobileNav?: (show: boolean) => void;
}

function DashNav({ activeSection, setActiveSection, showMobileNav, setShowMobileNav }: DashNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // Auto-colapsar en mobile, expandir en desktop
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Configurar el estado inicial
    handleResize();

    // Agregar listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'perfil',
      name: 'Perfil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.75 28.4375H11.25C4.4625 28.4375 1.5625 25.5375 1.5625 18.75V11.25C1.5625 4.4625 4.4625 1.5625 11.25 1.5625H18.75C25.5375 1.5625 28.4375 4.4625 28.4375 11.25V18.75C28.4375 25.5375 25.5375 28.4375 18.75 28.4375ZM11.25 3.4375C5.4875 3.4375 3.4375 5.4875 3.4375 11.25V18.75C3.4375 24.5125 5.4875 26.5625 11.25 26.5625H18.75C24.5125 26.5625 26.5625 24.5125 26.5625 18.75V11.25C26.5625 5.4875 24.5125 3.4375 18.75 3.4375H11.25Z" fill="currentColor"/>
          <path d="M15.0003 16.3496C14.8378 16.3496 14.6753 16.3121 14.5253 16.2246L7.90028 12.3996C7.45028 12.1371 7.30025 11.5621 7.56275 11.1246C7.82525 10.6746 8.40028 10.5246 8.83778 10.7871L14.9878 14.3496L21.1003 10.8121C21.5503 10.5496 22.1253 10.7121 22.3753 11.1496C22.6253 11.5871 22.4753 12.1746 22.0378 12.4246L15.4628 16.2246C15.3253 16.2996 15.1628 16.3496 15.0003 16.3496Z" fill="currentColor"/>
          <path d="M15 23.1501C14.4875 23.1501 14.0625 22.7251 14.0625 22.2126V15.4126C14.0625 14.9001 14.4875 14.4751 15 14.4751C15.5125 14.4751 15.9375 14.9001 15.9375 15.4126V22.2126C15.9375 22.7251 15.5125 23.1501 15 23.1501Z" fill="currentColor"/>
          <path d="M14.9998 23.4373C14.2748 23.4373 13.5624 23.2748 12.9874 22.9623L8.98733 20.7373C7.78733 20.0748 6.8623 18.4873 6.8623 17.1123V12.8748C6.8623 11.5123 7.79983 9.92476 8.98733 9.24976L12.9874 7.02476C14.1374 6.38726 15.8623 6.38726 17.0123 7.02476L21.0123 9.24976C22.2123 9.91226 23.1374 11.4998 23.1374 12.8748V17.1123C23.1374 18.4748 22.1998 20.0623 21.0123 20.7373L17.0123 22.9623C16.4373 23.2873 15.7248 23.4373 14.9998 23.4373ZM14.9998 8.43726C14.5873 8.43726 14.1873 8.51226 13.8998 8.67476L9.89984 10.8998C9.28734 11.2373 8.7373 12.1873 8.7373 12.8748V17.1123C8.7373 17.8123 9.28734 18.7498 9.89984 19.0873L13.8998 21.3123C14.4748 21.6373 15.5248 21.6373 16.0998 21.3123L20.0998 19.0873C20.7123 18.7498 21.2624 17.7998 21.2624 17.1123V12.8748C21.2624 12.1748 20.7123 11.2373 20.0998 10.8998L16.0998 8.67476C15.8123 8.51226 15.4123 8.43726 14.9998 8.43726Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'zonas',
      name: 'Zonas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                <path d="M16.272 10.272a4 4 0 1 1-8 0a4 4 0 0 1 8 0Zm-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
                <path d="M5.794 16.518a9 9 0 1 1 12.724-.312l-6.206 6.518l-6.518-6.206Zm11.276-1.691l-4.827 5.07l-5.07-4.827a7 7 0 1 1 9.897-.243Z"/>
            </g>
        </svg>
      )
    },
    {
      id: 'horarios',
      name: 'Horarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'comentarios',
      name: 'Comentarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'pagos',
      name: 'Pagos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Overlay oscuro para móvil cuando se despliega */}
      {isMobile && (
        <div 
          className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
            showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowMobileNav?.(false)}
        />
      )}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isMobile 
          ? 'w-16 fixed inset-y-0 left-0 z-30' 
          : `${isCollapsed ? 'w-16' : 'w-64'} relative` 
      }`}>
        
        <div className="p-4 border-b border-gray-200 h-16 flex items-center">
        {!(isMobile || isCollapsed) ? (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-700 px-3">Dashboard</h2>
            {/* Solo mostrar botón de colapsar en desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center h-full items-center">
            {/* botón hamburguesa */}
            {isMobile && (
              <button
                onClick={() => setShowMobileNav?.(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {/* boton flecha solo en escritorio */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile && setShowMobileNav) {
                  setShowMobileNav(false);
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg ${isCollapsed ? 'text-center' : 'text-left'} transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer group ${
                activeSection === item.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
              }`}
              style={{ outline: 'none', border: 'none' }}
            >
              <span className={`transition-colors ${activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
        <div className="p-4">
          <LogoutButton onLogout={handleLogout} isCollapsed={isMobile || isCollapsed} />
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${(isMobile || isCollapsed) ? 'justify-center' : 'space-x-3'}`}>
            <img 
              src={usuario?.foto || usuario?.urlFoto || "/images/fotoUserId.png"} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover"
            />
            {!(isMobile || isCollapsed) && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 text-left">
                  {usuario?.nombre || usuario?.apellido 
                    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
                    : usuario?.mail }
                </p>
                <p className="text-xs text-gray-500 text-left">
                  { usuario?.mail }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobile && (
        <div className={`bg-white shadow-lg border-r border-gray-200 w-64 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out ${
          showMobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 border-b border-gray-200 h-16 flex items-center">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold text-gray-700 px-3">Dashboard</h2>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isMobile && setShowMobileNav) {
                        setShowMobileNav(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus:ring-0 border-0 outline-none cursor-pointer group ${
                      activeSection === item.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }`}
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <span className={`transition-colors ${activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4">
            <LogoutButton onLogout={handleLogout} isCollapsed={false} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <img 
                src={usuario?.foto || usuario?.urlFoto || "/images/fotoUserId.png"} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 text-left">
                  {usuario?.nombre || usuario?.apellido 
                    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
                    : usuario?.mail }
                </p>
                <p className="text-xs text-gray-500 text-left">
                  { usuario?.mail }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}

export default DashNav;