import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

//! Valida el body de las requests
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Error de validación',
          errors: error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
//! Valida los parametros de las requests
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      (req as any).params = validatedData;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Parametros invalidos',
          errors: error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
//! Valida los query de las requests
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Parametros por query inválidos',
          errors: error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
//! Autentica el token JWT
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access token is missing or invalid' });
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Extend the request with user info
    (req as any).user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
