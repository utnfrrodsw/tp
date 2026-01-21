import { useState, useEffect, useCallback } from 'react';
import { subastaService } from '../services/api';
import type { Subasta, SubastaFiltro } from '../types';

export const useAuctions = (filtros: SubastaFiltro = {}) => {
  const [subastas, setSubastas] = useState<Subasta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchSubastas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await subastaService.getAll(filtros);
      
      setSubastas(result.data);
      setCount(result.count);
    } catch (err) {
      console.error('Error al cargar subastas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar subastas');
    } finally {
      setLoading(false);
    }
  }, [filtros]); 

  useEffect(() => {
    fetchSubastas();
  }, [fetchSubastas]);

  const refetch = () => {
    fetchSubastas();
  };

  return {
    subastas,
    loading,
    error,
    count,
    refetch
  };
};