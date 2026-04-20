// src/controllers/lista.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Lista, TipoLista } from '../entities/lista.entity';
import { Usuario } from '../entities/usuario.entity';
import { ContenidoLista } from '../entities/contenidoLista.entity';
import { RatingLibro } from '../entities/ratingLibro.entity';
import { ActividadService } from '../services/actividad.service';

interface AuthRequest extends Request {
  user?: { id: number; [key: string]: any };
}

export const getListas = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const listas = await orm.em.find(
      Lista, 
      { usuario: { id: userId } }, 
      { populate: ['contenidos.libro.autor', 'contenidos.libro.categoria', 'usuario'] }
    );
    res.json(listas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listas' });
  }
};

export const getListaById = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const listaId = +req.params.id;
    
    // Query params para filtros y ordenamiento
    const { orderBy, filterAutor, filterCategoria, filterRating, search } = req.query;
    
    const lista = await orm.em.findOne(
      Lista, 
      { id: listaId },
      { populate: ['contenidos.libro.autor', 'contenidos.libro.categoria', 'usuario'] }
    );
    
    if (!lista) return res.status(404).json({ error: 'No encontrada' });
    
    // Aplicar filtros y ordenamiento en los contenidos
    let contenidos = lista.contenidos.getItems();
    
    // Filtro por autor
    if (filterAutor) {
      contenidos = contenidos.filter(c => 
        c.libro.autor && 
        `${c.libro.autor.nombre} ${c.libro.autor.apellido}`.toLowerCase().includes(String(filterAutor).toLowerCase())
      );
    }
    
    // Filtro por categoría
    if (filterCategoria) {
      contenidos = contenidos.filter(c => 
        c.libro.categoria && 
        c.libro.categoria.nombre.toLowerCase().includes(String(filterCategoria).toLowerCase())
      );
    }
    
    // Filtro por rating mínimo
    if (filterRating) {
      const minRating = +filterRating;
      
      const contenidosFiltrados = [];
      for (const contenido of contenidos) {
        const rating = await orm.em.findOne(RatingLibro, { libro: { id: contenido.libro.id } });
        if (rating && rating.avgRating >= minRating) {
          contenidosFiltrados.push(contenido);
        }
      }
      contenidos = contenidosFiltrados;
    }
    
    // Búsqueda por título
    if (search) {
      contenidos = contenidos.filter(c => 
        c.libro.nombre && c.libro.nombre.toLowerCase().includes(String(search).toLowerCase())
      );
    }
    
    // Ordenamiento
    switch(orderBy) {
      case 'alfabetico':
        contenidos.sort((a, b) => (a.libro.nombre || '').localeCompare(b.libro.nombre || ''));
        break;
      case 'fecha':
        contenidos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'rating':
        // Para ordenar por rating necesitamos obtenerlos
        const ratingsMap = new Map<number, number>();
        
        for (const contenido of contenidos) {
          const rating = await orm.em.findOne(RatingLibro, { libro: { id: contenido.libro.id } });
          ratingsMap.set(contenido.libro.id, rating?.avgRating || 0);
        }
        
        contenidos.sort((a, b) => {
          const ratingA = ratingsMap.get(a.libro.id) || 0;
          const ratingB = ratingsMap.get(b.libro.id) || 0;
          return ratingB - ratingA;
        });
        break;
      case 'personalizado':
        contenidos.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
        break;
      default:
        // Por defecto: ordenamiento personalizado si existe, sino por fecha
        contenidos.sort((a, b) => {
          if (a.orden !== null && a.orden !== undefined && b.orden !== null && b.orden !== undefined) {
            return a.orden - b.orden;
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
    }
    
    res.json({ ...lista, contenidos });
  } catch (error) {
    console.error('Error al obtener lista:', error);
    res.status(500).json({ error: 'Error al obtener lista' });
  }
};

export const createLista = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const usuario = await orm.em.findOne(Usuario, { id: userId });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { nombre, tipo } = req.body;
    if (!nombre || !tipo) return res.status(400).json({ error: 'Nombre y tipo requeridos' });

    // Para listas predefinidas (read, to_read, pending), verificar por tipo
    // Para listas custom, verificar por nombre
    const esListaPredefinida = ['read', 'to_read', 'pending'].includes(tipo);
    
    let listaExistente;
    if (esListaPredefinida) {
      // Para listas predefinidas, buscar por tipo (solo puede haber una por usuario)
      listaExistente = await orm.em.findOne(Lista, {
        tipo: tipo as TipoLista,
        usuario: { id: userId }
      });
    } else {
      // Para listas custom, buscar por nombre
      listaExistente = await orm.em.findOne(Lista, {
        nombre,
        usuario: { id: userId }
      });
    }

    if (listaExistente) {
      return res.status(200).json(listaExistente); // Devolver la lista existente en lugar de error
    }

    const lista = orm.em.create(Lista, {
      nombre,
      tipo: tipo as TipoLista,
      usuario,
      createdAt: new Date(),
      ultimaModificacion: new Date()
    });
    await orm.em.persistAndFlush(lista);

    // Crear registro de actividad
    try {
      const actividadService = new ActividadService(orm);
      await actividadService.crearActividadLista(userId);
    } catch (actividadError) {
      console.error('Error al crear registro de actividad:', actividadError);
      // No fallar la creación de lista si falla el registro de actividad
    }

    res.status(201).json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lista' });
  }
};

export const updateLista = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = await orm.em.findOne(Lista, { id: +req.params.id });
  if (!lista) return res.status(404).json({ error: 'No encontrada' });

  // Check authentication
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  // Check ownership
  if (lista.usuario.id !== userId) {
    return res.status(403).json({ error: 'No autorizado para modificar esta lista' });
  }

  orm.em.assign(lista, req.body);
  await orm.em.flush();
  res.json(lista);
};

export const deleteLista = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = await orm.em.findOne(Lista, { id: +req.params.id });
  if (!lista) return res.status(404).json({ error: 'No encontrada' });

  // Check authentication
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  // Check ownership
  if (lista.usuario.id !== userId) {
    return res.status(403).json({ error: 'No autorizado para eliminar esta lista' });
  }

  await orm.em.removeAndFlush(lista);
  res.json({ mensaje: 'Eliminada' });
};

// Reordenar libros en una lista (drag & drop)
export const reordenarLista = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const listaId = +req.params.id;
    const userId = req.user?.id;
    
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const lista = await orm.em.findOne(Lista, { id: listaId });
    if (!lista) return res.status(404).json({ error: 'Lista no encontrada' });

    // Verificar ownership
    if (lista.usuario.id !== userId) {
      return res.status(403).json({ error: 'No autorizado para modificar esta lista' });
    }

    // Esperar array de { libroId, orden }
    const { ordenamiento } = req.body; // Array: [{ libroId: 1, orden: 0 }, { libroId: 3, orden: 1 }, ...]
    if (!Array.isArray(ordenamiento)) {
      return res.status(400).json({ error: 'Se requiere un array de ordenamiento' });
    }

    // Actualizar cada contenido con su nuevo orden
    for (const item of ordenamiento) {
      const contenido = await orm.em.findOne(ContenidoLista, {
        lista: { id: listaId },
        libro: { id: item.libroId }
      });

      if (contenido) {
        contenido.orden = item.orden;
      }
    }

    await orm.em.flush();
    res.json({ mensaje: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al reordenar lista:', error);
    res.status(500).json({ error: 'Error al reordenar lista' });
  }
};
