import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.utils";

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Acceso denegado. Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        req.body.userId = decoded.userId; // Adjuntar el ID del usuario al objeto de solicitud
        next();
    } catch (error) {
        res.status(401).send({ message: "Token inválido o expirado." });
    }
};

// Middleware para verificar si el usuario es admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Acceso denegado. Token no proporcionado." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        if (decoded.tipo !== "admin") {
            return res.status(403).send({ message: "Acceso denegado. Se requiere rol de administrador." });
        }
        next();
    } catch (error) {
        res.status(401).send({ message: "Token inválido o expirado." });
    }
};