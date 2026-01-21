import { Request, Response } from 'express';
import { Pago, EstadoPago } from '../entities/Pago';  
import { Compra, EstadoCompra } from '../entities/Compra';  
import { MetodoPago } from '../entities/MetodoPago';
import { EstadoCamiseta } from '../entities/Camiseta';  

export class PagoController {
  // GET /api/pagos
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
  const em = orm.em.fork();
  const pagos = await em.find(Pago, {}, { 
        populate: ['compra', 'compra.comprador', 'compra.camiseta', 'metodoPago']  
      });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: pagos
      });
    } catch (error) {
      console.error('Error en getAll pagos:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener pagos: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/pagos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      
  const em = orm.em.fork();
  const pago = await em.findOne(Pago, { id: parseInt(id) }, { 
        populate: ['compra', 'compra.comprador', 'compra.camiseta', 'metodoPago']  
      });
      
      if (!pago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener pago: pago no encontrado.',
          error: 'Pago no encontrado',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: pago
      });
    } catch (error) {
      console.error('Error en getById pago:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // GET /api/pagos/compra/:compraId
  static async getByCompra(req: Request, res: Response) {
    try {
      const { compraId } = req.params;
      const orm = req.app.locals.orm;
      
  const em = orm.em.fork();
  const pagos = await em.find(Pago, 
        { compra: { id: parseInt(compraId) } }, 
        { populate: ['metodoPago'] }
      );
      
      res.json({
        success: true,
        message: 'Operación getByCompra realizada correctamente.',
        data: pagos,
        count: pagos.length
      });
    } catch (error) {
      console.error('Error en getByCompra pagos:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener pagos de la compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYCOMPRA_ERROR'
      });
    }
  }

  // POST /api/pagos - CORREGIDO
  static async create(req: Request, res: Response) {
    try {
      const { compraId, metodoPagoId, monto, detallesPago } = req.body;
      
      // Validaciones básicas
      if (!compraId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear pago: la compra es obligatoria.',
          error: 'Compra obligatoria',
          code: 'INVALID_DATA'
        });
      }
      if (!metodoPagoId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear pago: el método de pago es obligatorio.',
          error: 'Método de pago obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!monto || monto <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear pago: el monto debe ser mayor a 0.',
          error: 'Monto inválido',
          code: 'INVALID_DATA'
        });
      }

      const orm = req.app.locals.orm;
      
      // Verificar que la compra existe
  const em = orm.em.fork();
  const compra = await em.findOne(Compra, { id: compraId });
      if (!compra) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear pago: compra no encontrada.',
          error: 'Compra no encontrada',
          code: 'NOT_FOUND'
        });
      }
      

      if (compra.estado !== EstadoCompra.PENDIENTE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear pago: la compra ya fue procesada o cancelada.',
          error: 'Compra no pendiente',
          code: 'INVALID_STATE'
        });
      }
      
      // Verificar que el método de pago existe
  const metodoPago = await em.findOne(MetodoPago, { id: metodoPagoId });
      if (!metodoPago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear pago: método de pago no encontrado.',
          error: 'Método de pago no encontrado',
          code: 'NOT_FOUND'
        });
      }
      
      if (!metodoPago.activo) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear pago: el método de pago no está disponible.',
          error: 'Método de pago inactivo',
          code: 'INVALID_STATE'
        });
      }

      // Verificar que el monto coincide con el total de la compra
      if (monto !== compra.total) {
        return res.status(400).json({
          success: false,
          message: `No se pudo crear pago: el monto debe ser exactamente $${compra.total}.`,
          error: 'Monto incorrecto',
          code: 'INVALID_DATA'
        });
      }

      // Simular procesamiento del pago
      let estadoPago = EstadoPago.PENDIENTE;  // 
      let numeroTransaccion = this.generarNumeroTransaccion();

      
      estadoPago = Math.random() > 0.1 ? EstadoPago.COMPLETADO : EstadoPago.FALLIDO;  

      const nuevoPago = new Pago(
        monto,                    
        compra.id,               
        metodoPago.id,           
        numeroTransaccion        
      );

      // Asignar los objetos completos después de la creación
      nuevoPago.compra = compra;
      nuevoPago.metodoPago = metodoPago;
      nuevoPago.estado = estadoPago;  

  await em.persistAndFlush(nuevoPago);

      // Si el pago fue exitoso, actualizar la compra
      if (estadoPago === EstadoPago.COMPLETADO) {  
        compra.estado = EstadoCompra.CONFIRMADA;   
  await em.persistAndFlush(compra);
      }

      res.status(201).json({
        success: true,
        message: estadoPago === EstadoPago.COMPLETADO
          ? 'Operación create realizada correctamente.'
          : 'Pago iniciado, pendiente de confirmación.',
        data: nuevoPago,
        estado: estadoPago,
        numeroTransaccion: numeroTransaccion
      });
    } catch (error) {
      console.error('Error en create pago:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/pagos/:id/confirmar - CORREGIDO
  static async confirmar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { numeroConfirmacion } = req.body;
      
      const orm = req.app.locals.orm;
      
  const em = orm.em.fork();
  const pago = await em.findOne(Pago, { id: parseInt(id) }, {
        populate: ['compra', 'compra.camiseta']
      });
      
      if (!pago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo confirmar pago: pago no encontrado.',
          error: 'Pago no encontrado',
          code: 'NOT_FOUND'
        });
      }

   
      if (pago.estado !== EstadoPago.PENDIENTE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo confirmar pago: el pago ya fue procesado.',
          error: 'Pago ya procesado',
          code: 'INVALID_STATE'
        });
      }

   
      pago.estado = EstadoPago.COMPLETADO;
      
      if (numeroConfirmacion) {
        pago.notas = pago.notas 
          ? `${pago.notas} - Confirmación: ${numeroConfirmacion}`
          : `Confirmación: ${numeroConfirmacion}`;
      }

      // Actualizar estado de la compra
      if (pago.compra) {
        pago.compra.estado = EstadoCompra.CONFIRMADA; 
        
        // Marcar camiseta como vendida
        if (pago.compra.camiseta) {
          pago.compra.camiseta.estado = EstadoCamiseta.VENDIDA;  
        }
      }

  await em.persistAndFlush([pago, pago.compra, pago.compra?.camiseta].filter(Boolean));

      res.json({
        success: true,
        message: 'Operación confirmar realizada correctamente.',
        data: pago
      });
    } catch (error) {
      console.error('Error en confirmar pago:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo confirmar pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CONFIRMAR_ERROR'
      });
    }
  }

  // PUT /api/pagos/:id/rechazar - CORREGIDO
  static async rechazar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      
      const orm = req.app.locals.orm;
      
  const em = orm.em.fork();
  const pago = await em.findOne(Pago, { id: parseInt(id) }, {
        populate: ['compra']
      });
      
      if (!pago) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo rechazar pago: pago no encontrado.',
          error: 'Pago no encontrado',
          code: 'NOT_FOUND'
        });
      }

      
      if (pago.estado !== EstadoPago.PENDIENTE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo rechazar pago: solo se pueden rechazar pagos pendientes.',
          error: 'Pago no pendiente',
          code: 'INVALID_STATE'
        });
      }

    
      pago.estado = EstadoPago.FALLIDO;
      pago.notas = pago.notas 
        ? `${pago.notas} - Rechazado: ${motivo || 'Sin motivo especificado'}`
        : `Rechazado: ${motivo || 'Sin motivo especificado'}`;

  await em.persistAndFlush(pago);

      res.json({
        success: true,
        message: 'Operación rechazar realizada correctamente.',
        data: pago
      });
    } catch (error) {
      console.error('Error en rechazar pago:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo rechazar pago: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'RECHAZAR_ERROR'
      });
    }
  }

  // Método auxiliar para generar número de transacción
  private static generarNumeroTransaccion(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN${timestamp.slice(-6)}${random}`;
  }
}