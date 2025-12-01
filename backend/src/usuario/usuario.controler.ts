import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import path from 'path';
import { getTurnosByServicioIdHelper } from '../turno/turno.controler.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import nodemailer from 'nodemailer';
import { processProfileImage } from '../utils/imageProcessor.js';
import { lookTipoServicio } from '../tipoServicio/tipoServ.controler.js';

const __filename = fileURLToPath(import.meta.url);
const em = orm.em;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const __dirname = path.dirname(__filename);

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
    email: string;
  };
}

type PrestatarioWithRating = {
  id: number;
  nombre: string;
  apellido: string;
  nombreFantasia: string;
  tiposDeServicio: Array<{
    id: number;
    nombreTipo: string;
    descripcionTipo: string;
  }>;
  zonas: Array<{ id: number; descripcionZona: string }>;
  calificacion: number;
};

//*Check
async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      Usuario,
      {},
      {
        populate: [
          'turnos',
          'servicios',
          'tiposDeServicio',
          'horarios',
          'servicios.tarea',
        ],
      }
    );
    res.status(200).json({ message: 'found all Usuarios', data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findPrestatariosByTipoServicioAndZona(
  req: Request,
  res: Response
) {
  try {
    // Validated by Zod middleware
    const {
      tipoServicio: nombreTipoServicio,
      zona: nombreZona,
      tarea,
      orderBy,
    } = req.params;
    const { maxItems = 6, page = 1 } = req.query as any;

    let filtroTipoServicio = '';
    if (nombreTipoServicio !== 'Todos' && nombreTipoServicio !== '--tipo--') {
      filtroTipoServicio = nombreTipoServicio;
    }
    let filtroTarea = '';
    if (
      tarea &&
      tarea !== '--tarea--' &&
      tarea !== 'Todas' &&
      tarea !== undefined
    ) {
      filtroTarea = tarea;
    }
    let filtroZona = '';
    if (nombreZona !== 'Todas' && nombreZona !== '--zona--') {
      filtroZona = nombreZona;
    }

    // Build the where clause conditionally
    const whereClause: any = {};
    whereClause.servicios = { estado: 'activo' };
    whereClause.nombreFantasia = { $ne: null };

    if (filtroTipoServicio) {
      whereClause.tiposDeServicio = { nombreTipo: filtroTipoServicio };
    }
    if (filtroTarea) {
      whereClause.servicios = {
        estado: 'activo',
        tarea: { nombreTarea: filtroTarea },
      };
    }
    if (filtroZona) {
      whereClause.zonas = { descripcion_zona: filtroZona };
    }

    const [prestatarios, total] = await em.findAndCount(Usuario, whereClause, {
      populate: [
        'tiposDeServicio',
        'zonas',
        'servicios',
        'servicios.turnos',
        'servicios.tarea',
      ],
      populateWhere: {
        servicios: {
          estado: 'activo',
        },
      },
    });

    if (total === 0) {
      return res.status(404).json({
        message:
          'No se encontraron prestatarios con los criterios especificados',
      });
    }

    // Transform Usuario entities to PrestatarioWithRating
    const prestatariosWithRating = prestatarios.map((prest) => {
      let totalCalificaciones = 0;
      let countCalificaciones = 0;

      const servicios = prest.servicios.getItems();
      const tareas: { nombreTarea: string }[] = [];

      servicios.forEach((s) => {
        tareas.push({ nombreTarea: s.tarea.nombreTarea });
      });

      for (const servicio of servicios) {
        if (servicio.turnos !== null && servicio.turnos !== undefined) {
          const turnos = servicio.turnos;
          for (const turno of turnos) {
            if (
              turno.calificacion !== null &&
              turno.calificacion !== undefined
            ) {
              totalCalificaciones += turno.calificacion;
              countCalificaciones++;
            }
          }
        }
      }

      return {
        id: prest.id,
        nombre: prest.nombre,
        apellido: prest.apellido,
        nombreFantasia: prest.nombreFantasia,
        descripcion: prest.descripcion,
        foto: prest.foto,
        tiposDeServicio: prest.tiposDeServicio.getItems(),
        tareas: tareas,
        calificacion:
          countCalificaciones > 0
            ? totalCalificaciones / countCalificaciones
            : 0,
      };
    });

    if (orderBy) {
      prestatariosWithRating.sort((a: any, b: any) => {
        switch (orderBy) {
          case 'nombre':
            return a.nombreFantasia.localeCompare(b.nombreFantasia);
          case 'calificacion':
            return (b.calificacion || 0) - (a.calificacion || 0);
          default:
            return a.nombreFantasia.localeCompare(b.nombreFantasia);
        }
      });
    }

    // Manual pagination
    const totalPages = Math.ceil(total / maxItems);
    const start = (page - 1) * maxItems;
    const end = start + maxItems;
    const pageItems = prestatariosWithRating.slice(start, end);

    res.status(200).json({
      message: 'Prestatarios encontrados exitosamente',
      data: pageItems,
      pagination: { page, maxItems, totalPages },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneOnlyInfo(req: Request, res: Response) {
  try {
    const { id } = req.params; // Validated by Zod
    const user = await em.findOneOrFail(Usuario, { id: Number(id) }, {});

    res.status(200).json({ message: 'Usuario encontrado', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params; // Validated by Zod
    const user = await em.findOneOrFail(
      Usuario,
      { id: Number(id) },
      {
        populate: [
          'turnos',
          'servicios',
          'servicios.tarea',
          'servicios.tarea.tipoServicio',
          'tiposDeServicio',
          'horarios',
        ],
        populateWhere: {
          servicios: { estado: 'activo' },
        },
      }
    );

    // Ocultar contraseña por seguridad
    (user as any).contrasena = undefined;

    res.status(200).json({ message: 'usuario encontrado', data: user });
  } catch (error: any) {
    res.status(500).json({
      error: 'Error interno en el servidor',
      message: error.message,
    });
  }
}

async function findOneByCookie(req: AuthRequest, res: Response) {
  try {
    const id = req.user?.id;
    if (!id) {
      return res.status(400).json({ message: 'Usuario no autenticado' });
    }

    const user = await em.findOneOrFail(Usuario, { id: Number(id) }, {});
    res.status(200).json({ message: 'found one usuario', data: user });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const userData = req.body; // Already validated by Zod middleware

    // Encrypt password
    if (userData.contrasena) {
      const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
      userData.contrasena = hashedPassword;
    }

    // Set status based on nombreFantasia
    if (userData.nombreFantasia) {
      userData.estado = 'activo';
    } else {
      userData.estado = 'inactivo';
    }
    // Chequeo que no exista usuario con atributos que sean unicos
    const mailExists = await em.findOne(Usuario, { mail: userData.mail });
    if (mailExists) {
      return res.status(409).json({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'El mail ya está registrado por otro usuario',
      });
    }

    const numDocExists = await em.findOne(Usuario, {
      numeroDoc: userData.numeroDoc,
    });
    if (numDocExists) {
      return res.status(409).json({
        error: 'NUMDOC_ALREADY_EXISTS',
        message: 'El número de documento ya está registrado por otro usuario',
      });
    }

    const telExists = await em.findOne(Usuario, {
      telefono: userData.telefono,
    });
    if (telExists) {
      return res.status(409).json({
        error: 'PHONE_ALREADY_EXISTS',
        message: 'El telefono ya está registrado por otro usuario',
      });
    }

    const newUser = em.create(Usuario, userData);
    await em.flush();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Updated to use validated params and body
async function update(req: Request, res: Response) {
  try {
    const { id } = req.params; // Validated by Zod
    const updateData = req.body; // Validated by Zod

    const userToUpdate = await em.findOneOrFail(Usuario, { id: Number(id) });

    // Check for existing email (only if email is being changed)
    if (updateData.mail && userToUpdate.mail !== updateData.mail) {
      const mailExists = await em.findOne(Usuario, { mail: updateData.mail });
      if (mailExists) {
        return res.status(409).json({
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'El mail ya está registrado por otro usuario',
        });
      }
    }

    // Check for existing document number
    if (
      updateData.numeroDoc &&
      userToUpdate.numeroDoc !== updateData.numeroDoc
    ) {
      const numDocExists = await em.findOne(Usuario, {
        numeroDoc: updateData.numeroDoc,
      });
      if (numDocExists) {
        return res.status(409).json({
          error: 'NUMDOC_ALREADY_EXISTS',
          message: 'El número de documento ya está registrado por otro usuario',
        });
      }
    }

    // Check for existing phone
    if (updateData.telefono && userToUpdate.telefono !== updateData.telefono) {
      const telExists = await em.findOne(Usuario, {
        telefono: updateData.telefono,
      });
      if (telExists) {
        return res.status(409).json({
          error: 'PHONE_ALREADY_EXISTS',
          message: 'El telefono ya está registrado por otro usuario',
        });
      }
    }

    em.assign(userToUpdate, updateData);
    await em.flush();

    res.status(200).json({
      message: 'updated usuario',
      data: userToUpdate,
    });
  } catch (error: any) {
    console.log('Hubo un error actualizando la info del user:', error);
    res.status(500).json({ message: error.message });
  }
}

// Updated to use validated params
async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params; // Validated by Zod
    const user = await em.findOneOrFail(Usuario, { id: Number(id) });
    await em.removeAndFlush(user);
    res.status(200).json({ message: 'deleted usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Updated to use validated params and query
async function getCommentsByUserId(req: Request, res: Response) {
  try {
    const { maxItems = 5, page = 1, orderBy = '' } = req.query as any; // Validated by Zod
    const { id: userId } = req.params; // Validated by Zod

    const userWithServices = await em.findOne(
      Usuario,
      { id: Number(userId) },
      { populate: ['servicios'] }
    );

    if (!userWithServices?.servicios?.length) {
      return res.status(404).json({
        message: 'Usuario no encontrado o sin servicios',
      });
    }

    const idServices = userWithServices.servicios.map(
      (servicio: any) => servicio.id
    );

    const commentsData = await getTurnosByServicioIdHelper({
      idServices,
      maxItems,
      page,
      orderBy,
    });

    res.status(200).json({
      message: 'Comentarios encontrados',
      data: commentsData.comments,
      pagination: {
        page,
        maxItems,
        totalComments: commentsData.totalComments,
        totalPages: commentsData.totalPages,
      },
      average: commentsData.average,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Entro al catch de getCommentsByUserId',
      error: 'Se ha producido un error al obtener los comentarios del usuario',
    });
  }
}

async function loginUsuario(req: Request, res: Response) {
  try {
    const { mail, contrasena } = req.query as any; // Validated by Zod

    const emailStr = typeof mail === 'string' ? mail : mail?.[0];
    const passwordStr =
      typeof contrasena === 'string' ? contrasena : contrasena?.[0];

    //No deberia tirar nunca este error pero por las dudaaaaas
    if (!emailStr || !passwordStr) {
      return res
        .status(400)
        .json({ message: 'Mail y contraseña son requeridos' });
    }

    const usuario = await em.findOne(Usuario, { mail: emailStr });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const passwordMatch = await bcrypt.compare(passwordStr, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const { contrasena: _, ...usuarioSinContrasena } = usuario;
    const rol =
      usuarioSinContrasena.nombreFantasia === null ? 'cliente' : 'prestador';

    const token = jwt.sign(
      { id: usuarioSinContrasena.id, rol, email: usuarioSinContrasena.mail },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      data: usuarioSinContrasena,
    });
  } catch (error: any) {
    console.error('Error en loginUsuario:', error);
    return res.status(500).json({
      message: 'Error interno en login',
      error: error.message,
    });
  }
}

// Configure mailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'reformixoficial@gmail.com',
    pass: 'mkyg zmvc hjux pkqr',
  },
});

async function recuperarContrasena(req: Request, res: Response) {
  try {
    const { mail } = req.body; // Validated by Zod

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    codigosRecuperacion[mail] = {
      codigo,
      expiracion: new Date(Date.now() + 5 * 60 * 1000),
    };

    await transporter.sendMail({
      from: 'forgotpassword <reformixoficial@gmail.com>',
      to: mail,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${codigo} y expirará en 5 minutos`,
    });

    return res.status(200).json({
      message: 'Correo de recuperación enviado',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}

const codigosRecuperacion: {
  [mail: string]: { codigo: string; expiracion: Date };
} = {};

async function validarCodigoRecuperacion(req: Request, res: Response) {
  try {
    const { mail, codigo } = req.body; // Validated by Zod

    const registro = codigosRecuperacion[mail];
    if (
      !registro ||
      registro.expiracion < new Date() ||
      registro.codigo !== codigo
    ) {
      return res.status(400).json({
        message: 'Código inválido o expirado',
      });
    }

    return res.status(200).json({
      message: 'Código válido',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}

async function cambiarPassword(req: Request, res: Response) {
  try {
    const { mail, codigo, nuevaContrasena } = req.body; // Validated by Zod

    const registro = codigosRecuperacion[mail];
    if (
      !registro ||
      registro.expiracion < new Date() ||
      registro.codigo !== codigo
    ) {
      return res.status(400).json({
        message: 'Código inválido o expirado',
      });
    }

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    usuario.contrasena = await bcrypt.hash(nuevaContrasena, 10);
    await em.flush();

    delete codigosRecuperacion[mail];

    return res.status(200).json({
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}

async function putOauth(
  mail: string,
  estado: 'active' | 'pending' | 'rejected',
  stripeAccountId?: string,
  chargesEnabled?: boolean,
  payoutsEnabled?: boolean,
  createdAt?: Date,
  updatedAt?: Date
) {
  let guardar;
  if (stripeAccountId) {
    guardar = {
      onboardingStatus: estado,
      stripeAccountId,
      chargesEnabled,
      payoutsEnabled,
      createdAt,
      updatedAt,
      estado: 'activo',
    };
  } else {
    guardar = { onboardingStatus: estado };
  }
  try {
    const updateUser = await em.findOneOrFail(Usuario, { mail });
    em.assign(updateUser, guardar);
    await em.flush();
    console.log('Tokens de stripe actualizados');
  } catch (error: any) {
    console.error('Error en putOauth:', error);
  }
}

async function getOauth(id: number) {
  try {
    const user = await em.findOneOrFail(Usuario, { id }, {});
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function uploadProfileImage(req: Request, res: Response) {
  const emFork = em.fork();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const { userId } = req.params; // Validated by Zod
    const user = await emFork.findOne(Usuario, { id: Number(userId) });

    if (!user) {
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Delete old photo if exists
    if (
      user.foto &&
      user.foto !==
        'https://backend-patient-morning-1303.fly.dev/uploads/profiles/default-avatar.webp'
    ) {
      const relativePath = user.foto.includes('/uploads/')
        ? user.foto.substring(user.foto.indexOf('/uploads/'))
        : user.foto;

      const RutaFotoVieja = path.join(__dirname, '../../public', relativePath);

      try {
        await fs.unlink(RutaFotoVieja);
      } catch (error) {
        console.error('Error al eliminar la foto vieja:', error);
      }
    }

    // Process and optimize image
    const urlOptimizada = await processProfileImage(
      req.file.path,
      Number(user.id)
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction
      ? process.env.BASE_URL || 'https://backend-patient-morning-1303.fly.dev'
      : 'http://localhost:3000';

    const fullImageUrl = `${baseUrl}${urlOptimizada}`;
    await fs.unlink(req.file.path);

    // Update user in database
    user.foto = fullImageUrl;
    await emFork.flush();

    res.status(200).json({
      message: 'Foto de perfil actualizada correctamente',
      imageUrl: fullImageUrl,
      user: {
        id: user.id,
        foto: user.foto,
      },
    });
  } catch (error) {
    console.error('Error al subir la imagen de perfil:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Error al eliminar la imagen de perfil:', error);
      }
    }
    res.status(500).json({ error: 'Error al subir la imagen de perfil' });
  }
}

async function lookUserTipoServicio(id: number, tareaId: number, act: boolean) {
  try {
    const tipoServicioEntity = await lookTipoServicio(tareaId);
    if (act) {
      // Verificar si el usuario ya tiene el tipo de servicio
      const user = await em.findOne(Usuario, {
        id,
        tiposDeServicio: { id: tipoServicioEntity.id },
      });

      if (!user) {
        // Si no lo tiene, agregarlo
        const userToUpdate = await em.findOneOrFail(Usuario, { id });
        userToUpdate.tiposDeServicio.add(tipoServicioEntity);
        await em.flush();
      }
    } else {
      // Verificar si el usuario tiene otros servicios activos de este tipo
      const user = await em.find(Usuario, {
        id,
        servicios: {
          estado: 'activo',
          tarea: { tipoServicio: { id: tipoServicioEntity.id } },
        },
      });

      if (user.length === 0) {
        // Si no tiene otros servicios activos de este tipo, eliminarlo
        const userToUpdate = await em.findOneOrFail(
          Usuario,
          { id },
          { populate: ['tiposDeServicio'] }
        );
        userToUpdate.tiposDeServicio.remove(tipoServicioEntity);

        await em.flush();
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export {
  findAll,
  findPrestatariosByTipoServicioAndZona,
  findOne,
  findOneOnlyInfo,
  add,
  update,
  loginUsuario,
  remove,
  getCommentsByUserId,
  findOneByCookie,
  recuperarContrasena,
  validarCodigoRecuperacion,
  cambiarPassword,
  putOauth,
  getOauth,
  uploadProfileImage,
  lookUserTipoServicio,
};
