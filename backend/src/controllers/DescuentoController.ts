import { Request, Response } from 'express';
import { Descuento, TipoAplicacionDescuento } from '../entities/Descuento';
import { Camiseta } from '../entities/Camiseta';
import { UsuarioRol } from '../entities/Usuario';

export class DescuentoController {
  // GET /api/descuentos
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const { activos, vigentes } = req.query;
      
      let filtros: any = {};
      
      if (activos === 'true') {
        filtros.activo = true;
      }
      
      if (vigentes === 'true') {
        const ahora = new Date();
        filtros.fechaInicio = { $lte: ahora };
        filtros.fechaFin = { $gte: ahora };
        filtros.activo = true;
      }
      
      const descuentos = await em.find(Descuento, filtros, {
        populate: ['camisetasEspecificas'] 
      });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: descuentos,
        count: descuentos.length
      });
    } catch (error) {
      console.error('Error en getAll descuentos:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener descuentos: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/descuentos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const descuento = await em.findOne(Descuento, { id: parseInt(id) }, {
        populate: ['camisetasEspecificas']
      });
      
      if (!descuento) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener descuento: descuento no encontrado.',
          error: 'Descuento no encontrado',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: descuento
      });
    } catch (error) {
      console.error('Error en getById descuento:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener descuento: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // GET /api/descuentos/validar/:codigo
  static async validarCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { montoCompra, camisetaId } = req.query;
      
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const descuento = await em.findOne(Descuento, {
        codigo: codigo.toUpperCase(),
        activo: true 
      }, {
        populate: ['camisetasEspecificas']
      });
      
      if (!descuento) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo validar código: código de descuento no válido.',
          error: 'Código no válido',
          code: 'NOT_FOUND',
          valido: false
        });
      }

      const ahora = new Date();
      const vigente = descuento.fechaInicio <= ahora && descuento.fechaFin >= ahora;
      
      if (!vigente) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo validar código: el código de descuento ha expirado.',
          error: 'Código expirado',
          code: 'EXPIRED',
          valido: false,
          fechaVencimiento: descuento.fechaFin
        });
      }

     
      let aplicaACamiseta = true;
      if (camisetaId) {
        const camiseta = await em.findOne(Camiseta, { id: parseInt(camisetaId as string) }, {
          populate: ['categoria']
        });

        if (camiseta) {
          switch (descuento.tipoAplicacion) {
            case TipoAplicacionDescuento.CATEGORIA:
              aplicaACamiseta = camiseta.categoria?.id === descuento.categoriaId;
              break;
            case TipoAplicacionDescuento.ESPECIFICAS:
              aplicaACamiseta = descuento.camisetasEspecificas.getItems().some((c: Camiseta) => c.id === camiseta.id); // ✅ AGREGAR TIPO
              break;
            case TipoAplicacionDescuento.TODAS:
            default:
              aplicaACamiseta = true;
          }
        }
      }

      if (!aplicaACamiseta) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo validar código: este descuento no aplica a la camiseta seleccionada.',
          error: 'Descuento no aplicable',
          code: 'NOT_APPLICABLE',
          valido: false
        });
      }

      let montoDescuento = 0;
      if (montoCompra) {
        const monto = parseFloat(montoCompra as string);
        montoDescuento = (monto * descuento.porcentaje) / 100;
      }

      res.json({
        success: true,
        message: 'Operación validarCodigo realizada correctamente.',
        valido: true,
        descuento: {
          id: descuento.id,
          codigo: descuento.codigo,
          descripcion: descuento.descripcion,
          porcentaje: descuento.porcentaje,
          fechaVencimiento: descuento.fechaFin,
          tipoAplicacion: descuento.tipoAplicacion
        },
        montoDescuento: montoDescuento || null
      });
    } catch (error) {
      console.error('Error en validar código descuento:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo validar código: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'VALIDAR_ERROR'
      });
    }
  }

  // POST /api/descuentos
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo crear descuento: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo crear descuento: solo administradores pueden crear descuentos.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const { codigo, descripcion, porcentaje, fechaInicio, fechaFin, tipoAplicacion, categoriaId, camisetaIds } = req.body;
      
      // Validaciones básicas
      if (!codigo) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: el código es obligatorio.',
          error: 'Código obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!descripcion) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: la descripción es obligatoria.',
          error: 'Descripción obligatoria',
          code: 'INVALID_DATA'
        });
      }
      if (!porcentaje || porcentaje <= 0 || porcentaje > 100) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: el porcentaje debe estar entre 1 y 100.',
          error: 'Porcentaje fuera de rango',
          code: 'INVALID_DATA'
        });
      }
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: las fechas de inicio y fin son obligatorias.',
          error: 'Fechas obligatorias',
          code: 'INVALID_DATA'
        });
      }

      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const codigoExistente = await em.findOne(Descuento, { 
        codigo: codigo.toUpperCase() 
      });
      
      if (codigoExistente) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: el código de descuento ya existe.',
          error: 'Duplicado',
          code: 'DUPLICATE'
        });
      }

      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: las fechas proporcionadas no son válidas.',
          error: 'Fechas inválidas',
          code: 'INVALID_DATA'
        });
      }
      
      if (fin <= inicio) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: la fecha de fin debe ser posterior a la fecha de inicio.',
          error: 'Fechas fuera de rango',
          code: 'INVALID_DATA'
        });
      }

      const tipoAplicacionEnum = tipoAplicacion || TipoAplicacionDescuento.TODAS;

     
      if (tipoAplicacionEnum === TipoAplicacionDescuento.CATEGORIA && !categoriaId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear descuento: debe especificar una categoría.',
          error: 'Categoría obligatoria',
          code: 'INVALID_DATA'
        });
      }

      const nuevoDescuento = new Descuento(
        codigo.toUpperCase(),
        descripcion,
        porcentaje,
        inicio,
        fin,
        true,
        tipoAplicacionEnum,
        categoriaId
      );

    
      if (tipoAplicacionEnum === TipoAplicacionDescuento.ESPECIFICAS && camisetaIds && Array.isArray(camisetaIds)) {
        const camisetas = await em.find(Camiseta, { id: { $in: camisetaIds } });
        nuevoDescuento.camisetasEspecificas.set(camisetas);
      }

      await em.persistAndFlush(nuevoDescuento);

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: nuevoDescuento
      });
    } catch (error) {
      console.error('Error en create descuento:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear descuento: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/descuentos/:id
  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo actualizar descuento: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo actualizar descuento: solo administradores pueden modificar descuentos.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const { id } = req.params;
      const { descripcion, porcentaje, fechaInicio, fechaFin, activo, tipoAplicacion, categoriaId, camisetaIds } = req.body;
      
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const descuento = await em.findOne(Descuento, { id: parseInt(id) }, {
        populate: ['camisetasEspecificas']
      });
      
      if (!descuento) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar descuento: descuento no encontrado.',
          error: 'Descuento no encontrado',
          code: 'NOT_FOUND'
        });
      }

      if (descripcion !== undefined) descuento.descripcion = descripcion;
      
      if (porcentaje !== undefined) {
        if (porcentaje <= 0 || porcentaje > 100) {
          return res.status(400).json({
            success: false,
            message: 'No se pudo actualizar descuento: el porcentaje debe estar entre 1 y 100.',
            error: 'Porcentaje fuera de rango',
            code: 'INVALID_DATA'
          });
        }
        descuento.porcentaje = porcentaje;
      }
      
      if (fechaInicio !== undefined) descuento.fechaInicio = new Date(fechaInicio);
      if (fechaFin !== undefined) descuento.fechaFin = new Date(fechaFin);
      if (activo !== undefined) descuento.activo = activo;
      if (tipoAplicacion !== undefined) descuento.tipoAplicacion = tipoAplicacion;
      if (categoriaId !== undefined) descuento.categoriaId = categoriaId;

      if (descuento.fechaFin <= descuento.fechaInicio) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar descuento: la fecha de fin debe ser posterior a la fecha de inicio.',
          error: 'Fechas fuera de rango',
          code: 'INVALID_DATA'
        });
      }

    
      if (tipoAplicacion === TipoAplicacionDescuento.ESPECIFICAS && camisetaIds && Array.isArray(camisetaIds)) {
        const camisetas = await em.find(Camiseta, { id: { $in: camisetaIds } });
        descuento.camisetasEspecificas.set(camisetas);
      } else if (tipoAplicacion !== TipoAplicacionDescuento.ESPECIFICAS) {
        descuento.camisetasEspecificas.removeAll();
      }

      await em.persistAndFlush(descuento);

      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: descuento
      });
    } catch (error) {
      console.error('Error en update descuento:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo actualizar descuento: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'UPDATE_ERROR'
      });
    }
  }

  // DELETE /api/descuentos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      const descuento = await em.findOne(Descuento, { id: parseInt(id) });
      
      if (!descuento) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar descuento: descuento no encontrado.',
          error: 'Descuento no encontrado',
          code: 'NOT_FOUND'
        });
      }

      descuento.activo = false;
      await em.persistAndFlush(descuento);

      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('Error en delete descuento:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar descuento: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'DELETE_ERROR'
      });
    }
  }
}