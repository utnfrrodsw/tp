"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Book, Eye, Bell } from "lucide-react";

const features = [
  {
    title: "Búsqueda Inteligente",
    description:
      "Encuentra libros y autores al instante con filtros avanzados y recomendaciones personalizadas.",
    icon: Book,
    bgColor: "bg-yellow-500",
  },
  {
    title: "Lecturas Virtuales",
    description:
      "Accede a extractos y vistas previas para conocer los libros antes de elegirlos.",
    icon: Eye,
    bgColor: "bg-green-600",
  },
  {
    title: "Alertas en Tiempo Real",
    description:
      "Recibe notificaciones cuando tus autores favoritos publiquen nuevas reseñas o libros.",
    icon: Bell,
    bgColor: "bg-purple-700",
  },
];

export default function FeaturesSection() {
  const [mousePos, setMousePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Para fondo parallax
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });

    // Actualizar springs para parallax
    springX.set(((clientX - windowSize.width / 2) / (windowSize.width / 2)) * 10);
    springY.set(((clientY - windowSize.height / 2) / (windowSize.height / 2)) * 10);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full py-20 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Fondo parallax muy sutil */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          translateX: springX,
          translateY: springY,
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 0, 150, 0.12), transparent 45%)`,
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, x: [0, 15, 0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-blue-600 to-lime-400 dark:from-cyan-300 dark:via-blue-400 dark:to-lime-300 bg-clip-text text-transparent select-text"
        >
          Funcionalidades Destacadas
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => {
            const x = useMotionValue(0);
            const y = useMotionValue(0);

            // Sin rotaciones para que estén derechos
            // Sombra fija y glow con animación suave (no dependiente de mouse)
            const glowOpacity = useTransform(x, [0, windowSize.width], [0.4, 0.6]);

            const Icon = feature.icon;

            return (
              <motion.div
                key={i}
                className={`rounded-3xl p-8 cursor-grab active:cursor-grabbing flex flex-col items-center text-center text-white select-none relative overflow-visible ${feature.bgColor}`}
                style={{
                  boxShadow: `0 5px 20px rgba(0,0,0,0.3)`,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={(e) => {
                  x.set(e.clientX);
                  y.set(e.clientY);
                }}
                onMouseLeave={() => {
                  x.set(windowSize.width / 2);
                  y.set(windowSize.height / 2);
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.3}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
                whileHover={{
                  scale: 1.07,
                  boxShadow: `0 0 40px 10px rgba(255, 255, 255, 0.7)`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow animado fijo */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.4), transparent 50%)`,
                    opacity: glowOpacity,
                    filter: "blur(30px)",
                    zIndex: 5,
                    transition: "opacity 0.3s ease",
                  }}
                />

                <motion.div
                  className="mb-5"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Icon className="w-14 h-14 drop-shadow-lg" />
                </motion.div>

                <h3 className="text-2xl font-semibold mb-3 drop-shadow-md">
                  {feature.title}
                </h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
