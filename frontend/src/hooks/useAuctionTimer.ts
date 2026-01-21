import { useState, useEffect, useCallback } from 'react';
import type { SubastaStats } from '../types';

export const useAuctionTimer = (fechaFin: Date | string) => {
  const [stats, setStats] = useState<SubastaStats>({
    tiempoRestante: {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0,
      total: 0
    },
    finalizada: false,
    puedeOfertar: true
  });

  const calcularTiempo = useCallback(() => {
    const ahora = new Date().getTime();
    const fin = new Date(fechaFin).getTime();
    const diferencia = fin - ahora;

    if (diferencia <= 0) {
      return {
        tiempoRestante: {
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
          total: 0
        },
        finalizada: true,
        puedeOfertar: false
      };
    }

    const segundos = Math.floor((diferencia / 1000) % 60);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    return {
      tiempoRestante: {
        dias,
        horas,
        minutos,
        segundos,
        total: diferencia
      },
      finalizada: false,
      puedeOfertar: diferencia > 0
    };
  }, [fechaFin]);

  useEffect(() => {
    setStats(calcularTiempo());
    const intervalo = setInterval(() => {
      setStats(calcularTiempo());
    }, 1000);

    return () => clearInterval(intervalo);
  }, [calcularTiempo]);

  return stats;
};