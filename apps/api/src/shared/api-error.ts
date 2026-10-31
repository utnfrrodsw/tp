import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BAD_GATEWAY'
  | 'SERVICE_UNAVAILABLE'
  | 'PAYLOAD_TOO_LARGE'
  | 'INTERNAL_SERVER_ERROR';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getNestedError = (error: unknown): Record<string, unknown> | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  return error as Record<string, unknown>;
};

const getPostgresCode = (error: unknown): string | undefined => {
  const visited = new Set<unknown>();
  let current = error;

  while (current && !visited.has(current)) {
    visited.add(current);
    const record = getNestedError(current);
    if (!record) return undefined;
    if (typeof record.code === 'string' && /^\d{5}$/.test(record.code)) return record.code;
    current = record.cause ?? record.driverException;
  }

  return undefined;
};

const getRequestError = (error: unknown): ApiError | undefined => {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    return new ApiError(400, 'VALIDATION_ERROR', 'Los datos enviados no son válidos', {
      fields: error.issues.map(({ path, message }) => ({ field: path.join('.'), message }))
    });
  }

  const record = getNestedError(error);
  if (record?.type === 'entity.parse.failed') {
    return new ApiError(400, 'BAD_REQUEST', 'El cuerpo de la petición debe contener JSON válido');
  }
  if (record?.type === 'entity.too.large') {
    return new ApiError(413, 'PAYLOAD_TOO_LARGE', 'El cuerpo de la petición es demasiado grande');
  }

  const postgresCode = getPostgresCode(error);
  if (postgresCode === '23505') {
    return new ApiError(409, 'CONFLICT', 'Ya existe un registro con esos datos');
  }
  if (postgresCode === '23503') {
    return new ApiError(409, 'CONFLICT', 'La operación entra en conflicto con datos relacionados');
  }

  return undefined;
};

export const sendApiError = (res: Response, error: unknown, fallbackMessage?: string) => {
  const apiError = getRequestError(error) ?? new ApiError(
    500,
    'INTERNAL_SERVER_ERROR',
    fallbackMessage ?? 'Error interno del servidor'
  );

  if (apiError.status >= 500) {
    console.error('Error no controlado en la API:', error);
  }

  return res.status(apiError.status).json({
    error: apiError.message,
    code: apiError.code,
    ...(apiError.details === undefined ? {} : { details: apiError.details })
  });
};

export const respondWithError = (
  res: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown
) => sendApiError(res, new ApiError(status, code, message, details));

export const apiErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  sendApiError(res, error);
};