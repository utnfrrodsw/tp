import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from './api-error.js';

type RequestSchemas = {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  function middlewareDeValidacion(req: Request, _res: Response, next: NextFunction) {
    const issues: Array<{ field: string; message: string }> = [];
    const partes: Array<'params' | 'query' | 'body'> = ['params', 'query', 'body'];

    for (const parte of partes) {
      const schema = schemas[parte];
      if (!schema) continue;

      const resultado = schema.safeParse(req[parte]);
      if (!resultado.success) {
        for (const issue of resultado.error.issues) {
          const campo = [parte, ...issue.path].join('.');
          issues.push({ field: campo, message: issue.message });
        }
        continue;
      }

      if (parte === 'body') {
        req.body = resultado.data;
      }
    }

    if (issues.length > 0) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Los datos enviados no son válidos', { fields: issues }));
      return;
    }

    next();
  }

  return middlewareDeValidacion;
}