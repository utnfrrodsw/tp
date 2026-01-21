import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Camiseta, Talle, CondicionCamiseta, EstadoCamiseta } from '../entities/Camiseta';
import { Usuario, UsuarioRol } from '../entities/Usuario';
import { Categoria } from '../entities/Categoria';
import { Descuento, TipoAplicacionDescuento } from '../entities/Descuento';
import '../types/auth';
import { Subasta } from '../entities/Subasta';
import { z } from 'zod';
import fs from 'fs'; 
import path from 'path';

export class CamisetaController {

  private static async calcularDescuentoAplicable(em: any, camiseta: Camiseta): Promise<{
    tieneDescuento: boolean;
    descuentos?: Array<{
      id: number;
      codigo: string;
      porcentaje: number;
      descripcion: string;
    }>;
    precioOriginal: number;
    precioConDescuento?: number;
    porcentajeTotal?: number;
  }> {
    const ahora = new Date();
    
    // Buscar descuentos activos y vigentes
    const descuentos = await em.find(Descuento, {
      activo: true,
      fechaInicio: { $lte: ahora },
      fechaFin: { $gte: ahora }
    }, {
      populate: ['camisetasEspecificas']
    });

    // Encontrar TODOS los descuentos que aplican a esta camiseta
    const descuentosAplicables: Array<{
      id: number;
      codigo: string;
      porcentaje: number;
      descripcion: string;
    }> = [];

    for (const descuento of descuentos) {
      let aplica = false;

      switch (descuento.tipoAplicacion) {
        case TipoAplicacionDescuento.TODAS:
          aplica = true;
          break;

        case TipoAplicacionDescuento.CATEGORIA:
          if (camiseta.categoria && camiseta.categoria.id === descuento.categoriaId) {
            aplica = true;
          }
          break;

        case TipoAplicacionDescuento.ESPECIFICAS:
          const camisetasEspecificas = descuento.camisetasEspecificas.getItems();
          aplica = camisetasEspecificas.some((c: Camiseta) => c.id === camiseta.id);
          break;
      }

      if (aplica) {
        descuentosAplicables.push({
          id: descuento.id,
          codigo: descuento.codigo,
          porcentaje: descuento.porcentaje,
          descripcion: descuento.descripcion
        });
      }
    }

    // Si no hay descuentos, retornar sin descuento
    if (descuentosAplicables.length === 0) {
      return {
        tieneDescuento: false,
        precioOriginal: camiseta.precioInicial
      };
    }

  
   
    let precioFinal = camiseta.precioInicial;
    let porcentajeTotal = 0;

    for (const desc of descuentosAplicables) {
      precioFinal = precioFinal * (1 - desc.porcentaje / 100);
    }

    // Calcular el porcentaje total equivalente
    porcentajeTotal = ((camiseta.precioInicial - precioFinal) / camiseta.precioInicial) * 100;

    return {
      tieneDescuento: true,
      descuentos: descuentosAplicables,
      precioOriginal: camiseta.precioInicial,
      precioConDescuento: Math.round(precioFinal * 100) / 100,
      porcentajeTotal: Math.round(porcentajeTotal * 100) / 100
    };
  }

  private static TalleEnum = z.nativeEnum(Talle);
  private static CondicionEnum = z.nativeEnum(CondicionCamiseta);
  private static EstadoEnum = z.nativeEnum(EstadoCamiseta);

  // GET /api/camisetas
  static async getAll(req: Request, res: Response) {
    try {
      const filtrosSchema = z.object({
        equipo: z.string().optional(),
        temporada: z.string().optional(),
        talle: CamisetaController.TalleEnum.optional(),
        condicion: CamisetaController.CondicionEnum.optional(),
        vendedorId: z.preprocess((v) => {
          const n = Number(v);
          return Number.isNaN(n) ? undefined : Math.trunc(n);
        }, z.number().int().positive().optional()),
        esSubasta: z.preprocess((val) => {
          if (val === 'true') return true;
          if (val === 'false') return false;
          return val;
        }, z.boolean().optional()),
        precioMin: z.preprocess((val) => {
          if (val === '' || val == null) return undefined;
          const n = Number(val);
          return Number.isNaN(n) ? undefined : n;
        }, z.number().min(0).optional()),
        precioMax: z.preprocess((val) => {
          if (val === '' || val == null) return undefined;
          const n = Number(val);
          return Number.isNaN(n) ? undefined : n;
        }, z.number().min(0).optional()),
        page: z.preprocess((v) => {
          const n = Number(v);
          return Number.isNaN(n) ? undefined : Math.max(1, Math.trunc(n));
        }, z.number().min(1).optional()),
        limit: z.preprocess((v) => {
          const n = Number(v);
          return Number.isNaN(n) ? undefined : Math.max(1, Math.trunc(n));
        }, z.number().min(1).optional()),
        sort: z.string().optional(),
        categoriaId: z.preprocess((v) => {
          const n = Number(v);
          return Number.isNaN(n) ? undefined : Math.trunc(n);
        }, z.number().int().positive().optional()),
      });

      const parseResult = filtrosSchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo obtener camisetas: filtros inválidos.',
          error: 'Filtros inválidos',
          code: 'INVALID_FILTERS',
          details: parseResult.error.issues
        });
      }

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const parsed = parseResult.data;

      const where: any = { estado: { $ne: EstadoCamiseta.INACTIVA } };
      if (parsed.equipo) where.equipo = parsed.equipo;
      if (parsed.temporada) where.temporada = parsed.temporada;
      if (parsed.talle) where.talle = parsed.talle;
      if (parsed.condicion) where.condicion = parsed.condicion;
      if (typeof parsed.esSubasta === 'boolean') where.esSubasta = parsed.esSubasta;
      if (typeof parsed.vendedorId === 'number') where.vendedor = { id: parsed.vendedorId };
        if (typeof parsed.categoriaId === 'number') where.categoria_id = parsed.categoriaId;

      const priceCond: any = {};
      if (typeof parsed.precioMin === 'number') priceCond.$gte = parsed.precioMin;
      if (typeof parsed.precioMax === 'number') priceCond.$lte = parsed.precioMax;
      if (Object.keys(priceCond).length > 0) where.precioInicial = priceCond;

      const page = parsed.page ?? 1;
      const limit = parsed.limit ?? 9;
      const offset = (page - 1) * limit;

      let orderBy: any = { fechaPublicacion: 'DESC' };
      switch (parsed.sort) {
        case 'precioAsc':
          orderBy = { precioInicial: 'ASC' };
          break;
        case 'precioDesc':
          orderBy = { precioInicial: 'DESC' };
          break;
        case 'fechaAsc':
          orderBy = { fechaPublicacion: 'ASC' };
          break;
        case 'fechaDesc':
          orderBy = { fechaPublicacion: 'DESC' };
          break
      }

      const [camisetasList, total] = await Promise.all([
        em.find(Camiseta, where, { populate: ['categoria', 'vendedor'], limit, offset, orderBy }),
        em.count(Camiseta, where)
      ]);
        // Log de los resultados obtenidos
        console.log('🟢 Resultados camisetas:', camisetasList.map((c: Camiseta) => ({ id: c.id, titulo: c.titulo, categoria: c.categoria?.id })));

     
      const camisetasConDescuentos = await Promise.all(
        camisetasList.map(async (camiseta) => {
          const infoDescuento = await CamisetaController.calcularDescuentoAplicable(em, camiseta);
          return {
            ...camiseta,
            ...infoDescuento
          };
        })
      );

      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: camisetasConDescuentos,
        count: total,
        page,
        limit
      });
    } catch (error) {
      console.error('Error en getAll camisetas:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener camisetas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/camisetas/:id
  static async getOne(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      const camiseta = await em.findOne(Camiseta, { id: Number(req.params.id) }, { populate: ['categoria', 'vendedor'] });

      if (!camiseta || camiseta.estado === EstadoCamiseta.INACTIVA) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener camiseta: camiseta no encontrada.',
          error: 'Camiseta no encontrada',
          code: 'NOT_FOUND'
        });
      }

    
      const infoDescuento = await CamisetaController.calcularDescuentoAplicable(em, camiseta);

      res.json({
        success: true,
        message: 'Operación getOne realizada correctamente.',
        data: {
          ...camiseta,
          ...infoDescuento 
        }
      });
    } catch (error) {
      console.error('Error en getOne camiseta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener camiseta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETONE_ERROR'
      });
    }
  }

  // POST /api/camisetas
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo crear camiseta: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }
     
      if (req.user.rol !== UsuarioRol.USUARIO && req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo crear camiseta: rol no permitido.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const createSchema = z.object({
        titulo: z.string().min(2),
        descripcion: z.string().min(5),
        equipo: z.string().min(2),
        temporada: z.string().min(2),
        talle: CamisetaController.TalleEnum,
        condicion: CamisetaController.CondicionEnum,
        imagen: z.string().min(5),
        precioInicial: z.coerce.number().positive(),
        categoriaId: z.coerce.number().int().optional()
      });

      const parseResult = createSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear camiseta: datos inválidos.',
          error: 'Datos inválidos',
          code: 'INVALID_DATA',
          details: parseResult.error.issues
        });
      }

      const { titulo, descripcion, equipo, temporada, talle, condicion, imagen, precioInicial, categoriaId } = parseResult.data;

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const vendedor = await em.findOne(Usuario, { id: req.user.id });
      if (!vendedor) return res.status(404).json({
        success: false,
        message: 'No se pudo crear camiseta: vendedor no encontrado.',
        error: 'Vendedor no encontrado',
        code: 'NOT_FOUND'
      });

      const nuevaCamiseta = new Camiseta(titulo, descripcion, equipo, temporada, talle, condicion, imagen, precioInicial, vendedor);

      if (categoriaId) {
        const categoria = await em.findOne(Categoria, { id: categoriaId });
        if (categoria) nuevaCamiseta.categoria = categoria;
      }

      em.persist(nuevaCamiseta);
      await em.flush();

      const camisetaCompleta = await em.findOneOrFail(Camiseta, { id: nuevaCamiseta.id }, { populate: ['categoria', 'vendedor'] });

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: camisetaCompleta
      });
    } catch (error) {
      console.error('Error en create camiseta:', error);
      res.status(500).json({ success: false, message: 'Error al crear camiseta' });
    }
  }

  // PUT /api/camisetas/:id
  static async update(req: Request, res: Response) {
    try {
      const updateSchema = z.object({
        titulo: z.string().min(2).optional(),
        descripcion: z.string().min(5).optional(),
        precioInicial: z.coerce.number().positive().optional(),
        stock: z.coerce.number().int().min(0).optional(),
        estado: CamisetaController.EstadoEnum.optional()
      });

      const parseResult = updateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar camiseta: datos inválidos.',
          error: 'Datos inválidos',
          code: 'INVALID_DATA',
          details: parseResult.error.issues
        });
      }

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const camiseta = await em.findOne(Camiseta, { id: Number(req.params.id) });
      if (!camiseta || camiseta.estado === EstadoCamiseta.INACTIVA) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar camiseta: camiseta no encontrada.',
          error: 'Camiseta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      Object.assign(camiseta, parseResult.data);
      await em.flush();

      const camisetaCompleta = await em.findOneOrFail(Camiseta, { id: camiseta.id }, { populate: ['categoria', 'vendedor'] });

      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: camisetaCompleta
      });
    } catch (error) {
      console.error('Error en update camiseta:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar camiseta' });
    }
  }

  // DELETE /api/camisetas/:id
  static async delete(req: Request, res: Response) {
    try {
      console.log('🗑️ Entrando a CamisetaController.delete, req.user:', req.user);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo eliminar camiseta: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      const camiseta = await em.findOne(Camiseta, { id: Number(req.params.id) });

      if (!camiseta) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar camiseta: camiseta no encontrada.',
          error: 'Camiseta no encontrada',
          code: 'NOT_FOUND'
        });
      }

      // Verificar permisos: solo el vendedor o admin puede eliminar
      if (
        req.user.rol !== UsuarioRol.ADMINISTRADOR &&
        camiseta.vendedor.id !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo eliminar camiseta: no tienes permiso para eliminar esta camiseta.',
          error: 'No autorizado',
          code: 'FORBIDDEN'
        });
      }

   
      if (camiseta.imagen && camiseta.imagen.startsWith('/uploads/')) {
        try {
          const imagePath = path.resolve(__dirname, '../../public', camiseta.imagen.substring(1));
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`🗑️ Imagen eliminada: ${imagePath}`);
          }
        } catch (error) {
          console.error('⚠️ Error al eliminar imagen:', error);
          // No fallar la eliminación de la camiseta si falla eliminar la imagen
        }
      }

        // Ya no es necesario eliminar subastas manualmente: ON DELETE CASCADE en la base de datos

      await em.removeAndFlush(camiseta);

      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.',
        data: { message: 'Camiseta eliminada con éxito' }
      });
    } catch (error) {
      console.error('Error en delete camiseta:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar camiseta: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'DELETE_ERROR'
      });
    }
  }

  // POST /api/camisetas/publicar
  static async publicarParaVenta(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No se pudo publicar camiseta: no autorizado.',
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }
      
     
      if (req.user.rol !== UsuarioRol.USUARIO && req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo publicar camiseta: rol no permitido.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const publicarSchema = z.object({
        titulo: z.string().min(2),
        descripcion: z.string().min(5).optional(),
        equipo: z.string().min(2),
        temporada: z.string().min(2),
        talle: CamisetaController.TalleEnum,
        condicion: CamisetaController.CondicionEnum,
        imagen: z.string().min(5).optional(),
        precioInicial: z.coerce.number().positive(),
        esSubasta: z.boolean().optional(),
        stock: z.coerce.number().int().min(1).optional(),
        categoriaId: z.coerce.number().int().optional(),
        fechaFinSubasta: z.string().optional().transform((val) => val ? new Date(val) : undefined)
      });

      const parseResult = publicarSchema.safeParse(req.body);
      
      console.log('📊 Datos recibidos:', req.body);
      console.log('📊 Resultado de validación:', parseResult);

      if (!parseResult.success) {
        console.error('❌ Error de validación:', parseResult.error.issues);
        return res.status(400).json({
          success: false,
          message: 'No se pudo publicar camiseta: datos inválidos.',
          error: 'Datos inválidos',
          code: 'INVALID_DATA',
          details: parseResult.error.issues
        });
      }

      const { titulo, descripcion, equipo, temporada, talle, condicion, imagen, precioInicial, esSubasta, stock, categoriaId, fechaFinSubasta } = parseResult.data;

      
      if (esSubasta && !fechaFinSubasta) {
        console.error('❌ Subasta sin fecha fin');
        return res.status(400).json({
          success: false,
          message: 'No se pudo publicar subasta: se requiere fecha de fin.',
          error: 'Fecha de fin requerida',
          code: 'MISSING_FECHA_FIN'
        });
      }

      
      if (esSubasta && fechaFinSubasta && fechaFinSubasta <= new Date()) {
        console.error('❌ Fecha de fin en el pasado');
        return res.status(400).json({
          success: false,
          message: 'No se pudo publicar subasta: la fecha de fin debe ser futura.',
          error: 'Fecha inválida',
          code: 'INVALID_DATE'
        });
      }

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const vendedor = await em.findOne(Usuario, { id: req.user.id, activo: true });
      if (!vendedor) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo publicar camiseta: vendedor no encontrado o inactivo.',
          error: 'Vendedor no encontrado o inactivo',
          code: 'NOT_FOUND'
        });
      }

      const nuevaCamiseta = new Camiseta(
        titulo,
        descripcion || `Camiseta ${equipo} temporada ${temporada}`,
        equipo,
        temporada,
        talle,
        condicion,
        imagen || '',
        precioInicial,
        vendedor
      );

      nuevaCamiseta.esSubasta = esSubasta ?? false;
      nuevaCamiseta.stock = stock ?? 1;
      nuevaCamiseta.estado = esSubasta ? EstadoCamiseta.EN_SUBASTA : EstadoCamiseta.DISPONIBLE;

      if (categoriaId) {
        const categoria = await em.findOne(Categoria, { id: categoriaId, activa: true });
        if (categoria) nuevaCamiseta.categoria = categoria;
      }

      em.persist(nuevaCamiseta);
      await em.flush();

      console.log('✅ Camiseta creada:', nuevaCamiseta.id, 'esSubasta:', esSubasta);

      
      let subastaCreada = null;
      if (esSubasta && fechaFinSubasta) {
        console.log('🔨 Creando subasta con fechaFin:', fechaFinSubasta);
        
        const fechaInicio = new Date();
        const nuevaSubasta = new Subasta(
          fechaInicio,
          fechaFinSubasta,
          precioInicial,
          nuevaCamiseta
        );

        em.persist(nuevaSubasta);
        await em.flush();

        // Popular la subasta para retornarla completa
        subastaCreada = await em.findOne(Subasta, { id: nuevaSubasta.id }, {
          populate: ['camiseta', 'camiseta.vendedor', 'camiseta.categoria']
        });

        console.log('✅ Subasta creada automáticamente:', subastaCreada?.id);
      }

      const camisetaCompleta = await em.findOneOrFail(Camiseta, { id: nuevaCamiseta.id }, { 
        populate: ['categoria', 'vendedor'] 
      });

      res.status(201).json({
        success: true,
        message: `Operación publicarParaVenta realizada correctamente.`,
        data: camisetaCompleta,
        subasta: subastaCreada || undefined,
        detalles: {
          tipo_venta: esSubasta ? 'subasta' : 'precio_fijo',
          precio_inicial: precioInicial,
          stock: nuevaCamiseta.stock,
          estado: nuevaCamiseta.estado,
          fecha_fin_subasta: fechaFinSubasta || null,
          subasta_id: subastaCreada?.id || null
        }
      });
    } catch (error) {
      console.error('❌ Error en publicarParaVenta:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al publicar camiseta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // GET /api/camisetas/stats - devuelve precio mínimo y máximo de camisetas activas
  static async stats(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const disponibles = await em.count(Camiseta, { estado: EstadoCamiseta.DISPONIBLE });
      const vendidas = await em.count(Camiseta, { estado: EstadoCamiseta.VENDIDA });
      const enSubasta = await em.count(Camiseta, { estado: EstadoCamiseta.EN_SUBASTA });

      res.json({
        success: true,
        message: 'Operación stats realizada correctamente.',
        data: { disponibles, vendidas, enSubasta }
      });
    } catch (error) {
      console.error('Error en stats:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener estadísticas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'STATS_ERROR'
      });
    }
  }

  // GET /api/camisetas/seleccion - Para formularios de descuentos
  static async getSeleccion(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();

      const camisetas = await em.find(
        Camiseta, 
        { estado: EstadoCamiseta.DISPONIBLE },
        { 
          populate: ['categoria', 'vendedor'],
          orderBy: { titulo: 'ASC' }
        }
      );

      const seleccion = camisetas.map(c => ({
        id: c.id,
        titulo: c.titulo,
        equipo: c.equipo,
        temporada: c.temporada,
        precio: c.precioInicial,
        imagen: c.imagen,
        categoria: c.categoria ? {
          id: c.categoria.id,
          nombre: c.categoria.nombre
        } : null
      }));

      res.json({
        success: true,
        message: 'Operación getSeleccion realizada correctamente.',
        data: seleccion
      });
    } catch (error) {
      console.error('Error en getSeleccion camisetas:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener selección de camisetas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETSELECCION_ERROR'
      });
    }
  }

 
  static async getByIds(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere un array de IDs',
          code: 'INVALID_IDS'
        });
      }

      const camisetas = await em.find(Camiseta, { id: { $in: ids } }, { 
        populate: ['categoria', 'vendedor'] 
      });

     
      const camisetasConDescuentos = await Promise.all(
        camisetas.map(async (camiseta) => {
          const infoDescuento = await CamisetaController.calcularDescuentoAplicable(em, camiseta);
          return {
            ...camiseta,
            ...infoDescuento
          };
        })
      );

      res.json({
        success: true,
        message: 'Camisetas obtenidas correctamente',
        data: camisetasConDescuentos
      });
    } catch (error) {
      console.error('Error en getByIds:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener camisetas',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYIDS_ERROR'
      });
    }
  }

}
