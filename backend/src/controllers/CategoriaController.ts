import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Categoria } from '../entities/Categoria';
import { Camiseta } from '../entities/Camiseta';
import { UsuarioRol } from '../entities/Usuario';

export class CategoriaController {
  
  // GET /api/categorias
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const categorias = await em.find(Categoria, { activa: true });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: categorias,
        count: categorias.length
      });
    } catch (error) {
      console.error('Error en getAll categorias:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener categorías: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/categorias/:id
  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const categoria = await em.findOne(Categoria, { id: parseInt(id), activa: true });
      
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener categoría: categoría no encontrada.',
          error: 'Categoría no encontrada',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getOne realizada correctamente.',
        data: categoria
      });
    } catch (error) {
      console.error('Error en getOne categoria:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener categoría: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'GETONE_ERROR'
      });
    }
  }

  // POST /api/categorias
  static async create(req: Request, res: Response) {
    try {
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo crear categoría: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo crear categoría: solo administradores pueden crear categorías.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear categoría: el nombre es obligatorio.',
          error: 'Nombre obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (nombre.length < 2 || nombre.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear categoría: el nombre debe tener entre 2 y 100 caracteres.',
          error: 'Nombre fuera de rango',
          code: 'INVALID_DATA'
        });
      }
      
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const existeCategoria = await em.findOne(Categoria, { nombre: nombre.trim() });
      if (existeCategoria) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear categoría: ya existe una categoría con ese nombre.',
          error: 'Duplicado',
          code: 'DUPLICATE'
        });
      }
      
      const nuevaCategoria = new Categoria(nombre.trim(), descripcion?.trim());
      
      em.persist(nuevaCategoria);
      await em.flush();

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: nuevaCategoria
      });
    } catch (error) {
      console.error('Error en create categoria:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear categoría: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/categorias/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const categoria = await em.findOne(Categoria, { id: parseInt(id), activa: true });
      
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar categoría: categoría no encontrada.',
          error: 'Categoría no encontrada',
          code: 'NOT_FOUND'
        });
      }

      if (nombre !== undefined) {
        if (!nombre || nombre.length < 2 || nombre.length > 100) {
          return res.status(400).json({
            success: false,
            message: 'No se pudo actualizar categoría: el nombre debe tener entre 2 y 100 caracteres.',
            error: 'Nombre fuera de rango',
            code: 'INVALID_DATA'
          });
        }

        const existeCategoria = await em.findOne(Categoria, { 
          nombre: nombre.trim(),
          id: { $ne: parseInt(id) }
        });
        if (existeCategoria) {
          return res.status(400).json({
            success: false,
            message: 'No se pudo actualizar categoría: ya existe otra categoría con ese nombre.',
            error: 'Duplicado',
            code: 'DUPLICATE'
          });
        }

        categoria.nombre = nombre.trim();
      }

      if (descripcion !== undefined) {
        categoria.descripcion = descripcion?.trim() || null;
      }

      await em.flush();

      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: categoria
      });
    } catch (error) {
      console.error('Error en update categoria:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo actualizar categoría: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'UPDATE_ERROR'
      });
    }
  }

  // DELETE /api/categorias/:id (soft delete)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const categoria = await em.findOne(Categoria, { id: parseInt(id), activa: true });
      
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar categoría: categoría no encontrada.',
          error: 'Categoría no encontrada',
          code: 'NOT_FOUND'
        });
      }

      const camisetasAsociadas = await em.count(Camiseta, { categoria: categoria });
      if (camisetasAsociadas > 0) {
        return res.status(400).json({
          success: false,
          message: `No se pudo eliminar categoría: tiene ${camisetasAsociadas} camisetas asociadas.`,
          error: 'Categoría con camisetas asociadas',
          code: 'HAS_ASSOCIATED_ITEMS'
        });
      }

      categoria.activa = false;
      await em.flush();

      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('Error en delete categoria:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar categoría: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'DELETE_ERROR'
      });
    }
  }
}
