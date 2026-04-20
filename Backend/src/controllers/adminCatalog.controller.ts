import { Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Libro } from '../entities/libro.entity';
import { Autor } from '../entities/autor.entity';
import { AuthRequest } from '../middleware/auth.middleware';

const parsePagination = (query: any) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  return { page, limit, offset: (page - 1) * limit };
};

const parseEstado = (estado: unknown): 'todos' | 'activo' | 'inactivo' => {
  if (estado === 'activo' || estado === 'inactivo' || estado === 'todos') {
    return estado;
  }
  return 'todos';
};

export const getAdminCatalogLibros = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { page, limit, offset } = parsePagination(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const estado = parseEstado(req.query.estado);

    const where: any = {
      createdByAdmin: true,
    };

    if (estado === 'activo') where.activo = true;
    if (estado === 'inactivo') where.activo = false;

    if (search) {
      where.$and = [
        {
          $or: [
            { nombre: { $like: `%${search}%` } },
            { slug: { $like: `%${search}%` } },
            { autor: { nombre: { $like: `%${search}%` } } },
            { autor: { apellido: { $like: `%${search}%` } } },
          ],
        },
      ];
    }

    const [libros, total] = await em.findAndCount(Libro, where, {
      populate: ['autor', 'categoria', 'editorial', 'saga'],
      orderBy: { createdAt: 'DESC' },
      limit,
      offset,
    });

    return res.json({
      data: libros.map((libro) => ({
        id: libro.id,
        nombre: libro.nombre,
        slug: libro.slug,
        imagen: libro.imagen,
        sinopsis: libro.sinopsis,
        enlace: libro.enlace,
        activo: libro.activo,
        deletedAt: libro.deletedAt,
        createdAt: libro.createdAt,
        autor: libro.autor
          ? {
              id: libro.autor.id,
              nombre: libro.autor.nombre,
              apellido: libro.autor.apellido,
              foto: libro.autor.foto,
              biografia: libro.autor.biografia,
            }
          : null,
        categoria: libro.categoria
          ? { id: libro.categoria.id, nombre: libro.categoria.nombre }
          : null,
        editorial: libro.editorial
          ? { id: libro.editorial.id, nombre: libro.editorial.nombre }
          : null,
        saga: libro.saga
          ? { id: libro.saga.id, nombre: libro.saga.nombre }
          : null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error al listar libros administrables:', error);
    return res.status(500).json({ error: 'Error al listar libros administrables' });
  }
};

export const updateAdminCatalogLibro = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const libro = await em.findOne(Libro, {
      id,
      createdByAdmin: true,
    });

    if (!libro) {
      return res.status(404).json({ error: 'Libro administrable no encontrado' });
    }

    const allowedFields = ['nombre', 'sinopsis', 'imagen', 'enlace'];
    const payload: Record<string, any> = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        payload[field] = req.body[field];
      }
    }

    em.assign(libro, payload);
    await em.flush();

    return res.json({
      id: libro.id,
      nombre: libro.nombre,
      sinopsis: libro.sinopsis,
      imagen: libro.imagen,
      enlace: libro.enlace,
      activo: libro.activo,
    });
  } catch (error) {
    console.error('Error al actualizar libro administrable:', error);
    return res.status(500).json({ error: 'Error al actualizar libro administrable' });
  }
};

export const updateAdminCatalogLibroEstado = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const id = Number(req.params.id);
    const activo = Boolean(req.body.activo);

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const libro = await em.findOne(Libro, {
      id,
      createdByAdmin: true,
    });

    if (!libro) {
      return res.status(404).json({ error: 'Libro administrable no encontrado' });
    }

    libro.activo = activo;
    libro.deletedAt = activo ? undefined : new Date();
    await em.flush();

    return res.json({
      id: libro.id,
      activo: libro.activo,
      deletedAt: libro.deletedAt || null,
    });
  } catch (error) {
    console.error('Error al cambiar estado del libro:', error);
    return res.status(500).json({ error: 'Error al cambiar estado del libro' });
  }
};

export const getAdminCatalogAutores = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { page, limit, offset } = parsePagination(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const estado = parseEstado(req.query.estado);

    const where: any = {
      createdByAdmin: true,
      googleBooksId: null,
      openLibraryKey: null,
    };

    if (estado === 'activo') where.activo = true;
    if (estado === 'inactivo') where.activo = false;

    if (search) {
      where.$and = [
        {
          $or: [
            { nombre: { $like: `%${search}%` } },
            { apellido: { $like: `%${search}%` } },
          ],
        },
      ];
    }

    const [autores, total] = await em.findAndCount(Autor, where, {
      orderBy: { createdAt: 'DESC' },
      limit,
      offset,
    });

    return res.json({
      data: autores.map((autor) => ({
        id: autor.id,
        nombre: autor.nombre,
        apellido: autor.apellido,
        foto: autor.foto,
        biografia: autor.biografia,
        activo: autor.activo,
        deletedAt: autor.deletedAt,
        createdAt: autor.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error al listar autores administrables:', error);
    return res.status(500).json({ error: 'Error al listar autores administrables' });
  }
};

export const updateAdminCatalogAutor = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const autor = await em.findOne(Autor, {
      id,
      createdByAdmin: true,
      googleBooksId: null,
      openLibraryKey: null,
    });

    if (!autor) {
      return res.status(404).json({ error: 'Autor administrable no encontrado' });
    }

    const allowedFields = ['nombre', 'apellido', 'foto', 'biografia'];
    const payload: Record<string, any> = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        payload[field] = req.body[field];
      }
    }

    em.assign(autor, payload);
    await em.flush();

    return res.json({
      id: autor.id,
      nombre: autor.nombre,
      apellido: autor.apellido,
      foto: autor.foto,
      biografia: autor.biografia,
      activo: autor.activo,
    });
  } catch (error) {
    console.error('Error al actualizar autor administrable:', error);
    return res.status(500).json({ error: 'Error al actualizar autor administrable' });
  }
};

export const updateAdminCatalogAutorEstado = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const id = Number(req.params.id);
    const activo = Boolean(req.body.activo);

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const autor = await em.findOne(Autor, {
      id,
      createdByAdmin: true,
      googleBooksId: null,
      openLibraryKey: null,
    }, { populate: ['libros'] });

    if (!autor) {
      return res.status(404).json({ error: 'Autor administrable no encontrado' });
    }

    // Validación: Si se intenta dar de baja (activo = false) y tiene libros activos
    if (!activo && autor.libros && autor.libros.length > 0) {
      const librosActivos = autor.libros.filter(l => l.activo !== false);
      
      if (librosActivos.length > 0) {
        return res.status(409).json({
          error: `No se puede dar de baja un autor con ${librosActivos.length} libro(s) asociado(s)`,
          errorCode: 'AUTHOR_HAS_BOOKS',
          booksCount: librosActivos.length,
          books: librosActivos.map(l => ({
            id: l.id,
            nombre: l.nombre,
            activo: l.activo,
          })),
        });
      }
    }

    autor.activo = activo;
    autor.deletedAt = activo ? undefined : new Date();
    await em.flush();

    return res.json({
      id: autor.id,
      activo: autor.activo,
      deletedAt: autor.deletedAt || null,
    });
  } catch (error) {
    console.error('Error al cambiar estado del autor:', error);
    return res.status(500).json({ error: 'Error al cambiar estado del autor' });
  }
};
