import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { $Enums } from "@/database/prisma.js";
import { config } from '@/utils/config.js';
import type { AccessTokenPayload } from "@/modules/auths/auth.type.js";

export const authenticate = (allowedRoles: $Enums.EnumRol[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(403).json({
        message: "Access not authorized",
      });
    }

    try {
      const data = jwt.verify(token, config.JWT_SECRET) as AccessTokenPayload;

      // Guardar la información del usuario para los siguientes middlewares
      req.user = data;

      // Si se especifican roles permitidos, validar que el usuario tenga uno de ellos
      if (allowedRoles.length > 0 && !allowedRoles.includes(data.role)) {
        return res.status(403).json({
          message: "No tienes permisos para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      console.error("Error en la verificación del token:", error);
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }
  };
};

export default authenticate;