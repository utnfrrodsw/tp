import { useState, useEffect, useCallback } from 'react';
import { subastaService } from '../services/api';
import type { Subasta, Oferta } from '../types';

export const useAuction = (id: number) => {
  const [subasta, setSubasta] = useState<Subasta | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubasta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [subastaData, ofertasData] = await Promise.all([
        subastaService.getById(id),
        subastaService.getOfertas(id) // ✅ Ya usa subastaService, no ofertaService
      ]);
      
      setSubasta(subastaData);
      setOfertas(ofertasData.sort((a, b) => 
        new Date(b.fechaOferta).getTime() - new Date(a.fechaOferta).getTime()
      ));
    } catch (err) {
      console.error('Error al cargar subasta:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar subasta');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSubasta();
    }
  }, [id, fetchSubasta]);

  const refetch = () => {
    fetchSubasta();
  };

  return {
    subasta,
    ofertas,
    loading,
    error,
    refetch
  };
};