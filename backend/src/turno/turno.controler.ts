import { Request, Response, NextFunction } from 'express';
import { Turno } from './turno.entity.js';
import { orm } from '../shared/db/orm.js';
import {
  moderateContent,
  type ModerationResult,
} from '../shared/services/openai.service.js';
import send from 'send';
import { sendEmail } from '../mail/mail.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
    email: string;
  };
}
const em = orm.em;

// Find all turns
async function findall(req: Request, res: Response) {
  try {
    const turns = await em.find(
      Turno,
      {},
      { populate: ['usuario', 'servicio'] }
    );
    res.status(200).json({ message: 'found all turns', data: turns });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Find one turn by date and hour
async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turn = await em.findOne(
      Turno,
      { id },
      { populate: ['usuario', 'servicio'] }
    );
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }
    res.status(200).json({ message: 'found turn', data: turn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new turn
async function addWithCookie(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const id = req.user.id;
    const input = req.body; // Datos validados por el esquema
    input.usuario = id; // Asignar el ID del usuario autenticado
    const newTurn = em.create(Turno, input);
    await em.persistAndFlush(newTurn);

    sendEmail(
      req.user.email,
      'Nuevo Turno Creado',
      `Se ha creado un nuevo turno para el servicio ${
        newTurn.servicio?.tarea?.nombreTarea || ''
      }. El día ${newTurn.fechaHora}.`
    );

    res
      .status(201)
      .json({ message: 'Turn created successfully', data: newTurn });
  } catch (error: any) {
    console.error('Error al crear el turno:', error);
    res
      .status(500)
      .json({ message: 'Entro al catch de nuevo turno: ' + error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newTurn = em.create(Turno, req.body);
    await em.persistAndFlush(newTurn);
    res
      .status(201)
      .json({ message: 'Turno creado exitosamente', data: newTurn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update an existing turn
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const input = req.body; // Datos validados por el esquema
    const onlyEstadoChanged =
      Object.keys(input).length === 1 && input.estado !== undefined;

    const turn = await em.findOne(
      Turno,
      {
        id,
      },
      { populate: ['usuario', 'servicio'] }
    );

    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }

    // Check if there's a comment to moderate
    if (input.comentario) {
      console.log('🔍 Moderating comment:', input.comentario);
      const moderationResult = await moderateContent(input.comentario);
      console.log('📊 Moderation result:', moderationResult);

      if (moderationResult.flagged) {
        const moderationType = moderationResult.fallback
          ? 'fallback keyword detection'
          : 'OpenAI moderation';
        return res.status(403).json({
          message: `Comentario bloqueado por contenido inapropiado: (${moderationType})`,
          data: {
            flagged: true,
            categories: moderationResult.categories,
            moderationType,
            foundKeywords: moderationResult.foundKeywords || [],
          },
        });
      }

      if (moderationResult.error && !moderationResult.fallback) {
        console.log(
          '⚠️ OpenAI moderation service failed, but content passed fallback check'
        );
      }
    }

    // Update the turn if moderation passed or no comment provided
    em.assign(turn, input);
    await em.persistAndFlush(turn);

    if (onlyEstadoChanged) {
      sendEmail(
        turn.usuario.mail,
        'Turno Actualizado',
        `El estado de tu turno para el servicio ${turn.servicio.tarea.nombreTarea} del dia ${turn.fechaHora} ha sido actualizado a ${input.estado}.`
      );
    }
    res.status(200).json({ message: 'Turn updated successfully', data: turn });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a turn
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turn = await em.findOne(
      Turno,
      { id },
      { populate: ['usuario', 'servicio'] }
    );
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' });
    }
    await em.removeAndFlush(turn);
    res.status(200).json({ message: 'Turn deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Get turns by user ID
async function getTurnosByUserId(req: AuthRequest, res: Response) {
  const userId = Number(req.user?.id); // ID del usuario autenticado que viene de la cookie
  const cantItemsPerPage = Number(req.params.cantItemsPerPage) || 10;
  const currentPage = Number(req.params.currentPage) || 1;
  const selectedValueShow = req.params.selectedValueShow || '';
  const selectedValueOrder = req.params.selectedValueOrder || '';

  // Determinar el filtro de calificación según selectedValueShow
  let calificacionFilter: any = {};
  switch (selectedValueShow) {
    case 'faltanCalificar':
      calificacionFilter = { calificacion: null, estado: 'completado' };
      break;
    case 'calificados':
      calificacionFilter = { calificacion: { $ne: null } };
      break;
    case 'cancelados':
      calificacionFilter = { estado: 'cancelado' };
      break;
    case 'pendientes':
      calificacionFilter = { estado: 'pendiente' };
      break;
    case 'confirmados':
      calificacionFilter = { estado: 'confirmado' };
      break;
    case 'completado':
      calificacionFilter = {
        estado: 'completado',
      };
      break;
    case 'porPagar':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $none: { estado: ['succeeded', 'processing'] } },
      };
      break;
    case 'pagado':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: { $eq: 'succeeded' } } },
      };
      break;
    case 'pagoPendiente':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'processing' } },
      };
      break;
  }
  let selectedValueOrderShow;
  switch (selectedValueOrder) {
    case 'fechaA':
      selectedValueOrderShow = { fechaHora: 1 };
      break;
    case 'calificacionM':
      selectedValueOrderShow = { fechaHora: -1 };
      break;
    case 'calificacionB':
      selectedValueOrderShow = { calificacion: -1 };
      break;
    case 'calificacionP':
      selectedValueOrderShow = { calificacion: 1 };
      break;
    default:
      selectedValueOrderShow = { fechaHora: -1 };
  }

  // estructura para poder filtrar
  const where = {
    usuario: { id: userId },
    ...calificacionFilter,
  };
  try {
    // Buscar los turnos del usuario, populando toda la información necesaria en una sola consulta
    const [turnos, totalCount] = await em.findAndCount(Turno, where, {
      populate: [
        'servicio.tarea.tipoServicio',
        'servicio.usuario',
        'usuario',
        'pagos',
      ],
      limit: cantItemsPerPage,
      offset: (currentPage - 1) * cantItemsPerPage,
      orderBy: [selectedValueOrderShow],
    });

    // Agregar el campo hasPagoAprobado a cada turno (corrigiendo espacios y mayúsculas)
    const turnosConPagoAprobado = turnos.map((turno: any) => {
      // Si pagos es una colección, conviértelo a array
      const pagosArray = Array.isArray(turno.pagos)
        ? turno.pagos
        : turno.pagos?.toArray
        ? turno.pagos.toArray()
        : [];
      return {
        ...turno,
        hayPagoAprobado: pagosArray.some(
          (pago: any) =>
            typeof pago.estado === 'string' &&
            pago.estado.trim().toLowerCase() === 'succeeded'
        ),
      };
    });
    console.log('Turnos encontrados para el usuario:', turnosConPagoAprobado);

    res.status(200).json({
      message: 'found turns by user id',
      data: turnosConPagoAprobado,
      pagination: {
        totalPages: Math.ceil(totalCount / cantItemsPerPage),
        currentPage: currentPage,
        totalItems: totalCount,
        itemsPerPage: cantItemsPerPage,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Entro al catch:----------------------------------------',
      error: error.message,
    });
  }
}

async function getTurnosByServicioIdHelper(params: {
  idServices: number[];
  maxItems: number;
  page: number;
  orderBy?: any;
}) {
  try {
    const { idServices, maxItems, page, orderBy } = params;
    const offset = (page - 1) * maxItems;

    // Configurar el orden basado en el parámetro orderBy
    let orderByClause;
    switch (orderBy) {
      case 'new':
        orderByClause = { fechaHora: -1 };
        break;
      case 'old':
        orderByClause = { fechaHora: 1 };
        break;
      case 'best':
        orderByClause = { calificacion: -1 };
        break;
      case 'worst':
        orderByClause = { calificacion: 1 };
        break;
      default:
        orderByClause = { fechaHora: -1 };
    }

    // Obtener los comentarios paginados
    const [comments, total] = await em.findAndCount(
      Turno,
      {
        servicio: { id: { $in: idServices } },
        estado: 'completado',
        calificacion: { $ne: null },
      },
      {
        populate: ['usuario', 'servicio'],
        limit: maxItems,
        offset,
        orderBy: orderByClause,
      }
    );
    let totalStars = 0;
    // Calcular el promedio de estrellas
    comments.forEach((comment) => {
      totalStars += comment.calificacion || 0;
    });
    const average = comments.length > 0 ? totalStars / comments.length : 0;
    return {
      comments,
      totalComments: total,
      totalPages: Math.ceil(total / maxItems),
      average: average,
    };
  } catch (error) {
    throw error;
  }
}

async function getTurnsPerDay(req: Request, res: Response) {
  const userId = req.params.id; // ID del usuario
  const date = req.params.date; // fecha seleccionada para hacer la búsqueda

  try {
    const start = new Date(date + 'T00:00:00');

    const end = new Date(date + 'T23:59:59.999Z');

    const id = Number.parseInt(userId);
    const turnos = await em.find(
      Turno,
      {
        servicio: { usuario: { id: id } },
        fechaHora: {
          $gte: start, // Inicio del rango
          $lte: end, // Fin del rango
        },
        estado: { $ne: 'cancelado' },
      },
      { populate: ['servicio.tarea'] }
    );
    res.status(200).json({ message: 'found turns for user', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getTurnosByPrestadorId(req: Request, res: Response) {
  const prestadorId = Number.parseInt(req.params.id);
  const cantItemsPerPage = Number(req.params.cantItemsPerPage) || 10;
  const currentPage = Number(req.params.currentPage) || 1;
  const selectedValueShow = req.params.selectedValueShow || '';
  // Tratar 'none' como placeholder vacío para selectedValueOrder
  const selectedValueOrder =
    req.params.selectedValueOrder === 'none'
      ? ''
      : req.params.selectedValueOrder || '';
  const searchQuery = req.params.searchQuery || '';

  // Determinar el filtro de calificación según selectedValueShow
  let calificacionFilter: any = {};

  switch (selectedValueShow) {
    case 'faltanCalificar':
      calificacionFilter = { calificacion: null, estado: 'completado' };
      break;
    case 'calificados':
      calificacionFilter = { calificacion: { $ne: null } };
      break;
    case 'cancelados':
      calificacionFilter = { estado: 'cancelado' };
      break;
    case 'pendientes':
      calificacionFilter = { estado: 'pendiente' };
      break;
    case 'confirmados':
      calificacionFilter = { estado: 'confirmado' };
      break;
    case 'completado':
      calificacionFilter = {
        estado: 'completado',
      };
      break;
    case 'porPagar':
      calificacionFilter = {
        estado: 'completado',
        $and: [
          {
            pagos: { $none: { estado: 'aprobado' } },
          },
          {
            pagos: { $none: { estado: 'pendiente' } },
          },
        ],
      };
      break;
    case 'pagado':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'aprobado' } },
      };
      break;
    case 'pagoPendiente':
      calificacionFilter = {
        estado: 'completado',
        pagos: { $some: { estado: 'pendiente' } },
      };
      break;
    case 'all':
      // Sin filtro específico
      calificacionFilter = {};
      break;
    default:
      // Manejar filtros múltiples: multipleStates:pendiente,confirmado,cancelado
      if (selectedValueShow.startsWith('multipleStates:')) {
        const estados = selectedValueShow
          .replace('multipleStates:', '')
          .split(',');
        calificacionFilter = {
          estado: { $in: estados },
        };
      }
      break;
  }

  // Variable para detectar si hay múltiples estados filtrados
  const isMultipleStatesFilter =
    selectedValueShow.startsWith('multipleStates:');

  let selectedValueOrderShow;

  // Si hay múltiples estados filtrados, usar ordenamiento personalizado por estado
  if (isMultipleStatesFilter) {
    // Para múltiples estados, haremos el ordenamiento en JavaScript después de la consulta
    // Por ahora usamos ordenamiento por fecha como base
    selectedValueOrderShow = { fechaHora: -1 };
  } else {
    // Ordenamiento normal para filtros únicos
    switch (selectedValueOrder) {
      case 'fechaA':
        selectedValueOrderShow = { fechaHora: 1 };
        break;
      case 'fechaD':
        selectedValueOrderShow = { fechaHora: -1 };
        break;
      case 'montoA':
        selectedValueOrderShow = { montoFinal: 1 };
        console.log('Aplicando ordenamiento por monto ascendente');
        break;
      case 'montoD':
        selectedValueOrderShow = { montoFinal: -1 };
        console.log('Aplicando ordenamiento por monto descendente');
        break;
      case 'calificacionM':
        selectedValueOrderShow = { fechaHora: -1 };
        break;
      case 'calificacionB':
        selectedValueOrderShow = { calificacion: -1 };
        break;
      case 'calificacionP':
        selectedValueOrderShow = { calificacion: 1 };
        break;
      default:
        selectedValueOrderShow = { id: -1 }; // Ordenar por ID descendente (entradas más recientes primero)
    }
  }

  // Buscar turnos donde el PRESTATARIO (servicio.usuario) es el prestadorId
  let where: any = {
    servicio: { usuario: { id: prestadorId } },
    ...calificacionFilter,
  };
  // Agregar filtro de búsqueda por nombre y apellido del cliente si se proporciona
  if (searchQuery && searchQuery.trim() !== '') {
    const searchTerm = searchQuery.trim();
    where.usuario = {
      ...where.usuario,
      $or: [
        { nombre: { $like: `%${searchTerm}%` } },
        { apellido: { $like: `%${searchTerm}%` } },
      ],
    };
  }

  try {
    // Total de turnos para el paginado
    const totalCount = await em.count(Turno, where);

    let turnos;
    if (isMultipleStatesFilter) {
      // Para múltiples filtros, obtenemos TODOS los turnos primero
      const allTurnos = await em.find(Turno, where, {
        populate: [
          'servicio.tarea.tipoServicio',
          'servicio.usuario',
          'usuario',
          'pagos',
        ],
        // Sin limit ni offset - obtenemos todos
      });
      // Aplicar ordenamiento personalizado a TODOS los turnos
      allTurnos.sort((a, b) => {
        // Definir el orden de prioridad para los estados
        const estadoOrder: { [key: string]: number } = {
          pendiente: 1,
          confirmado: 2,
          completado: 3,
          cancelado: 4,
        };

        const prioridadA = estadoOrder[a.estado] || 5;
        const prioridadB = estadoOrder[b.estado] || 5;

        // Primero ordenar por prioridad de estado
        if (prioridadA !== prioridadB) {
          return prioridadA - prioridadB;
        }

        // Si tienen el mismo estado, aplicar el ordenamiento seleccionado por el usuario
        switch (selectedValueOrder) {
          case 'fechaA':
            return (
              new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
            );
          case 'fechaD':
            return (
              new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
            );
          case 'montoA':
            return (a.montoFinal || 0) - (b.montoFinal || 0);
          case 'montoD':
            return (b.montoFinal || 0) - (a.montoFinal || 0);
          case 'calificacionP':
            return (a.calificacion || 0) - (b.calificacion || 0);
          case 'calificacionB':
            return (b.calificacion || 0) - (a.calificacion || 0);
          default:
            // Por defecto, ordenar por ID descendente (entradas más recientes primero)
            return (b.id || 0) - (a.id || 0);
        }
      });
      // Aplicar paginación DESPUÉS del ordenamiento
      const startIndex = (currentPage - 1) * cantItemsPerPage;
      const endIndex = startIndex + cantItemsPerPage;
      turnos = allTurnos.slice(startIndex, endIndex);
    } else {
      // Para filtros únicos, usar la consulta normal con paginación en BD
      turnos = await em.find(Turno, where, {
        populate: [
          'servicio.tarea.tipoServicio',
          'servicio.usuario',
          'usuario',
          'pagos',
        ],
        limit: cantItemsPerPage,
        offset: (currentPage - 1) * cantItemsPerPage,
        orderBy: selectedValueOrderShow,
      });
    }

    // Log para debuggear ordenamiento por monto
    if (selectedValueOrder.includes('monto')) {
      console.log(
        'Valores de montoFinal encontrados:',
        turnos.map((t) => ({
          id: t.id,
          montoFinal: t.montoFinal,
          estado: t.estado,
        }))
      );
    }

    const hayPagoAprobado = turnos.some(
      (turno) =>
        turno.pagos &&
        turno.pagos.toArray().some((pago: any) => pago.estado === 'aprobado')
    );

    res.status(200).json({
      message: 'found turns by prestador id',
      data: turnos,
      pagination: {
        totalPages: Math.ceil(totalCount / cantItemsPerPage),
        currentPage: currentPage,
        totalItems: totalCount,
        itemsPerPage: cantItemsPerPage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  findall,
  findone,
  add,
  update,
  remove,
  getTurnosByServicioIdHelper,
  getTurnosByUserId,
  getTurnosByPrestadorId,
  getTurnsPerDay,
  addWithCookie,
};
