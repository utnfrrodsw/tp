import { Request, Response } from 'express';
import { Subasta } from '../entities/Subasta';
import { Camiseta, EstadoCamiseta } from '../entities/Camiseta';
import { z } from 'zod';

export class SubastaController {
  // GET /api/subastas
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const { activas, vendedorId } = req.query;
      
  const now = new Date();
  console.log('📊 Obteniendo subastas con filtros:', { activas, vendedorId });
  console.log('🕒 Fecha actual (servidor):', now.toISOString());
      
  const where: any = {};
      
      // Filtro por activas (fecha fin >= ahora)
      if (activas === 'true') {
        where.fechaFin = { $gte: now };
      } else if (activas === 'false') {
        where.fechaFin = { $lt: now };
      }
      console.log('🔎 Filtro where (forzado):', JSON.stringify(where));
      console.log('🔎 Filtro where:', JSON.stringify(where));
      
     
      if (vendedorId) {
        where.camiseta = { vendedor: { id: parseInt(vendedorId as string) } };
      }
      
      const subastas = await em.find(Subasta, where, {
        populate: ['camiseta', 'camiseta.vendedor', 'camiseta.categoria', 'ganador']
      });
      
      console.log(`✅ Encontradas ${subastas.length} subastas`);
      subastas.forEach((s: Subasta) => {
        console.log(`   - Subasta id: ${s.id}, fechaFin: ${s.fechaFin instanceof Date ? s.fechaFin.toISOString() : s.fechaFin}`);
      });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: subastas,
        count: subastas.length,
        page: 1,
        totalPages: 1
      });
    } catch (error) {
      console.error('❌ Error en getAll subastas:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener subastas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/subastas/:id
  
  static async getById(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const { id } = req.params;

      console.log('📊 Buscando subasta:', id);

      const subasta = await em.findOne(Subasta, { id: parseInt(id) });

      if (!subasta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener subasta: subasta no encontrada.',
          error: 'Subasta no encontrada',
          code: 'NOT_FOUND'
        });
      }
     
      try {
        await em.populate(subasta, ['camiseta', 'camiseta.vendedor', 'camiseta.categoria']);
      } catch (populateError) {
        console.warn('⚠️ Error al popular categoria, continuando sin ella');
        await em.populate(subasta, ['camiseta', 'camiseta.vendedor']);
      }
      res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: subasta
      });
    } catch (error) {
      console.error('❌ Error en getById subasta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener subasta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // POST /api/subastas
  static async create(req: Request, res: Response) {
    try {
      const createSubastaSchema = z.object({
        fechaInicio: z.coerce.date(),
        fechaFin: z.coerce.date(),
        camisetaId: z.coerce.number().int().positive(),
        precioInicial: z.coerce.number().positive().optional()
      }).refine(data => data.fechaFin > data.fechaInicio, {
        message: 'La fecha de fin debe ser posterior a la de inicio'
      });

      const parseResult = createSubastaSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear subasta: datos inválidos.',
          error: 'Datos inválidos',
          code: 'INVALID_DATA',
          details: parseResult.error.issues
        });
      }

      const { fechaInicio, fechaFin, camisetaId, precioInicial } = parseResult.data;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const camiseta = await em.findOne(Camiseta, { id: camisetaId });
      if (!camiseta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear subasta: camiseta no encontrada.',
          error: 'Camiseta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      if (camiseta.estado !== EstadoCamiseta.DISPONIBLE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear subasta: la camiseta no está disponible para subasta.',
          error: 'Camiseta no disponible',
          code: 'INVALID_STATE'
        });
      }

      const nuevaSubasta = new Subasta(
        fechaInicio,
        fechaFin,
        precioInicial || camiseta.precioInicial,
        camiseta
      );

      camiseta.estado = EstadoCamiseta.EN_SUBASTA;
      camiseta.esSubasta = true;

      await em.persistAndFlush([nuevaSubasta, camiseta]);

      const subastaCompleta = await em.findOne(Subasta, { id: nuevaSubasta.id });
      if (subastaCompleta) {
        await em.populate(subastaCompleta, ['camiseta', 'camiseta.vendedor']);
      }

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: subastaCompleta
      });
    } catch (error) {
      console.error('Error en create subasta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear subasta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/subastas/:id/finalizar
  static async finalizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const subasta = await em.findOne(Subasta, { id: parseInt(id) }, {
        populate: ['camiseta']
      });
      
      if (!subasta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo finalizar subasta: subasta no encontrada.',
          error: 'Subasta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      if (!subasta.activa) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo finalizar subasta: la subasta ya está finalizada.',
          error: 'Subasta finalizada',
          code: 'INVALID_STATE'
        });
      }

      if (subasta.fechaFin > new Date()) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo finalizar subasta: la subasta aún no ha terminado.',
          error: 'Subasta no terminada',
          code: 'INVALID_STATE'
        });
      }

      // Finalizar subasta
      subasta.activa = false;
      
      // Si la camiseta no tiene ganador, volver a disponible
      if (!subasta.ganador) {
        if (subasta.camiseta) {
          subasta.camiseta.estado = EstadoCamiseta.DISPONIBLE;
        }
      }

      await em.persistAndFlush([subasta, subasta.camiseta]);

      res.json({
        success: true,
        message: 'Operación finalizar realizada correctamente.',
        data: subasta
      });
    } catch (error) {
      console.error('Error en finalizar subasta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo finalizar subasta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'FINALIZAR_ERROR'
      });
    }
  }

  // GET /api/subastas/camiseta/:camisetaId
  static async getByCamiseta(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const { camisetaId } = req.params;

      console.log('🔍 Buscando subasta para camiseta:', camisetaId);

    
      const subasta = await em.findOne(Subasta, 
        { camiseta: { id: parseInt(camisetaId) } }, 
        { populate: ['camiseta'] }
      );

      if (!subasta) {
        console.log('❌ No se encontró subasta para camiseta:', camisetaId);
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener subasta: no hay subasta para esta camiseta.',
          error: 'No hay subasta',
          code: 'NOT_FOUND'
        });
      }

      // Populate manual adicional
      try {
        await em.populate(subasta, ['camiseta.vendedor', 'camiseta.categoria']);
      } catch (populateError) {
        console.warn('⚠️ Error al popular, continuando sin ellos');
      }

      console.log('✅ Subasta encontrada:', subasta.id);

      res.json({
        success: true,
        message: 'Operación getByCamiseta realizada correctamente.',
        data: subasta
      });
    } catch (error) {
      console.error('❌ Error en getByCamiseta subasta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener subasta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYCAMISETA_ERROR'
      });
    }
  }
}