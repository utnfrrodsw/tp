import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';

interface CompartirLibroProps {
  libroId: number;
  titulo: string;
  autores: string[];
}

export const CompartirLibro: React.FC<CompartirLibroProps> = ({
  libroId,
  titulo,
  autores
}) => {
  const [abierto, setAbierto] = useState(false);
  
  // URL del libro (ajustar según tu dominio en producción)
  const url = `${window.location.origin}/libros/${libroId}`;
  
  // Texto para compartir
  const texto = `📚 ¡Mira "${titulo}" de ${autores.join(', ')}! Una recomendación perfecta para ti.`;
  
  // Hashtags
  const hashtags = ['LibrosRecomendados', 'Lectura'];

  return (
    <div className="relative">
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAbierto(!abierto);
        }}
        className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border-2 border-purple-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Compartir libro"
      >
        <Share2 className="w-4 h-4 text-purple-600" />
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAbierto(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Compartir libro
                </h3>
                <button
                  onClick={() => setAbierto(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Información del libro */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">{titulo}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{autores.join(', ')}</p>
              </div>

              {/* Botones de redes sociales */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Compartir en:</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Facebook */}
                  <FacebookShareButton
                    url={url}
                    hashtag="#LibrosRecomendados"
                  >
                    <motion.div
                      className="flex items-center gap-2 p-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FacebookIcon size={24} round />
                      <span className="text-white font-semibold text-sm">Facebook</span>
                    </motion.div>
                  </FacebookShareButton>

                  {/* Twitter */}
                  <TwitterShareButton
                    url={url}
                    title={texto}
                    hashtags={hashtags}
                  >
                    <motion.div
                      className="flex items-center gap-2 p-3 bg-[#1DA1F2] hover:bg-[#1A94DA] rounded-xl transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TwitterIcon size={24} round />
                      <span className="text-white font-semibold text-sm">Twitter</span>
                    </motion.div>
                  </TwitterShareButton>

                  {/* WhatsApp */}
                  <WhatsappShareButton
                    url={url}
                    title={texto}
                  >
                    <motion.div
                      className="flex items-center gap-2 p-3 bg-[#25D366] hover:bg-[#22C55E] rounded-xl transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <WhatsappIcon size={24} round />
                      <span className="text-white font-semibold text-sm">WhatsApp</span>
                    </motion.div>
                  </WhatsappShareButton>

                  {/* Telegram */}
                  <TelegramShareButton
                    url={url}
                    title={texto}
                  >
                    <motion.div
                      className="flex items-center gap-2 p-3 bg-[#0088CC] hover:bg-[#007AB8] rounded-xl transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TelegramIcon size={24} round />
                      <span className="text-white font-semibold text-sm">Telegram</span>
                    </motion.div>
                  </TelegramShareButton>
                </div>

                {/* Copiar enlace */}
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    alert('¡Enlace copiado al portapapeles!');
                  }}
                  className="w-full mt-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📋 Copiar enlace
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompartirLibro;
