import { useState, useEffect } from 'react';
import DashNav from '../../components/DashNav/DashNav';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PerfilSection from '../../components/Dashboard/PerfilSection';
import ClientesSection from '../../components/Dashboard/ClientesSection';
import ServiciosSection from '../../components/Dashboard/ServiciosSection';
import ComentariosPrestadorSection from '../../components/Dashboard/ComentariosPrestadorSection';
import PagosSection from '../../components/Dashboard/PagosSection';
import HorariosSection from '../../components/Dashboard/HorariosSection';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
import DevolucionPago from '../../components/Modal/DevolucionPago.tsx';
import ZonasSection from '../../components/Dashboard/ZonasSection.tsx';

function Dashboard() {
  const lugar = 'dashboard';
  const { estado } = useParams<{ estado?: string }>();
  const navigate = useNavigate();
  const cerrarModal = () => {
    navigate('/dashboard');
  };

  const [activeSection, setActiveSection] = useState('perfil');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { usuario, loading: authLoading } = useProtectRoute(['prestador']);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Cerrar menú móvil si se cambia a desktop
      if (!mobile && showMobileNav) {
        setShowMobileNav(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileNav]);
  if (authLoading || !usuario) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
        Cargando...
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'perfil':
        return <PerfilSection />;
      case 'clientes':
        return <ClientesSection />;
      case 'servicios':
        return <ServiciosSection />;
      case 'comentarios':
        return <ComentariosPrestadorSection />;
      case 'pagos':
        return <PagosSection />;
      case 'horarios':
        return <HorariosSection />;
      case 'zonas':
        return <ZonasSection />;
      default:
        return <PerfilSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showMobileNav={showMobileNav}
        setShowMobileNav={setShowMobileNav}
      />
      {estado && (
        <DevolucionPago estado={estado} cerrar={cerrarModal} lugar={lugar} />
      )}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobile ? 'ml-16' : 'ml-0'
        }`}
      >
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <h1 className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                {activeSection === 'perfil'
                  ? 'Configuración de perfil'
                  : activeSection === 'pagos'
                  ? 'Pagos e Ingresos'
                  : activeSection === 'horarios'
                  ? 'Horarios de Trabajo'
                  : activeSection}
              </h1>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 hover:bg-gray-50 hover:scale-105 transition-all duration-200 rounded-lg p-2 cursor-pointer group"
            >
              <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
              <h2 className="text-lg font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                Reformix
              </h2>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
