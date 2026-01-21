import { Request, Response } from 'express';
import { MetodoPago } from '../entities/MetodoPago';

export class MetodoPagoController {
  // GET /api/metodos-pago
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const metodosPago = await em.find(MetodoPago, {});
      
      return res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: metodosPago,
        count: metodosPago.length
      });
    } catch (error) {
      console.error('Error in MetodoPagoController.getAll:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo obtener métodos de pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/metodos-pago/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const metodoPago = await em.findOne(MetodoPago, { id: parseInt(id) });
      
      if (!metodoPago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener método de pago: método de pago no encontrado.',
          error: 'Método de pago no encontrado',
          code: 'NOT_FOUND'
        });
      }
      return res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: metodoPago
      });
    } catch (error) {
      console.error('Error en getById método pago:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo obtener método de pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // POST /api/metodos-pago
  static async create(req: Request, res: Response) {
    try {
      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear método de pago: el nombre es obligatorio.',
          error: 'Nombre obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!descripcion) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear método de pago: la descripción es obligatoria.',
          error: 'Descripción obligatoria',
          code: 'INVALID_DATA'
        });
      }

      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      // Verificar que no exista un método con el mismo nombre
      const existeMetodo = await em.findOne(MetodoPago, { nombre });
      if (existeMetodo) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear método de pago: ya existe un método de pago con ese nombre.',
          error: 'Duplicado',
          code: 'DUPLICATE'
        });
      }

      const nuevoMetodo = em.create(MetodoPago, {
        nombre,
        descripcion,
        activo: true
      });
      
      await em.persistAndFlush(nuevoMetodo);

      return res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: nuevoMetodo
      });
    } catch (error) {
      console.error('Error en create método pago:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo crear método de pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/metodos-pago/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, activo } = req.body;
      
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const metodoPago = await em.findOne(MetodoPago, { id: parseInt(id) });
      
      if (!metodoPago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar método de pago: método de pago no encontrado.',
          error: 'Método de pago no encontrado',
          code: 'NOT_FOUND'
        });
      }

      if (nombre !== undefined) metodoPago.nombre = nombre;
      if (descripcion !== undefined) metodoPago.descripcion = descripcion;
      if (activo !== undefined) metodoPago.activo = activo;

      await em.persistAndFlush(metodoPago);

      return res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: metodoPago
      });
    } catch (error) {
      console.error('Error en update método pago:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo actualizar método de pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'UPDATE_ERROR'
      });
    }
  }

  // DELETE /api/metodos-pago/:id (Soft delete)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const metodoPago = await em.findOne(MetodoPago, { id: parseInt(id) });
      
      if (!metodoPago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar método de pago: método de pago no encontrado.',
          error: 'Método de pago no encontrado',
          code: 'NOT_FOUND'
        });
      }

      // Soft delete - solo desactivar
      metodoPago.activo = false;
      await em.persistAndFlush(metodoPago);

      return res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('Error en delete método pago:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo eliminar método de pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'DELETE_ERROR'
      });
    }
  }
}