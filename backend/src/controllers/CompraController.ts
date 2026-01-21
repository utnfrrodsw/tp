import { Request, Response } from 'express';
import { Compra, EstadoCompra } from '../entities/Compra';        
import { Usuario } from '../entities/Usuario';
import { Camiseta, EstadoCamiseta } from '../entities/Camiseta';   
import { Descuento } from '../entities/Descuento';
import { MetodoPago } from '../entities/MetodoPago';
import { CompraItem } from '../entities/CompraItem';

export class CompraController {
  // GET /api/compras
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      const compras = await em.find(Compra, {}, { 
        populate: ['comprador', 'camiseta', 'camiseta.categoria', 'metodoPago']
      });
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: compras
      });
    } catch (error) {
      console.error('Error en getAll compras:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener compras: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/compras/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const compra = await em.findOne(Compra, { id: parseInt(id) }, { // ✅ CAMBIAR
        populate: ['comprador', 'camiseta', 'camiseta.categoria', 'metodoPago', 'pagos']
      });
      if (!compra) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener compra: compra no encontrada.',
          error: 'Compra no encontrada',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getById realizada correctamente.',
        data: compra
      });
    } catch (error) {
      console.error('Error en getById compra:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYID_ERROR'
      });
    }
  }

  // GET /api/compras/usuario/:usuarioId
  static async getByUsuario(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      const id = parseInt(usuarioId);
      
      console.log('🔍 getByUsuario - usuarioId:', id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo obtener compras: ID de usuario inválido.',
          error: 'ID de usuario inválido',
          code: 'INVALID_USER_ID'
        });
      }
      
      
      const compras = await em.find(Compra, 
        { comprador: { id } },
        { 
          populate: [
            'comprador',
            'metodoPago',
            'items',
            'items.camiseta',
            'items.camiseta.categoria'
          ],
          orderBy: { fechaCompra: 'DESC' }
        }
      );
      
      console.log('✅ Compras encontradas:', compras.length);
      
      res.json({
        success: true,
        message: compras.length > 0 
          ? 'Operación getByUsuario realizada correctamente.'
          : 'No se encontraron compras para este usuario.',
        data: compras,
        count: compras.length
      });
    } catch (error) {
      console.error('❌ Error en getByUsuario compras:', error);
      console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A');
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener compras: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETBYUSUARIO_ERROR'
      });
    }
  }

  // POST /api/compras
  static async create(req: Request, res: Response) {
    try {
      const { usuarioId, direccionEnvio, metodoPagoId, items, notas } = req.body;
      
      console.log('📦 Datos recibidos:', { usuarioId, direccionEnvio, metodoPagoId, items: items?.length, notas }); // ✅ DEBUG
      
   
      if (!usuarioId) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear la compra: el usuario es obligatorio.',
          error: 'Usuario es obligatorio',
          code: 'USER_REQUIRED'
        });
      }
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear la compra: debes agregar al menos un producto al carrito.',
          error: 'Carrito vacío',
          code: 'CART_EMPTY'
        });
      }
      
      if (!direccionEnvio?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear la compra: la dirección de envío es obligatoria.',
          error: 'Dirección de envío requerida',
          code: 'ADDRESS_REQUIRED'
        });
      }
      
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
     
      const usuario = await em.findOne(Usuario, { id: usuarioId });
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo crear la compra: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      
    
      let metodoPago = metodoPagoId 
        ? await em.findOne(MetodoPago, { id: metodoPagoId }) 
        : await em.findOne(MetodoPago, { nombre: 'Efectivo' });
      
      if (!metodoPago) {
        metodoPago = new MetodoPago('Efectivo', 'Pago en efectivo contra entrega');
        await em.persistAndFlush(metodoPago);
        console.log('✅ Método de pago "Efectivo" creado');
      }
      
      
      const nuevaCompra = em.create(Compra, {
        total: 0,
        comprador: usuario,
        metodoPago,
        direccionEnvio: direccionEnvio.trim(),
        estado: EstadoCompra.PENDIENTE,
        notas: notas?.trim() || undefined
        
      });
      
      let total = 0;
      const itemsValidos: any[] = [];
      const errores: string[] = [];
      
    
      for (const item of items) {
        if (!item.camisetaId || !item.cantidad || item.cantidad <= 0) {
          console.warn('⚠️ Item inválido:', item);
          errores.push(`Item con datos incompletos`);
          continue;
        }
        
        const camiseta = await em.findOne(Camiseta, { id: item.camisetaId });
        if (!camiseta) {
          console.warn('⚠️ Camiseta no encontrada:', item.camisetaId);
          errores.push(`Camiseta ID ${item.camisetaId} no encontrada`);
          continue;
        }
        
        if (camiseta.estado !== EstadoCamiseta.DISPONIBLE) {
          console.warn('⚠️ Camiseta no disponible:', camiseta.titulo, camiseta.estado);
          errores.push(`"${camiseta.titulo}" no está disponible (estado: ${camiseta.estado})`);
          continue;
        }
        
        if (camiseta.stock < item.cantidad) {
          console.warn('⚠️ Stock insuficiente:', camiseta.titulo, 'Stock:', camiseta.stock, 'Solicitado:', item.cantidad);
          errores.push(`Stock insuficiente para "${camiseta.titulo}" (disponible: ${camiseta.stock})`);
          continue;
        }
        
        const precioUnitario = camiseta.precioInicial;
        const subtotal = precioUnitario * item.cantidad;
        total += subtotal;
        
       
        const compraItem = em.create(CompraItem, {
          compra: nuevaCompra,
          camiseta,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal
        });
        
        nuevaCompra.items.add(compraItem);
        itemsValidos.push({ camiseta: camiseta.titulo, cantidad: item.cantidad, subtotal });
        
      
        camiseta.stock -= item.cantidad;
        if (camiseta.stock === 0) {
          camiseta.estado = EstadoCamiseta.VENDIDA;
          console.log(`📦 "${camiseta.titulo}" marcada como VENDIDA (stock: 0)`);
        }
      }
      
     
      if (nuevaCompra.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear la compra: ningún producto válido en el carrito.',
          error: 'Carrito sin productos válidos',
          errores,
          code: 'NO_VALID_ITEMS'
        });
      }
      
      nuevaCompra.total = total;
      
      await em.persistAndFlush(nuevaCompra);
      
      console.log('✅ Compra creada:', {
        id: nuevaCompra.id,
        total,
        items: itemsValidos.length,
        usuario: usuario.email
      });
      
      res.status(201).json({
        success: true,
        message: `Compra creada exitosamente. Total: $${total.toLocaleString()}`,
        data: {
          id: nuevaCompra.id,
          total: nuevaCompra.total,
          estado: nuevaCompra.estado,
          fechaCompra: nuevaCompra.fechaCompra,
          itemsCount: nuevaCompra.items.length,
          items: itemsValidos
        },
        warnings: errores.length > 0 ? errores : undefined
      });
    } catch (error) {
      console.error('❌ Error en create compra:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear la compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CREATE_ERROR'
      });
    }
  }

  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      const compra = await em.findOne(Compra, { id: parseInt(id) }); // ✅ CAMBIAR
      if (!compra) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar compra: compra no encontrada.',
          error: 'Compra no encontrada',
          code: 'NOT_FOUND'
        });
      }
      if (estado && !Object.values(EstadoCompra).includes(estado)) {
        return res.status(400).json({
          success: false,
          message: `No se pudo actualizar compra: estado no válido. Estados permitidos: ${Object.values(EstadoCompra).join(', ')}`,
          error: 'Estado no válido',
          code: 'INVALID_STATE'
        });
      }
      if (estado) {
        compra.estado = estado as EstadoCompra;
      }
      await em.persistAndFlush(compra); 
      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: compra
      });
    } catch (error) {
      console.error('Error en update compra:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo actualizar compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'UPDATE_ERROR'
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      const compra = await em.findOne(Compra, { id: parseInt(id) }); // ✅ CAMBIAR
      if (!compra) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar compra: compra no encontrada.',
          error: 'Compra no encontrada',
          code: 'NOT_FOUND'
        });
      }
      if (compra.estado !== EstadoCompra.PENDIENTE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo eliminar compra: solo se pueden eliminar compras en estado pendiente.',
          error: 'Estado no permitido',
          code: 'INVALID_STATE'
        });
      }
      await em.removeAndFlush(compra); 
      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('Error en delete compra:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'DELETE_ERROR'
      });
    }
  }

  // POST /api/compras/:id/confirmar 
  static async confirmar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 
      const compra = await em.findOne(Compra, { id: parseInt(id) }, { // ✅ CAMBIAR
        populate: ['camiseta']
      });
      if (!compra) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo confirmar compra: compra no encontrada.',
          error: 'Compra no encontrada',
          code: 'NOT_FOUND'
        });
      }
      if (compra.estado !== EstadoCompra.PENDIENTE) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo confirmar compra: la compra ya fue procesada.',
          error: 'Estado no permitido',
          code: 'INVALID_STATE'
        });
      }
      compra.estado = EstadoCompra.CONFIRMADA;
      if (compra.camiseta) {
        compra.camiseta.estado = EstadoCamiseta.VENDIDA;
      }
      await em.persistAndFlush([compra, compra.camiseta]); 
      res.json({
        success: true,
        message: 'Operación confirmar realizada correctamente.',
        data: compra
      });
    } catch (error) {
      console.error('Error en confirmar compra:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo confirmar compra: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'CONFIRMAR_ERROR'
      });
    }
  }
}