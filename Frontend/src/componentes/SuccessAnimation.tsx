import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Star, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  type?: 'check' | 'heart' | 'star' | 'sparkles';
  message?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  show, 
  onComplete,
  type = 'check',
  message = '¡Agregado!'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'heart':
        return <Heart className="w-16 h-16" fill="currentColor" />;
      case 'star':
        return <Star className="w-16 h-16" fill="currentColor" />;
      case 'sparkles':
        return <Sparkles className="w-16 h-16" />;
      default:
        return <Check className="w-16 h-16" strokeWidth={3} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'heart':
        return 'from-pink-500 to-red-500';
      case 'star':
        return 'from-yellow-400 to-orange-500';
      case 'sparkles':
        return 'from-purple-500 to-indigo-500';
      default:
        return 'from-green-500 to-emerald-600';
    }
  };

  // Generar partículas de confetti
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: -Math.random() * 400 - 100,
    rotation: Math.random() * 720,
    scale: Math.random() * 0.5 + 0.5,
    color: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc'][Math.floor(Math.random() * 5)]
  }));

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onComplete}
          />
          
          {/* Contenedor central */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            {/* Confetti particles */}
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded"
                style={{ backgroundColor: particle.color }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: particle.scale,
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  x: particle.x,
                  y: particle.y,
                  rotate: particle.rotation,
                  opacity: 0,
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Círculo con icono */}
            <motion.div
              className={`bg-gradient-to-br ${getColor()} text-white rounded-full p-8 shadow-2xl pointer-events-auto`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [180, 0, 0]
              }}
              exit={{ 
                scale: 0,
                rotate: 180,
                opacity: 0
              }}
              transition={{ 
                duration: 0.6,
                ease: "backOut"
              }}
              onAnimationComplete={() => {
                if (onComplete) {
                  setTimeout(onComplete, 1500);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {getIcon()}
              </motion.div>
            </motion.div>

            {/* Mensaje */}
            <motion.p
              className="absolute mt-40 text-2xl font-bold text-white pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.p>

            {/* Círculos de expansión */}
            {[0, 0.2, 0.4].map((delay) => (
              <motion.div
                key={delay}
                className={`absolute w-32 h-32 rounded-full border-4 border-white pointer-events-none`}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: 3,
                  opacity: 0
                }}
                transition={{ 
                  delay,
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Versión compacta para usar en tarjetas/botones
interface MicroAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export const MicroSuccessAnimation: React.FC<MicroAnimationProps> = ({ show, onComplete }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 rounded-xl z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 800);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
