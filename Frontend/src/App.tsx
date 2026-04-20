import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './componentes/Header';
import { HeroSection } from './componentes/HeroSection';
import { FeaturedContent } from './componentes/FeaturedContent';
import { TeamCommunitySection } from './componentes/TeamCommunitySection';
import { Footer } from './componentes/Footer';
import { ScrollToTop } from './componentes/ScrollToTop';
import LoginModal from './componentes/LoginModal';
import { ToastProvider } from './componentes/ToastProvider';
import { PageTransition } from './componentes/PageTransition';
import axios from 'axios';
import { isAuthenticated, setupAxiosInterceptors } from './services/authService';
import { ThemeProvider } from './contexts/ThemeContext';
import { isAdmin } from './utils/jwtUtils';

import LoginPage from './paginas/LoginPage';
import RegistrationPage from './paginas/RegistrationPage';
import ForgotPasswordPage from './paginas/ForgotPasswordPage';
import ResetPasswordPage from './paginas/ResetPasswordPage';
import { CategoriasPage } from './paginas/CategoriasPage';
import { DetalleLibro } from './paginas/DetalleLibro';
import { FavoritosPage } from './paginas/FavoritosPage';
import LibrosPage from './paginas/LibrosPage';
import { PerfilUsuario } from './paginas/PerfilUsuario';
import { CrearLibro } from './paginas/CrearLibro';
// de crear libro hay /crear-libro dentro de perfilpage
import { CrearSaga } from './paginas/CrearSaga';
import CrearSagaAdmin from './paginas/CrearSagaAdmin';
import PerfilPage from './paginas/PerfilPage';
import { motion } from 'framer-motion';
import AutoresPage from './paginas/AutoresPageMejorada';
import DetalleAutor from './paginas/DetalleAutor';
import SagasPage from './paginas/SagasPage';
import SagaDetallePage from './paginas/SagaDetallePage';

// 📌 Nuevas páginas
import NuevosLanzamientos from './paginas/NuevosLanzamientos';
import LibrosRecomendados from './paginas/LibrosRecomendados';
import LibrosPopulares from './paginas/LibrosPopulares';
import DetalleLista from './paginas/DetalleListaMejorada';

import ConfiguracionUsuario from './paginas/ConfiguracionUsuario';
import AdminModerationPage from './paginas/AdminModerationPage';
import AdminActividadPage from './paginas/AdminActividadPage';
import AdminRatingLibroPage from './paginas/AdminRatingLibroPage';
import AdminPermisoPage from './paginas/AdminPermisoPage';
import AdminCatalogoPage from './paginas/AdminCatalogoPage';
import AdminNewsletterPage from './paginas/AdminNewsletterPage';
import AdminNewsletterHistoryPage from './paginas/AdminNewsletterHistoryPage';
import NewsletterUnsubscribePage from './paginas/NewsletterUnsubscribePage';
import { ModerationDashboard } from './paginas/Admin/ModerationDashboard';
import SiguiendoPage from './paginas/SiguiendoPage';
import SeguidoresPage from './paginas/SeguidoresPage';
import FeedActividadPage from './paginas/FeedActividadPage';


interface FooterLink {
  name: string;
  href: string;
}

interface FooterCategory {
  title: string;
  links: FooterLink[];
}

interface LayoutProps {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function Layout({ showLoginModal, setShowLoginModal }: LayoutProps) {
  const location = useLocation();
  const isAdminSession = isAuthenticated() && isAdmin();

  const herramientasLinks: FooterLink[] = [
    { name: 'Mis Favoritos', href: '/favoritos' },
    { name: 'Mi Actividad', href: '/feed' },
  ];

  if (isAdminSession) {
    herramientasLinks.unshift(
      { name: 'Crear Libro', href: '/admin/crear-libro' },
      { name: 'Crear Saga', href: '/admin/crear-saga' },
      { name: 'Admin Newsletter', href: '/admin/newsletter' }
    );
  }

  const customFooterLinks: FooterCategory[] = [
    {
      title: 'Contenido',
      links: [
        { name: 'Libros Populares', href: '/libros/populares' },
        { name: 'Sagas Populares', href: '/sagas' },
        { name: 'Autores Destacados', href: '/autores' },
        { name: 'Nuevos Lanzamientos', href: '/libros/nuevos' },
        { name: 'Recomendados', href: '/libros/recomendados' },
      ],
    },
    {
      title: 'Herramientas',
      links: herramientasLinks,
    },
    {
      title: 'Cuenta',
      links: [
        { name: 'Mi Perfil', href: '/perfil' },
        { name: 'Configuración', href: '/configuracion' },
        { name: 'Siguiendo', href: '/siguiendo' },
        { name: 'Iniciar Sesión', href: '/LoginPage' },
        { name: 'Registrarse', href: '/registro' },
      ],
    },
  ];

  const hideLayout =
    location.pathname === '/LoginPage' ||
    location.pathname === '/registro' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password/');

  // Hide newsletter and features section on /perfil and /configuracion
  const hideNewsletterAndFeatures = location.pathname === '/perfil' || location.pathname === '/configuracion';

  const handleLoginSuccess = () => {
    // Aquí puedes agregar lógica adicional si es necesario después del login
    console.log('Usuario ha iniciado sesión exitosamente');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <ScrollToTop />
      {!hideLayout && (
        <Header siteName="BookCode" showNotifications={true} userAuthenticated={false} />
      )}

      <main>
        <PageTransition>
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {!hideNewsletterAndFeatures && (
                    <>
                      <HeroSection />
                      <FeaturedContent />
                      <TeamCommunitySection />
                    </>
                  )}
                </motion.div>
              }
            />

            {/* Autores */}
            <Route path="/autores" element={<AutoresPage />} />
            <Route path="/autores/:id" element={<DetalleAutor />} />

            {/* Sagas */}
            <Route path="/sagas" element={<SagasPage />} />
            <Route path="/sagas/:id" element={<SagaDetallePage />} />

            {/* Nuevas rutas */}
            <Route path="/libros/nuevos" element={<NuevosLanzamientos />} />
            <Route path="/libros/recomendados" element={<LibrosRecomendados />} />
            <Route path="/libros/populares" element={<LibrosPopulares />} />

            {/* Listas */}
            <Route path="/lista/:id" element={<DetalleLista />} />

            {/* Rutas originales */}
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/registro" element={<RegistrationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/perfil/:id" element={<PerfilUsuario />} />
            <Route path="/perfil/:id/seguidores" element={<SeguidoresPage />} />
            <Route path="/configuracion" element={<ConfiguracionUsuario />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/libro/:slug" element={<DetalleLibro />} />
            <Route path="/favoritos" element={<FavoritosPage />} />
            <Route path="/libros" element={<LibrosPage />} />
            <Route path="/admin/crear-libro" element={<CrearLibro />} />
            <Route path="/crear-saga" element={<CrearSaga />} />
            <Route path="/admin/crear-saga" element={<CrearSagaAdmin />} />
            <Route path="/admin/moderation" element={<AdminModerationPage />} />
            <Route path="/admin/moderation/stats" element={<ModerationDashboard />} />
            <Route path="/admin/actividad" element={<AdminActividadPage />} />
            <Route path="/admin/ratingLibro" element={<AdminRatingLibroPage />} />
            <Route path="/admin/permiso" element={<AdminPermisoPage />} />
            <Route path="/admin/catalogo" element={<AdminCatalogoPage />} />
            <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
            <Route path="/admin/newsletter/historial" element={<AdminNewsletterHistoryPage />} />
            <Route path="/unsubscribe/:token" element={<NewsletterUnsubscribePage />} />
            <Route path="/siguiendo" element={<SiguiendoPage />} />
            <Route path="/feed" element={<FeedActividadPage />} />
          </Routes>
        </PageTransition>
      </main>

      {!hideLayout && (
        <Footer
          siteName="BookCode"
          showSocialMedia={true}
          showNewsletter={!hideNewsletterAndFeatures}
          showFeatures={!hideNewsletterAndFeatures}
          customLinks={customFooterLinks}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Setup axios interceptors for automatic token refresh
  React.useEffect(() => {
    setupAxiosInterceptors(axios, () => setShowLoginModal(true));

    // Listen for session expired events from fetchWithRefresh
    const handleSessionExpired = () => setShowLoginModal(true);
    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
