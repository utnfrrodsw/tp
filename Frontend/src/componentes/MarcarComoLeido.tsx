import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCheck, Check, Loader2 } from 'lucide-react';
import { listaService } from '../services/listaService';

interface MarcarComoLeidoProps {
  libroId: number;
  titulo: string;
  autores: string[];
  descripcion?: string;
  imagen?: string;
  source?: 'hardcover' | 'google';
  onSuccess?: () => void;
}

export const MarcarComoLeido: React.FC<MarcarComoLeidoProps> = ({
  libroId,
  titulo,
  autores,
  descripcion = null,
  imagen = null,
  source = 'hardcover',
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [marcado, setMarcado] = useState(false);
  const [listaLeidosId, setListaLeidosId] = useState<number | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Obtener la lista de "Leídos" al montar el componente
  useEffect(() => {
    const obtenerListaLeidos = async () => {
      try {
        const listas = await listaService.getUserListas();
        const listaLeidos = listas.find(lista => lista.tipo === 'read');
        if (listaLeidos) {
          setListaLeidosId(listaLeidos.id);
          
          // Verificar si el libro ya está en la lista
          const contenido = await listaService.getContenidoLista(listaLeidos.id);
          const yaEstaEnLista = contenido.some(item => item.libro.id === libroId);
          setMarcado(yaEstaEnLista);
        }
      } catch (error) {
        console.error('Error al obtener lista de leídos:', error);
      }
    };

    obtenerListaLeidos();
  }, [libroId]);

  const handleMarcarComoLeido = async () => {
    if (!listaLeidosId || marcado) return;

    setLoading(true);
    try {
      await listaService.addLibroALista(listaLeidosId, {
        id: libroId.toString(),
        titulo,
        autores,
        descripcion,
        imagen,
        enlace: null,
        source
      });
      
      setMarcado(true);
      setMostrarConfirmacion(true);
      
      // Ocultar confirmación después de 3 segundos
      setTimeout(() => {
        setMostrarConfirmacion(false);
      }, 3000);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al marcar como leído:', error);
      alert('Error al marcar como leído. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleMarcarComoLeido();
        }}
        disabled={loading || marcado}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
          marcado
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 border-2 border-green-300'
        }`}
        whileHover={!marcado && !loading ? { scale: 1.05 } : {}}
        whileTap={!marcado && !loading ? { scale: 0.95 } : {}}
        aria-label={marcado ? 'Ya marcado como leído' : 'Marcar como leído'}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Guardando...</span>
          </>
        ) : marcado ? (
          <>
            <Check className="w-4 h-4" />
            <span>✓ Leído</span>
          </>
        ) : (
          <>
            <BookCheck className="w-4 h-4" />
            <span>Marcar leído</span>
          </>
        )}
      </motion.button>

      {/* Confirmación flotante */}
      <AnimatePresence>
        {mostrarConfirmacion && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Check className="w-5 h-5" />
            </motion.div>
            <span className="font-semibold">¡Libro agregado a "Leídos"!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarcarComoLeido;
