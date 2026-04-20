import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Favorito } from '../entities/favorito.entity';
import { Libro } from '../entities/libro.entity';
import { RatingLibro } from '../entities/ratingLibro.entity';
import { ActividadService } from '../services/actividad.service';
import { Autor } from '../entities/autor.entity';
import { AuthRequest } from '../middleware/auth.middleware';
import { getBookById } from '../services/googleBooks.service';

export const getFavoritos = async (req: AuthRequest, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const usuarioId = req.user?.id;
  const em = orm.em.fork(); // Usar un fork para posibles escrituras

  if (!usuarioId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  const favoritos = await orm.em.find(Favorito, {
    usuario: { id: usuarioId }
  }, {
    populate: ['libro.autor', 'libro.categoria']
  });

  // Get ratings for all libros
  const libroIds = favoritos.map(fav => fav.libro.id);
  const ratings = await orm.em.find(RatingLibro, { libro: { $in: libroIds } });
  const ratingMap = new Map(ratings.map(r => [r.libro.id, r.avgRating]));

  // Transformar libros con autocorrección de autores
  const result = await Promise.all(favoritos.map(async fav => {
    let autores = ['Autor desconocido'];

    if (fav.libro.autor) {
      autores = [`${fav.libro.autor.nombre} ${fav.libro.autor.apellido}`.trim() || 'Autor desconocido'];
    } else if (fav.libro.externalId) { // Si no hay autor pero sí ID externo, intentamos arreglarlo
      try {
        const googleBook = await getBookById(fav.libro.externalId);
        if (googleBook && googleBook.autores && googleBook.autores.length > 0) {
          autores = googleBook.autores;

          // --- LÓGICA DE AUTOCORRECCIÓN ---
          // 1. Buscar o crear el autor
          const autorNombreCompleto = googleBook.autores[0];
          const partesNombre = autorNombreCompleto.split(' ');
          const nombre = partesNombre[0] || autorNombreCompleto;
          const apellido = partesNombre.slice(1).join(' ') || '';

          let autorEntity = await em.findOne(Autor, { nombre, apellido });
          if (!autorEntity) {
            autorEntity = em.create(Autor, { nombre, apellido, createdAt: new Date() });
            await em.persist(autorEntity);
          }
          // 2. Asignar el autor al libro y guardar el cambio
          fav.libro.autor = autorEntity;
          await em.flush(); // Guardamos los cambios en la BD
        }
      } catch (error) {
        console.error('Error fetching author from Google Books:', error);
      }
    }

    return {
      id: fav.id, // ID del favorito
      libroId: fav.libro.id, // ID interno numérico del libro
      titulo: fav.libro.nombre,
      autores,
      categoria: fav.libro.categoria?.nombre || 'Sin categoría',
      rating: ratingMap.get(fav.libro.id) || 0,
      imagen: fav.libro.imagen,
      externalId: fav.libro.externalId,
      source: fav.libro.source,
      fechaAgregado: fav.fechaAgregado
    };
  }));

  res.json(result);
};

export const addFavorito = async (req: AuthRequest, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;

  // 1. OBTENER ID DE USUARIO DEL TOKEN (SEGURO)
  const usuarioId = req.user?.id;

  if (!usuarioId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  // 2. OBTENER DATOS DEL LIBRO DEL BODY
  const { libroData } = req.body;

  if (!libroData || !libroData.externalId || !libroData.source || !libroData.nombre) {
    res.status(400).json({ error: 'Faltan datos esenciales del libro (externalId, source, nombre).' });
    return;
  }

  try {
    // 3. BUSCAR O CREAR EL LIBRO (Tu lógica aquí ya es correcta)
    let libro = await orm.em.findOne(Libro, {
      externalId: libroData.externalId,
      source: libroData.source
    });

    if (!libro) {
      let autor: Autor | undefined;
      if (libroData.autores && libroData.autores.length > 0) {
        const autorNombreCompleto = libroData.autores[0].trim();
        
        // Dividir nombre y apellido correctamente
        const partesNombre = autorNombreCompleto.split(' ');
        const nombre = partesNombre[0] || autorNombreCompleto;
        const apellido = partesNombre.slice(1).join(' ') || '';
        
        // Buscar autor por nombre Y apellido
        autor = await orm.em.findOne(Autor, { nombre, apellido }) ?? undefined;
        
        if (!autor) {
          console.log('📝 Creando nuevo autor en favorito:', { nombre, apellido, nombreCompleto: autorNombreCompleto });
          autor = orm.em.create(Autor, {
            nombre,
            apellido,
            createdAt: new Date()
          });
          await orm.em.persist(autor);
        } else {
          console.log('✅ Autor existente encontrado en favorito:', { id: autor.id, nombre: autor.nombre, apellido: autor.apellido });
        }
      }

      libro = orm.em.create(Libro, {
        externalId: libroData.externalId,
        source: libroData.source,
        nombre: libroData.nombre,
        sinopsis: libroData.sinopsis || null,
        imagen: libroData.imagen || null,
        enlace: libroData.enlace || null,
        autor,
        createdAt: new Date(),
      });
      await orm.em.persistAndFlush(libro);
    }

    const libroId = libro.id; // Obtenemos el ID correcto, ya sea existente o nuevo.

    // 4. CREAR EL FAVORITO (usando el usuarioId del token)
    // ✅ Verificar si ya existe un favorito para este usuario y libro
    const favoritoExistente = await orm.em.findOne(
      Favorito, 
      { 
        usuario: usuarioId, 
        libro: { 
          $or: [
            { id: libroId }, // Buscar por ID interno
            { externalId: libroData.externalId, source: libroData.source } // O por externalId + source
          ]
        } 
      },
      { populate: ['libro'] }
    );

    if (favoritoExistente) {
      console.log('⚠️ Favorito ya existe:', { 
        favoritoId: favoritoExistente.id, 
        libroId: favoritoExistente.libro.id,
        externalId: libroData.externalId 
      });
      res.status(409).json({ 
        error: 'Este libro ya está en tus favoritos.',
        favoritoId: favoritoExistente.id 
      });
      return;
    }

    console.log('✅ Creando nuevo favorito:', { usuarioId, libroId, externalId: libroData.externalId });
    const nuevoFavorito = orm.em.create(Favorito, { usuario: usuarioId, libro: libroId, fechaAgregado: new Date() });
    await orm.em.persistAndFlush(nuevoFavorito);

    // Crear registro de actividad
    try {
      const actividadService = new ActividadService(orm);
      await actividadService.crearActividadFavorito(usuarioId, libroId);
    } catch (actividadError) {
      console.error('Error al crear registro de actividad:', actividadError);
      // No fallar la creación de favorito si falla el registro de actividad
    }

    res.status(201).json({ id: nuevoFavorito.id });

  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteFavorito = async (req: AuthRequest, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;

  // 1. OBTENER ID DE USUARIO DEL TOKEN (SEGURO)
  const usuarioId = req.user?.id;

  if (!usuarioId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  // 2. OBTENER ID DEL FAVORITO DE LOS PARÁMETROS DE LA URL
  const favoritoId = +req.params.favoritoId;

  if (!favoritoId) {
    res.status(400).json({ error: 'El favoritoId es requerido en la URL' });
    return;
  }

  // 3. BUSCAR Y ELIMINAR
  const favorito = await orm.em.findOne(Favorito, {
    id: favoritoId,
    usuario: { id: usuarioId }
  });

  if (!favorito) {
    res.status(404).json({ error: 'Favorito no encontrado' });
    return;
  }

  await orm.em.removeAndFlush(favorito);
  res.status(200).json({ mensaje: 'Favorito eliminado' });
  return;
};
