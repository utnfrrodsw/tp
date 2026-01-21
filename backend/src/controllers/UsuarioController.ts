import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Usuario, UsuarioRol } from '../entities/Usuario';  

export class UsuarioController {
  
  // GET /api/usuarios
  static async getAll(req: Request, res: Response) {
    try {
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const usuarios = await em.find(Usuario, { activo: true });
      
      res.json({
        success: true,
        message: 'Operación getAll realizada correctamente.',
        data: usuarios,
        count: usuarios.length
      });
    } catch (error) {
      console.error('Error en getAll usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener usuarios: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'GETALL_ERROR'
      });
    }
  }

  // GET /api/usuarios/:id
  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const usuario = await em.findOne(Usuario, { id: parseInt(id), activo: true });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo obtener usuario: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }
      res.json({
        success: true,
        message: 'Operación getOne realizada correctamente.',
        data: usuario
      });
    } catch (error) {
      console.error('Error en getOne usuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo obtener usuario: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'GETONE_ERROR'
      });
    }
  }

  // POST /api/usuarios
  static async create(req: Request, res: Response) {
    try {
      const { nombre, apellido, email, contrasena, direccion, telefono, rol } = req.body;
      
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: el nombre es obligatorio.',
          error: 'Nombre obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!apellido) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: el apellido es obligatorio.',
          error: 'Apellido obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: el email es obligatorio.',
          error: 'Email obligatorio',
          code: 'INVALID_DATA'
        });
      }
      if (!contrasena) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: la contraseña es obligatoria.',
          error: 'Contraseña obligatoria',
          code: 'INVALID_DATA'
        });
      }
      if (!direccion) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: la dirección es obligatoria.',
          error: 'Dirección obligatoria',
          code: 'INVALID_DATA'
        });
      }
      if (!telefono) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: el teléfono es obligatorio.',
          error: 'Teléfono obligatorio',
          code: 'INVALID_DATA'
        });
      }

      // Validaciones adicionales
      if (nombre.length < 2 || apellido.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: nombre y apellido deben tener al menos 2 caracteres.',
          error: 'Nombre/apellido corto',
          code: 'INVALID_DATA'
        });
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: el formato del email no es válido.',
          error: 'Email inválido',
          code: 'INVALID_DATA'
        });
      }

      if (contrasena.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: la contraseña debe tener al menos 6 caracteres.',
          error: 'Contraseña corta',
          code: 'INVALID_DATA'
        });
      }

      
      if (rol && !Object.values(UsuarioRol).includes(rol)) {
        return res.status(400).json({
          success: false,
          message: `No se pudo crear usuario: rol inválido. Roles permitidos: ${Object.values(UsuarioRol).join(', ')}`,
          error: 'Rol inválido',
          code: 'INVALID_DATA'
        });
      }

      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      // Verificar que el email no exista
      const existeUsuario = await em.findOne(Usuario, { email });
      if (existeUsuario) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo crear usuario: ya existe un usuario con ese email.',
          error: 'Duplicado',
          code: 'DUPLICATE'
        });
      }

     
      const nuevoUsuario = new Usuario(
        nombre,
        apellido,
        email,
        contrasena,
        direccion,
        telefono,
        rol as UsuarioRol || UsuarioRol.USUARIO  
      );

      em.persist(nuevoUsuario);
      await em.flush();

      res.status(201).json({
        success: true,
        message: 'Operación create realizada correctamente.',
        data: nuevoUsuario
      });
    } catch (error) {
      console.error('Error en create usuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo crear usuario: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'CREATE_ERROR'
      });
    }
  }

  // PUT /api/usuarios/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, apellido, email, direccion, telefono, rol } = req.body; 
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const usuario = await em.findOne(Usuario, { id: parseInt(id), activo: true });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar usuario: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }

     
      if (email && email !== usuario.email) {
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'No se pudo actualizar usuario: el formato del email no es válido.',
            error: 'Email inválido',
            code: 'INVALID_DATA'
          });
        }

        // Verificar que el nuevo email no exista
        const existeOtro = await em.findOne(Usuario, { 
          email, 
          id: { $ne: parseInt(id) } 
        });
        if (existeOtro) {
          return res.status(400).json({
            success: false,
            message: 'No se pudo actualizar usuario: ya existe otro usuario con ese email.',
            error: 'Duplicado',
            code: 'DUPLICATE'
          });
        }
      }

   
      if (rol && !Object.values(UsuarioRol).includes(rol)) {
        return res.status(400).json({
          success: false,
          message: `No se pudo actualizar usuario: rol inválido. Roles permitidos: ${Object.values(UsuarioRol).join(', ')}`,
          error: 'Rol inválido',
          code: 'INVALID_DATA'
        });
      }

      // Actualizar solo los campos enviados
      if (nombre) usuario.nombre = nombre;
      if (apellido) usuario.apellido = apellido;
      if (email) usuario.email = email;
      if (direccion) usuario.direccion = direccion;
      if (telefono) usuario.telefono = telefono;
      if (rol) usuario.rol = rol as UsuarioRol;  

      await em.flush();

      res.json({
        success: true,
        message: 'Operación update realizada correctamente.',
        data: usuario
      });
    } catch (error) {
      console.error('Error en update usuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo actualizar usuario: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'UPDATE_ERROR'
      });
    }
  }

  // DELETE /api/usuarios/:id (soft delete)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const usuario = await em.findOne(Usuario, { id: parseInt(id), activo: true });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo eliminar usuario: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }

      // Soft delete: marcar como inactivo en lugar de eliminar
      usuario.activo = false;
      await em.flush();

      res.json({
        success: true,
        message: 'Operación delete realizada correctamente.'
      });
    } catch (error) {
      console.error('Error en delete usuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo eliminar usuario: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'DELETE_ERROR'
      });
    }
  }


  static async toggleEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orm = req.app.locals.orm as MikroORM;
      const em = orm.em.fork();
      
      const usuario = await em.findOne(Usuario, { id: parseInt(id) });
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo cambiar estado: usuario no encontrado.',
          error: 'Usuario no encontrado',
          code: 'NOT_FOUND'
        });
      }

      // Toggle del estado
      usuario.activo = !usuario.activo;
      await em.flush();

      res.json({
        success: true,
        message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente.`,
        data: usuario
      });
    } catch (error) {
      console.error('Error en toggleEstado usuario:', error);
      res.status(500).json({
        success: false,
        message: 'No se pudo cambiar estado del usuario: error interno.',
        error: error instanceof Error ? error.message : String(error),
        code: 'TOGGLE_ERROR'
      });
    }
  }
}