import jwt from 'jsonwebtoken';
import { TOKEN } from '../../config.js';

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, TOKEN);
    req.user = decoded; // Agrega la información del usuario autenticado al objeto de solicitud (req).
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};