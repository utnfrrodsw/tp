import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

// Middleware para verificar el token

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = undefined;
    return res.status(401).json({ message: 'No autorizado: falta token' });
  }
  const token = authHeader.split(' ')[1]; // ✅ extraer token sin "Bearer"

  if (!token) {
    req.user = undefined;
    return res
      .status(401)
      .json({ message: 'No autorizado: token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      rol: string;
    };
    req.user = decoded;
    next(); // ✅ si todo está bien, sigue la request
  } catch (error) {
    req.user = undefined;
    return res
      .status(401)
      .json({ message: 'No autorizado: token inválido o expirado' });
  }
};
