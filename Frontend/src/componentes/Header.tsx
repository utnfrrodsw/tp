// src/componentes/Header.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Menu, X, Star, Book, Search, Users, Settings, Shield, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, logoutUser } from "../services/authService";
import { isAdmin } from "../utils/jwtUtils";
import { ThemeToggle } from "./ThemeToggle";
import { QuickAccess } from "./QuickAccess";
import { NotificationBell } from "./NotificationBell";


interface HeaderProps {
  siteName?: string;
  showNotifications?: boolean;
  userAuthenticated?: boolean;
}


const StackedBooksIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="4" rx="1" ry="1" />
    <rect x="5" y="11" width="14" height="4" rx="1" ry="1" />
    <rect x="7" y="17" width="10" height="4" rx="1" ry="1" />
  </svg>
);

// Datos
const dropdownItems = {
  Libros: [
    { name: "Nuevos lanzamientos", href: "/libros/nuevos" },
    { name: "Más populares", href: "/libros/populares" },
    { name: "Recomendados", href: "/libros/recomendados" },
  ],
  Configuración: [
    { name: "Preferencias", href: "/configuracion/preferencias" },
    { name: "Cuenta", href: "/configuracion/cuenta" },
    { name: "Privacidad", href: "/configuracion/privacidad" },
  ],
};

// Hook para detectar móvil o tablet
function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const update = () => {
      const isTouch = window.matchMedia("(hover: none)").matches;
      setIsMobileOrTablet(isTouch || window.innerWidth < 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobileOrTablet;
}

// Componente Dropdown reutilizable
const DropdownMenu: React.FC<{ items: { name: string; href: string }[] }> = ({ items }) => (
  <motion.div
    className="absolute top-full left-0 bg-white dark:bg-gray-800 rounded shadow-md dark:shadow-gray-900/50 p-2 min-w-[180px] z-50 border border-gray-100 dark:border-gray-700 transition-colors duration-200"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {items.map((subitem) => (
      <Link
        key={subitem.name}
        to={subitem.href}
        className="block px-3 py-2 text-gray-700 dark:text-gray-300 rounded hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200"
      >
        {subitem.name}
      </Link>
    ))}
  </motion.div>
);

// HEADER
export const Header: React.FC<HeaderProps> = ({
  siteName = "BookCode",
  showNotifications = true,
  userAuthenticated = false,
}) => {
  const [menuState, setMenuState] = useState({
    user: false,
    dropdown: null as string | null,
  });
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isMobileAdminOpen, setIsMobileAdminOpen] = useState(false);

  const searchTimeoutRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const isMobileOrTablet = useIsMobileOrTablet();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = isAuthenticated();

  const closeAllMenus = useCallback(() => {
    setMenuState({ user: false, dropdown: null });
    setIsAdminDropdownOpen(false);
    setIsMobileAdminOpen(false);
    if (isMobileOrTablet) setShowSearch(false);
  }, [isMobileOrTablet]);

  // Helper para verificar si una ruta está activa
  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAllMenus]);

  const navigationItems = [
    { name: "Libros", href: "/libros", icon: Book },
    { name: "Autores", href: "/autores", icon: Users },
    { name: "Categorías", href: "/categorias", icon: Star },
    { name: "Sagas", href: "/sagas", icon: StackedBooksIcon },
    ...(userAuthenticated ? [{ name: "Configuración", href: "/configuracion", icon: Settings }] : []),
  ];

  // Search handlers
  const handleMouseEnterSearch = () => {
    if (!isMobileOrTablet) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      setShowSearch(true);
    }
  };
  const handleMouseLeaveSearch = () => {
    if (!isMobileOrTablet && !isSearchFocused) {
      searchTimeoutRef.current = window.setTimeout(() => setShowSearch(false), 300);
    }
  };
  const handleSearchClick = () => {
    if (isMobileOrTablet) {
      navigate('/libros');
      return;
    }
    setShowSearch(true);
  };

  return (
    <header ref={headerRef} className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <div className="flex items-center z-10">
            <Link to="/">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{siteName}</h1>
            </Link>
          </div>

          {/* Navegación centrada (lg+) */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-4 xl:space-x-6">
            {navigationItems
              .filter((item) => ["Libros", "Autores", "Categorías", "Sagas"].includes(item.name))
              .map((item) => {
                const isActive = isActiveRoute(item.href);
                const hasDropdown = dropdownItems[item.name as keyof typeof dropdownItems];
                return (
                  <div
                    key={item.name}
                    className="relative flex items-center px-2 py-2 transition-colors duration-200"
                    onMouseEnter={() => !isMobileOrTablet && hasDropdown && setMenuState((prev) => ({ ...prev, dropdown: item.name }))}
                    onMouseLeave={() => !isMobileOrTablet && setMenuState((prev) => ({ ...prev, dropdown: null }))}
                  >
                    <Link 
                      to={item.href} 
                      className={`flex items-center space-x-1 relative cursor-pointer ${
                        isActive 
                          ? 'text-green-600 dark:text-green-400 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                      onClick={(e) => {
                        if (isMobileOrTablet && hasDropdown) {
                          e.preventDefault();
                          setMenuState((prev) => ({
                            ...prev,
                            dropdown: prev.dropdown === item.name ? null : item.name,
                          }));
                        }
                      }}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                      {/* Indicador visual de página activa */}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400 dark:from-green-500 dark:to-green-300 rounded-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                    <AnimatePresence>
                      {menuState.dropdown === item.name && hasDropdown && (
                        <DropdownMenu items={hasDropdown} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </nav>

          {/* Iconos derecha */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-10">
            {/* Search */}
            <div
              onMouseEnter={handleMouseEnterSearch}
              onMouseLeave={handleMouseLeaveSearch}
              onClick={handleSearchClick}
              className="relative w-8 sm:w-[180px] flex items-center justify-end cursor-pointer"
            >
              <AnimatePresence>
                {!showSearch && (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0"
                  >
                    <Search className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 hover:scale-110" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showSearch && !isMobileOrTablet && (
                  <motion.input
                    key="input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 160, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="Buscar..."
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-9 px-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 shadow-sm transition-colors duration-200"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setIsSearchFocused(false);
                      if (!isMobileOrTablet) setShowSearch(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        if (value.trim()) {
                          const query = encodeURIComponent(value.trim());
                          navigate(`/libros?termino=${query}&filtro=todos`);
                          setShowSearch(false);
                        }
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Quick Access */}
            <div className="hidden sm:block">
              <QuickAccess />
            </div>

            {/* Notifications - Nuevo componente integrado */}
            {showNotifications && isAuth && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}

            {/* User */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuState((prev) => ({ ...prev, user: !prev.user, notifications: false }));
                  if (menuState.user) {
                    setIsAdminDropdownOpen(false);
                  }
                }}
                className="focus:outline-none"
              >
                <motion.div className="inline-block" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200" />
                </motion.div>
              </button>
              <AnimatePresence>
                {menuState.user && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded shadow-lg dark:shadow-gray-900/50 z-50 border border-gray-100 dark:border-gray-700 transition-colors duration-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {isAuth ? (
                      <>
                        <Link to="/perfil" className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                          Perfil
                        </Link>
                        <Link to="/favoritos" className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                          Mis Favoritos
                        </Link>
                        <Link to="/configuracion" className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                          Configuración
                        </Link>
                        {isAdmin() && (
                          <>
                            <button
                              onClick={() => setIsAdminDropdownOpen((prev) => !prev)}
                              className="w-full flex items-center justify-between px-4 py-2 bg-slate-100/80 dark:bg-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                            >
                              <span className="font-medium">Administrador</span>
                              {isAdminDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            <AnimatePresence>
                              {isAdminDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <Link to="/admin/moderation" className="block pl-8 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200">
                                    Moderación
                                  </Link>
                                  <Link to="/admin/catalogo" className="block pl-8 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200">
                                    Administrar Catálogo
                                  </Link>
                                  <Link to="/admin/newsletter" className="block pl-8 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200">
                                    Newsletter
                                  </Link>
                                  <Link to="/admin/crear-libro" className="block pl-8 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200">
                                    Crear Libro
                                  </Link>
                                  <Link to="/admin/crear-saga" className="block pl-8 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200">
                                    Crear Saga
                                  </Link>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                        <button
                          onClick={() => {
                            logoutUser();
                            navigate('/');
                            setMenuState(prev => ({ ...prev, user: false }));
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/LoginPage" className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                          Iniciar sesión
                        </Link>
                        <Link to="/LoginPage" className="block px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                          Registrarse
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden focus:outline-none">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600 dark:text-gray-400" /> : <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
            </button>

            {/* Theme Toggle - Pegado al borde derecho absoluto */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>


      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop con blur */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu deslizante */}
            <motion.nav
              className="lg:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl z-50 overflow-y-auto max-h-[calc(100vh-4rem)]"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
            <ul className="flex flex-col px-4 py-2 space-y-2">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors duration-200 ${
                        isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold'
                          : 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
              {isAuth && (
                <>
                  <li>
                    <Link
                      to="/favoritos"
                      className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Star className="w-5 h-5" />
                      <span>Mis Favoritos</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/configuracion"
                      className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-green-100 hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Configuración</span>
                    </Link>
                  </li>
                  {isAdmin() && (
                    <>
                      <li>
                        <button
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                          onClick={() => setIsMobileAdminOpen((prev) => !prev)}
                        >
                          <span className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span>Administrador</span>
                          </span>
                          {isMobileAdminOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </li>
                      <AnimatePresence>
                        {isMobileAdminOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <li>
                              <Link
                                to="/admin/moderation"
                                className="flex items-center space-x-2 px-8 py-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span>Moderación</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/admin/catalogo"
                                className="flex items-center space-x-2 px-8 py-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span>Administrar Catálogo</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/admin/newsletter"
                                className="flex items-center space-x-2 px-8 py-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span>Newsletter</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/admin/crear-libro"
                                className="flex items-center space-x-2 px-8 py-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span>Crear Libro</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/admin/crear-saga"
                                className="flex items-center space-x-2 px-8 py-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span>Crear Saga</span>
                              </Link>
                            </li>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </>
              )}
              {!isAuth && (
                <>
                  <li>
                    <Link
                      to="/LoginPage"
                      className="block px-3 py-2 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/LoginPage"
                      className="block px-3 py-2 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
