import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  BookOpen,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturesSection from "./FeaturesSection";
import { API_BASE_URL } from "../config/api.config";

interface FooterProps {
  siteName?: string;
  showSocialMedia?: boolean;
  showNewsletter?: boolean;
  showFeatures?: boolean;
  showStats?: boolean;
  customLinks?: Array<{ title: string; links: Array<{ name: string; href: string }> }>;
}

// Componente de contador animado
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({
  end,
  duration = 2,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Componente de Newsletter mejorado
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nombre: nombre || undefined }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setNombre('');
        
        
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Error al suscribirse');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
      setStatus('error');
      setErrorMessage('Error de conexión. Intenta de nuevo.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 py-16 shadow-xl relative overflow-hidden"
    >
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-12 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="inline-block mb-4"
        >
          <Mail className="w-16 h-16 mx-auto drop-shadow-lg" />
        </motion.div>

        <h3 className="text-4xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          📚 Únete a Nuestra Comunidad
        </h3>
        <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-50">
          Recibe recomendaciones personalizadas, novedades exclusivas y descuentos especiales directamente en tu inbox. ¡Más de 10,000 lectores ya se unieron!
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="w-20 h-20 text-green-300" />
              </motion.div>
              <h4 className="text-2xl font-bold">¡Bienvenido a bordo! 🎉</h4>
              <p className="text-blue-100">Revisa tu email para confirmar tu suscripción</p>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div
              key="error"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <h4 className="text-2xl font-bold">Oops...</h4>
              <p className="text-blue-100">{errorMessage}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="w-full px-4 py-4 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/50 transition shadow-xl"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/50 transition shadow-xl"
                    disabled={status === 'loading'}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-xl bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-300 font-bold px-8 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === 'loading' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      Enviando...
                    </>
                  ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Suscribirse Gratis
                  </>
                )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {status === 'idle' && (
          <p className="mt-4 text-sm text-blue-100">
            ✨ Sin spam. Cancela cuando quieras.
          </p>
        )}
      </div>
    </motion.div>
  );
};




export const Footer: React.FC<FooterProps> = ({
  siteName = "TPDSW-Libros",
  showSocialMedia = true,
  showNewsletter = true,
  showFeatures = true,
  showStats = true,
  customLinks = [],
}) => {
  const defaultLinks = [
    {
      title: "Explorar",
      links: [
        { name: "Catálogo de Libros", href: "/libros" },
        { name: "Nuevos Lanzamientos", href: "/libros/nuevos" },
        { name: "Libros Populares", href: "/libros/populares" },
        { name: "Libros Recomendados", href: "/libros/recomendados" },
        { name: "Autores", href: "/autores" },
        { name: "Sagas", href: "/sagas" },
        { name: "Categorías", href: "/categorias" },
      ],
    },
    {
      title: "Mi Cuenta",
      links: [
        { name: "Mi Perfil", href: "/perfil" },
        { name: "Mis Favoritos", href: "/favoritos" },
        { name: "Actividad", href: "/feed" },
        { name: "Siguiendo", href: "/siguiendo" },
        { name: "Configuración", href: "/configuracion" },
      ],
    },
    {
      title: "Crear",
      links: [
        { name: "Crear Libro", href: "/crear-libro" },
      ],
    },
  ];

  const linksToShow = customLinks.length > 0 ? customLinks : defaultLinks;

  const socialMedia = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-[#3b5998]" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-[#1da1f2]" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-[#e4405f]" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-[#ff0000]" },
  ];

  return (
    <>
      <style>{`
        .shine-text {
          background: linear-gradient(
            90deg,
            #39FF14,
            #32CD32,
            #00FF7F,
            #32CD32,
            #39FF14
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white select-none overflow-hidden relative z-10">
        {/* Newsletter mejorado */}
        {showNewsletter && <NewsletterSection />}

        {/* Features */}
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FeaturesSection />
          </motion.div>
        )}

        <div className="py-14 max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Animación pulso para el nombre del sitio con color verde flúor */}
            <motion.h2
              className="text-4xl font-extrabold shine-text select-text cursor-default"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {siteName}
            </motion.h2>
            <p className="text-gray-400 dark:text-gray-400 max-w-md leading-relaxed select-text">
              Plataforma para descubrir, reseñar y compartir libros. Únete a la comunidad y encuentra tu próxima lectura favorita.
            </p>

            <div className="space-y-3 text-gray-400 dark:text-gray-400">
              {[
                { icon: Mail, text: "contacto@tpdsw.com" },
                { icon: Phone, text: "+54 9 11 1234 5678" },
                { icon: MapPin, text: "Rosario, Argentina" },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, color: "#fff" }}
                  className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer select-text"
                >
                  <Icon className="w-5 h-5" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>

            {showSocialMedia && (
              <div className="flex space-x-4 mt-6">
                {socialMedia.map(({ icon: Icon, href, label, color }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700 dark:bg-gray-800/30 dark:hover:bg-gray-700/50 shadow-lg backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all group ${color}`}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Links Section con interacción mejorada sin subrayado pero interactiva */}
          {linksToShow.map(({ title, links }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-300 dark:text-gray-300 select-text">{title}</h3>
              <ul className="space-y-4">
                {links.map(({ name, href }, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: 0 }}
                    whileHover={{ scale: 1.05, x: 6 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="cursor-pointer flex items-center gap-2 select-text"
                    title={`Ir a ${name}`}
                  >
                    <Link
                      to={href}
                      className="flex items-center gap-1 text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-colors duration-200 no-underline"
                    >
                      {name}
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        aria-hidden="true"
                        className="text-blue-400"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-sm select-text">
            <p>© 2025 TPDSW-COM304. Todos los derechos reservados.</p>
            <nav className="flex space-x-8 mt-3 md:mt-0">
              {["Política de Cookies", "Accesibilidad", "Sitemap"].map(
                (link, i) => (
                  <a
                    key={i}
                    href="#"
                    className="hover:text-white transition-colors duration-200 cursor-pointer select-text"
                  >
                    {link}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};
