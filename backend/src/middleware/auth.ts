import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioRol } from '../entities/Usuario'; // ✅ IMPORTAR desde Usuario

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';

// ✅ Usar el tipo UsuarioRol correcto
interface JWTPayload {
  id: number;
  rol: UsuarioRol; // ✅ Ahora usa el tipo correcto importado
  email?: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔒 authMiddleware ejecutado, header:', req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('❌ authMiddleware: No se envió header Authorization');
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado',
      code: 'TOKEN_REQUIRED'
    });
  }

  // ✅ Extraer token del header "Bearer TOKEN"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('❌ authMiddleware: Formato de Authorization incorrecto');
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Formato de token inválido',
      code: 'TOKEN_INVALID_FORMAT'
    });
  }

  const token = parts[1];

  if (!token) {
    console.log('❌ authMiddleware: Token vacío');
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token vacío',
      code: 'TOKEN_EMPTY'
    });
  }

  try {
    // ✅ Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    console.log('✅ authMiddleware: Token válido para usuario', decoded.id, 'rol:', decoded.rol);

    // ✅ IMPORTANTE: Setear req.user usando el tipo correcto
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email || ''
    };

    next();
  } catch (error) {
    console.error('❌ authMiddleware: Error al verificar token:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido',
      code: 'TOKEN_INVALID'
    });
  }
};

export default authMiddleware;
