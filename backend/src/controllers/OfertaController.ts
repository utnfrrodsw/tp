import { Request, Response } from 'express';
import { Oferta } from '../entities/Oferta';
import { Usuario } from '../entities/Usuario';
import { Subasta } from '../entities/Subasta';

export class OfertaController {
  // GET /api/ofertas
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      
      const { subastaId, usuarioId } = req.query;
      
      const where: any = {};
      
      // Filtro por subasta
      if (subastaId) {
        where.subasta = parseInt(subastaId as string);
      }
      
      // Filtro por usuario
      if (usuarioId) {
        where.usuario = parseInt(usuarioId as string);
      }
      
      const ofertas = await em.find(Oferta, where, { 
        populate: ['usuario', 'subasta', 'subasta.camiseta'],
        orderBy: { fechaOferta: 'DESC' }
      });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: ofertas,
        count: ofertas.length
      });
    } catch (error) {
      console.error('❌ Error en getAll ofertas:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener ofertas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/ofertas/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      
      const oferta = await em.findOne(Oferta, { id: parseInt(id) }, { 
        populate: ['usuario', 'subasta', 'subasta.camiseta'] 
      });
      
      if (!oferta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener oferta: oferta no encontrada.',
          error: 'Oferta no encontrada',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: oferta
      });
    } catch (error) {
      console.error('❌ Error en getById oferta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener oferta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // POST /api/ofertas
  static async create(req: Request, res: Response) {
    try {
      const { monto, usuarioId, subastaId } = req.body;
      
      // Validaciones básicas
      if (!monto || monto <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear oferta: el monto debe ser mayor a 0.',
          error: 'Monto inválido',
          code: 'INVALID_DATA'
        });
      }
      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear oferta: el usuario es obligatorio.',
          error: 'Usuario obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!subastaId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear oferta: la subasta es obligatoria.',
          error: 'Subasta obligatoria',
          code: 'INVALID_DATA'
        });
      }

      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      
      // Verificar que el usuario existe
      const usuario = await em.findOne(Usuario, { id: usuarioId });
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear oferta: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }
      
      // Verificar que la subasta existe y está activa
      const subasta = await em.findOne(Subasta, { id: subastaId });
      if (!subasta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear oferta: subasta no encontrada.',
          error: 'Subasta no encontrada',
          code: 'NOT_FOUND'
        });
      }
      
      if (subasta.fechaFin < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear oferta: la subasta ya ha finalizado.',
          error: 'Subasta finalizada',
          code: 'INVALID_STATE'
        });
      }

      // Verificar que la oferta sea mayor a la actual
      if (monto <= subasta.precioActual) {
        return res.status(400).json({
          success: false,
          message: `No se pudo crear oferta: la oferta debe ser mayor al precio actual ($${subasta.precioActual}).`,
          error: 'Monto insuficiente',
          code: 'INVALID_DATA'
        });
      }

      const nuevaOferta = new Oferta(subasta, usuario, monto);

      // Actualizar precio actual de la subasta
      subasta.precioActual = monto;

      await em.persistAndFlush([nuevaOferta, subasta]);

      // Populate para devolver datos completos
      await em.populate(nuevaOferta, ['usuario', 'subasta', 'subasta.camiseta']);

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: nuevaOferta
      });
    } catch (error) {
      console.error('❌ Error en create oferta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear oferta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/ofertas/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { monto } = req.body;
      
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      
      const oferta = await em.findOne(Oferta, { id: parseInt(id) });
      
      if (!oferta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar oferta: oferta no encontrada.',
          error: 'Oferta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      if (monto && monto > 0) {
        oferta.monto = monto;
      }

      await em.persistAndFlush(oferta);

      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: oferta
      });
    } catch (error) {
      console.error('❌ Error en update oferta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo actualizar oferta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'UPDATE_ERROR'
      });
    }
  }

  // DELETE /api/ofertas/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      
      const oferta = await em.findOne(Oferta, { id: parseInt(id) });
      
      if (!oferta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar oferta: oferta no encontrada.',
          error: 'Oferta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      await em.removeAndFlush(oferta);

      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('❌ Error en delete oferta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar oferta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'DELETE_ERROR'
      });
    }
  }
}