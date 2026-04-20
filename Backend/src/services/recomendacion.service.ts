// src/services/recomendacion.service.ts
import { MikroORM } from '@mikro-orm/core';
import { Favorito } from '../entities/favorito.entity';
import { Libro } from '../entities/libro.entity';
import { Resena } from '../entities/resena.entity';
import redis from '../redis';

interface LibroConPuntuacion {
  libro: Libro;
  score: number;
  razon: string;
}

export class RecomendacionService {
  private orm: MikroORM;
  private cacheTTL = 3600; // 1 hora

  constructor(orm: MikroORM) {
    this.orm = orm;
  }

  /**
   * Obtiene recomendaciones personalizadas para un usuario
   * @returns Array de libros con sus puntuaciones
   */
  async getRecomendacionesPersonalizadas(usuarioId: number, limit: number = 10): Promise<LibroConPuntuacion[]> {
    const cacheKey = `recomendaciones:usuario:${usuarioId}`;
    const em = this.orm.em.fork();

    // Intentar obtener del caché
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('📦 Recomendaciones desde caché para usuario:', usuarioId);
          const cachedData = JSON.parse(cached);
          
          // Re-hidratar los libros desde la base de datos
          const librosIds = cachedData.map((item: any) => item.libro?.id).filter(Boolean);
          if (librosIds.length > 0) {
            const libros = await em.find(Libro, 
              { id: { $in: librosIds } },
              { populate: ['autor', 'categoria', 'editorial'] }
            );
            
            // Crear mapa de libros por ID
            const librosMap = new Map(libros.map(libro => [libro.id, libro]));
            
            // Reconstruir recomendaciones con entidades hidratadas
            const recomendaciones = cachedData
              .map((item: any) => ({
                libro: librosMap.get(item.libro?.id),
                score: item.score,
                razon: item.razon
              }))
              .filter((item: any) => item.libro); // Filtrar los que no se encontraron
            
            return recomendaciones;
          }
        }
      } catch (error) {
        console.error('Error al leer caché de recomendaciones:', error);
      }
    }

    console.log('🔍 Calculando recomendaciones para usuario:', usuarioId);

    // 1. Obtener favoritos del usuario
    const favoritos = await em.find(Favorito, 
      { usuario: usuarioId }, 
      { populate: ['libro.categoria', 'libro.autor'] }
    );

    // 2. Obtener reseñas del usuario (solo bien calificadas)
    const resenas = await em.find(Resena, 
      { usuario: usuarioId, estrellas: { $gte: 4 } },
      { populate: ['libro.categoria', 'libro.autor'] }
    );

    // Si el usuario no tiene actividad, retornar libros populares
    if (favoritos.length === 0 && resenas.length === 0) {
      console.log('👤 Usuario nuevo - mostrando libros populares');
      const populares = await this.getLibrosPopulares(limit);
      const popularesConScore: LibroConPuntuacion[] = populares.map(libro => ({
        libro,
        score: 0.5, // Score base para libros populares
        razon: 'Libro popular'
      }));
      this.cacheRecomendaciones(cacheKey, popularesConScore);
      return popularesConScore;
    }

    // 3. Analizar preferencias
    const preferencias = this.analizarPreferencias(favoritos, resenas);

    // 4. Obtener IDs de libros ya conocidos por el usuario
    const librosConocidos = new Set<number>();
    favoritos.forEach(f => librosConocidos.add(f.libro.id));
    resenas.forEach(r => librosConocidos.add(r.libro.id));

    // 5. Buscar libros candidatos
    const candidatos = await this.buscarCandidatos(em, preferencias, Array.from(librosConocidos));

    // Si no hay suficientes candidatos, mezclar con populares
    if (candidatos.length < limit) {
      console.log(`⚠️ Solo ${candidatos.length} candidatos - mezclando con populares`);
      const populares = await this.getLibrosPopulares(limit - candidatos.length);
      const idsExistentes = new Set(candidatos.map(c => c.id));
      const popularesNuevos = populares.filter(p => !idsExistentes.has(p.id));
      candidatos.push(...popularesNuevos);
    }

    // 7. Calcular puntuaciones
    const librosConScore = this.calcularPuntuaciones(candidatos, preferencias);

    // 8. Ordenar por score y limitar
    const recomendaciones = librosConScore
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cachear resultado
    this.cacheRecomendaciones(cacheKey, recomendaciones);

    console.log('✅ Recomendaciones calculadas:', recomendaciones.length);
    return recomendaciones;
  }

  /**
   * Analiza las preferencias del usuario
   */
  private analizarPreferencias(
    favoritos: Favorito[], 
    resenas: Resena[]
  ) {
    const categoriasCount: Record<number, number> = {};
    const autoresCount: Record<number, number> = {};
    let totalActividad = 0;

    // Analizar favoritos (peso 3)
    favoritos.forEach(fav => {
      if (fav.libro.categoria) {
        categoriasCount[fav.libro.categoria.id] = (categoriasCount[fav.libro.categoria.id] || 0) + 3;
      }
      if (fav.libro.autor) {
        autoresCount[fav.libro.autor.id] = (autoresCount[fav.libro.autor.id] || 0) + 3;
      }
      totalActividad += 3;
    });

    // Analizar reseñas (peso 2, con peso adicional por estrellas)
    resenas.forEach(res => {
      const pesoResena = res.estrellas ? 2 + (res.estrellas - 3) * 0.5 : 2; // 4 estrellas = 2.5, 5 estrellas = 3
      
      if (res.libro.categoria) {
        categoriasCount[res.libro.categoria.id] = (categoriasCount[res.libro.categoria.id] || 0) + pesoResena;
      }
      if (res.libro.autor) {
        autoresCount[res.libro.autor.id] = (autoresCount[res.libro.autor.id] || 0) + pesoResena;
      }
      totalActividad += pesoResena;
    });

    // Ordenar por frecuencia
    const categoriasOrdenadas = Object.entries(categoriasCount)
      .sort(([, a], [, b]) => b - a)
      .map(([id, count]) => ({ id: Number(id), weight: count / totalActividad }));

    const autoresOrdenados = Object.entries(autoresCount)
      .sort(([, a], [, b]) => b - a)
      .map(([id, count]) => ({ id: Number(id), weight: count / totalActividad }));

    return {
      categorias: categoriasOrdenadas,
      autores: autoresOrdenados,
      totalActividad
    };
  }

  /**
   * Busca libros candidatos basados en preferencias
   */
  private async buscarCandidatos(
    em: any,
    preferencias: any,
    librosConocidos: number[]
  ): Promise<Libro[]> {
    const categoriasIds = preferencias.categorias.slice(0, 3).map((c: any) => c.id);
    const autoresIds = preferencias.autores.slice(0, 3).map((a: any) => a.id);

    // Buscar libros de categorías y autores preferidos
    const candidatos = await em.find(Libro, {
      $or: [
        { categoria: { $in: categoriasIds } },
        { autor: { $in: autoresIds } }
      ],
      id: { $nin: librosConocidos }
    }, {
      populate: ['categoria', 'autor'],
      limit: 50 // Buscar más candidatos para filtrar después
    });

    return candidatos;
  }

  /**
   * Calcula puntuaciones para cada libro candidato
   */
  private calcularPuntuaciones(
    candidatos: Libro[],
    preferencias: any
  ): LibroConPuntuacion[] {
    const scores = candidatos.map(libro => {
      let score = 0;
      let razon = '';

      // Puntuación por categoría (máx 50 puntos)
      if (libro.categoria) {
        const categoriaMatch = preferencias.categorias.find((c: any) => c.id === libro.categoria!.id);
        if (categoriaMatch) {
          const puntosCat = categoriaMatch.weight * 50;
          score += puntosCat;
          razon += `Categoría: ${libro.categoria.nombre} (+${puntosCat.toFixed(0)}) `;
        }
      }

      // Puntuación por autor (máx 30 puntos)
      if (libro.autor) {
        const autorMatch = preferencias.autores.find((a: any) => a.id === libro.autor!.id);
        if (autorMatch) {
          const puntosAut = autorMatch.weight * 30;
          score += puntosAut;
          razon += `Autor: ${libro.autor.nombre} (+${puntosAut.toFixed(0)}) `;
        }
      }

      // Bonus por recencia (máx 20 puntos)
      if (libro.createdAt) {
        const diasDesdeCreacion = (Date.now() - libro.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (diasDesdeCreacion < 30) {
          score += 20;
          razon += 'Nuevo (+20) ';
        } else if (diasDesdeCreacion < 90) {
          score += 10;
          razon += 'Reciente (+10) ';
        }
      }

      return { libro, score, razon: razon.trim() || 'Match general' };
    });

    // Normalizar scores a rango 0-1
    const maxScore = Math.max(...scores.map(s => s.score), 1);
    return scores.map(item => ({
      ...item,
      score: item.score / maxScore
    }));
  }

  /**
   * Obtiene libros populares como fallback
   */
  private async getLibrosPopulares(limit: number): Promise<Libro[]> {
    const em = this.orm.em.fork();
    
    // Obtener libros variados (recientes primero, luego mezclar aleatoriamente)
    const libros = await em.find(Libro, {}, {
      populate: ['categoria', 'autor'],
      orderBy: { createdAt: 'DESC' },
      limit: Math.max(limit * 3, 30) // Obtener más para tener variedad
    });

    // Si no hay libros en la BD, retornar array vacío
    if (libros.length === 0) {
      console.log('⚠️ No hay libros en la base de datos');
      return [];
    }

    // Mezclar aleatoriamente para que cada usuario vea diferentes libros
    const mezclados = libros.sort(() => Math.random() - 0.5);
    
    return mezclados.slice(0, limit);
  }

  /**
   * Cachea las recomendaciones en Redis
   */
  private async cacheRecomendaciones(key: string, libros: LibroConPuntuacion[]) {
    if (redis) {
      try {
        await redis.setex(key, this.cacheTTL, JSON.stringify(libros));
        console.log('✅ Recomendaciones cacheadas:', key);
      } catch (error) {
        console.error('Error al cachear recomendaciones:', error);
      }
    }
  }

  /**
   * Invalida el caché de recomendaciones para un usuario
   */
  async invalidarCache(usuarioId: number) {
    const cacheKey = `recomendaciones:usuario:${usuarioId}`;
    if (redis) {
      try {
        await redis.del(cacheKey);
        console.log('🗑️ Caché de recomendaciones invalidado para usuario:', usuarioId);
      } catch (error) {
        console.error('Error al invalidar caché:', error);
      }
    }
  }
}
