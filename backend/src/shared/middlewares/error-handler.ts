// Middleware central de manejo de errores. Va SIEMPRE último en el stack de Express.
//
// Traduce cualquier error que ocurra en la app a una respuesta HTTP con el formato
// único de la API: { message, errors? }. Gracias a esto los controllers no arman
// respuestas de error a mano: simplemente lanzan el error y esto lo captura.
//
// Nota: en Express 5 los errores de handlers async (promesas rechazadas) llegan
// acá automáticamente, sin necesidad de try/catch en cada controller.
import { NextFunction, Request, Response } from 'express';
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
  DatabaseError,
} from 'sequelize';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';
import { env } from '../config/env';

type ErrorResponse = {
  message: string;
  errors?: unknown;
};

/**
 * ¿Es un error HTTP 4xx de un middleware de Express (por ejemplo express.json)?
 * Esos errores traen el código en `status`.
 */
function isClientHttpError(error: unknown): error is { status: number } {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === 'number' && status >= 400 && status < 500;
}

// Express identifica a este middleware como manejador de errores por tener 4 parámetros:
// si se saca `next`, deja de funcionar aunque no se use.
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let status = 500;
  let body: ErrorResponse = {
    message: 'Ocurrió un error inesperado. Intentá de nuevo en unos minutos.',
  };

  // 1) Errores de negocio propios: ya traen su código y su mensaje para el usuario.
  if (error instanceof AppError) {
    status = error.status;
    body = { message: error.message };
    if (error.details !== undefined) body.errors = error.details;
  }

  // 2) Error de Zod que haya escapado del middleware de validación.
  else if (error instanceof ZodError) {
    status = 400;
    body = {
      message: 'Los datos enviados no son válidos.',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.') || '(raíz)',
        message: issue.message,
      })),
    };
  }

  // 3) Violación de índice único: por ejemplo, un email o username ya registrado.
  else if (error instanceof UniqueConstraintError) {
    status = 409;
    body = {
      message: 'Ya existe un registro con esos datos.',
      errors: error.errors.map((e) => ({
        field: e.path ?? '(desconocido)',
        message: `El valor "${String(e.value)}" ya está en uso.`,
      })),
    };
  }

  // 4) Violación de clave foránea: se referenció algo que no existe, o se intenta
  //    borrar un registro del que dependen otros.
  else if (error instanceof ForeignKeyConstraintError) {
    status = 409;
    body = {
      message:
        'La operación no se puede completar porque el registro está relacionado con otros datos.',
    };
  }

  // 5) Validaciones declaradas en el modelo de Sequelize (allowNull, isEmail, min/max...).
  else if (error instanceof SequelizeValidationError) {
    status = 400;
    body = {
      message: 'Los datos enviados no son válidos.',
      errors: error.errors.map((e) => ({
        field: e.path ?? '(desconocido)',
        message: e.message,
      })),
    };
  }

  // 6) Cualquier otro error de base de datos: no se expone el SQL al cliente.
  else if (error instanceof DatabaseError) {
    status = 500;
    body = { message: 'Error al acceder a la base de datos.' };
  }

  // 7) Errores de express.json() (JSON mal formado, body demasiado grande): traen
  //    su propio status 4xx. Sin este caso saldrían como 500, como si la culpa
  //    fuera del servidor y no del pedido.
  else if (isClientHttpError(error)) {
    status = error.status;
    body = { message: 'El cuerpo de la request no es válido.' };
  }

  // Los 5xx se loguean completos en el servidor: es el único lugar donde queremos
  // ver el stack. Los 4xx son errores esperables del cliente y no ensucian el log.
  if (status >= 500) {
    console.error('[error]', error);
  }

  // En desarrollo se agrega el detalle técnico para poder depurar sin mirar la
  // consola. Se pide NODE_ENV=development explícito (y no "no es producción"):
  // un deploy que olvide setear NODE_ENV no tiene que mostrar errores de MySQL.
  if (env.nodeEnv === 'development' && status >= 500 && error instanceof Error) {
    body.errors = { name: error.name, detail: error.message };
  }

  res.status(status).json(body);
}
