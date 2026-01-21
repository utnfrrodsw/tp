import { Request, Response } from 'express';
import { Usuario, UsuarioRol } from '../entities/Usuario';
import { Camiseta } from '../entities/Camiseta';
import { Compra } from '../entities/Compra';
import { Subasta } from '../entities/Subasta';
import '../types/auth';

export class AdminController {
  
  // GET /api/admin/dashboard
  static async getDashboard(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork();

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario no encontrado en token',
          code: 'USER_NOT_FOUND'
        });
      }

      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo obtener dashboard: acceso denegado. Solo administradores.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      // Estadísticas generales
      const totalUsuarios = await em.count(Usuario, { activo: true, rol: UsuarioRol.USUARIO });
      const totalCamisetas = await em.count(Camiseta, {});
      const totalCompras = await em.count(Compra, {});
      const totalSubastas = await em.count(Subasta, { activa: true });

      const compras = await em.find(Compra, {});
      const ingresosTotales = compras.reduce((suma: number, compra: Compra) => suma + Number(compra.total), 0);

   
      const camisetas = await em.find(Camiseta, {}, {
        populate: ['compraItems'], 
        orderBy: { fechaCreacion: 'DESC' }
      });

      const camisetasMasVendidas = camisetas
        .map((camiseta: Camiseta) => ({
          id: camiseta.id,
          titulo: camiseta.titulo,
          equipo: camiseta.equipo,
          imagen: camiseta.imagen,
          precioInicial: camiseta.precioInicial,
          totalVentas: camiseta.compraItems?.length || 0 
        }))
        .sort((a: any, b: any) => b.totalVentas - a.totalVentas)
        .slice(0, 5);

      // Ventas por mes - simplificado
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
      
      const comprasRecientes = await em.find(Compra, {
        fechaCompra: { $gte: seisMesesAtras }
      });

      const ventasPorMes = comprasRecientes.reduce((acc: Record<string, any>, compra: Compra) => {
        const fecha = compra.fechaCompra;
        const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
        
        if (!acc[key]) {
          acc[key] = { mes: fecha.getMonth() + 1, anio: fecha.getFullYear(), cantidad: 0, ingresos: 0 };
        }
        
        acc[key].cantidad += 1;
        acc[key].ingresos += Number(compra.total);
        
        return acc;
      }, {});

      res.json({
        success: true,
        message: 'Operación getDashboard realizada correctamente.',
        data: {
          resumen: {
            totalUsuarios,
            totalCamisetas,
            totalCompras,
            totalSubastas,
            ingresosTotales
          },
          camisetasMasVendidas,
          ventasPorMes: Object.values(ventasPorMes)
        }
      });
    } catch (error) {
      console.error('❌ Error en getDashboard:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener dashboard: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GETDASHBOARD_ERROR'
      });
    }
  }

  // GET /api/admin/usuarios
  static async gestionarUsuarios(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm;
      const em = orm.em.fork(); 

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario no encontrado en token',
          code: 'USER_NOT_FOUND'
        });
      }
      
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo obtener usuarios: acceso denegado. Solo administradores.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const usuarios = await em.find(Usuario, 
        { rol: UsuarioRol.USUARIO }, 
        { 
          populate: ['camisetasVendidas', 'compras'],
          orderBy: { fechaRegistro: 'DESC' }
        }
      );

      const usuariosConStats = usuarios.map((usuario: Usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        email_normalized: usuario.email_normalized,
        activo: usuario.activo,
        fechaRegistro: usuario.fechaRegistro,
        estadisticas: {
          camisetasVendidas: usuario.camisetasVendidas.length,
          comprasRealizadas: usuario.compras.length,
          fechaUltimaActividad: usuario.fechaRegistro
        }
      }));

      res.json({
        success: true,
        message: 'Operación gestionarUsuarios realizada correctamente.',
        data: usuariosConStats,
        count: usuarios.length
      });
    } catch (error) {
      console.error('Error en gestionarUsuarios:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener usuarios: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'GESTIONARUSUARIOS_ERROR'
      });
    }
  }

  // PUT /api/admin/usuarios/:id/toggle-estado
  static async toggleEstadoUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario no encontrado en token',
          code: 'USER_NOT_FOUND'
        });
      }
      
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo cambiar estado de usuario: acceso denegado. Solo administradores.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      const usuario = await em.findOne(Usuario, { id: parseInt(id), rol: UsuarioRol.USUARIO });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo cambiar estado de usuario: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }

      if (usuario.rol === UsuarioRol.ADMINISTRADOR) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo cambiar estado de usuario: no se puede modificar el estado de un administrador.',
          error: 'No permitido',
          code: 'INVALID_STATE'
        });
      }

      usuario.activo = !usuario.activo;

      await em.persistAndFlush(usuario);

      res.json({
        success: true,
        message: `Operación toggleEstadoUsuario realizada correctamente.`,
        data: usuario,
        motivo: motivo || 'Sin motivo especificado'
      });
    } catch (error) {
      console.error('Error en toggleEstadoUsuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo cambiar estado de usuario: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'TOGGLEESTADO_ERROR'
      });
    }
  }

  // GET /api/admin/reportes/ventas
  static async reporteVentas(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const orm = req.app.locals.orm;
      const em = orm.em.fork();
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado - Usuario no encontrado en token',
          code: 'USER_NOT_FOUND'
        });
      }
      
      if (req.user.rol !== UsuarioRol.ADMINISTRADOR) {
        return res.status(403).json({
          success: false,
          message: 'No se pudo generar reporte de ventas: acceso denegado. Solo administradores.',
          error: 'Rol no permitido',
          code: 'FORBIDDEN'
        });
      }

      let filtros: any = {};
      
      if (fechaInicio && fechaFin) {
        filtros.fechaCompra = {
          $gte: new Date(fechaInicio as string),
          $lte: new Date(fechaFin as string)
        };
      }

     
      const compras = await em.find(Compra, filtros, {
        populate: ['items.camiseta', 'items.camiseta.vendedor', 'usuario'], 
        orderBy: { fechaCompra: 'DESC' }
      });

      const ingresosTotales = compras.reduce((suma: number, compra: Compra) => suma + Number(compra.total), 0);
      const promedioVenta = compras.length > 0 ? ingresosTotales / compras.length : 0;
      
      const ventasPorEstado = compras.reduce((acc: Record<string, number>, compra: Compra) => {
        acc[compra.estado] = (acc[compra.estado] || 0) + 1;
        return acc;
      }, {});

      const resumen = {
        totalVentas: compras.length,
        ingresosTotales,
        promedioVenta,
        ventasPorEstado
      };

      res.json({
        success: true,
        message: 'Operación reporteVentas realizada correctamente.',
        data: {
          compras,
          resumen
        }
      });
    } catch (error) {
      console.error('Error en reporteVentas:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo generar reporte de ventas: error interno.',
        error: error instanceof Error ? error.message : 'Error desconocido',
        code: 'REPORTEVENTAS_ERROR'
      });
    }
  }
}