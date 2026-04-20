// InteractiveSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InteractiveSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Fondo que sigue el mouse */}
      <motion.div
        className="absolute w-[150%] h-[150%] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-3xl"
        animate={{
          x: mousePosition.x / 10 - 200,
          y: mousePosition.y / 10 - 200,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <motion.h1
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Bienvenido a la Experiencia Interactiva
        </motion.h1>

        <motion.p
          className="text-lg max-w-xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Mueve el mouse y observa cómo reacciona el fondo con un efecto fluido
          y dinámico. Todo esto funciona con <b>Framer Motion</b> y está
          perfectamente tipado en TypeScript.
        </motion.p>

        <motion.button
          className="mt-10 px-6 py-3 bg-purple-600 rounded-full shadow-lg hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ¡Probar Ahora!
        </motion.button>
      </div>
    </div>
  );
}
