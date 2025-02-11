import jwt from "jsonwebtoken";
export const isAdmin = (req, res, next) => {
    try {
        // 1. Obtener el token del encabezado de autorización
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Acceso denegado. Token no proporcionado." });
        }
        const token = authHeader.split(" ")[1];
        // 2. Verificar y decodificar el token
        const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Usa una clave segura en producción
        const decoded = jwt.verify(token, secretKey);
        // 3. Verificar si el usuario es admin
        if (decoded.tipo !== "admin") {
            return res.status(403).send({ message: "Acceso denegado. Se requiere rol de administrador." });
        }
        // Adjuntar el ID del usuario al objeto de solicitud para su uso posterior
        req.body.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error("Error en el middleware isAdmin:", error);
        res.status(401).send({ message: "Token inválido o expirado." });
    }
};
//# sourceMappingURL=auth.middleware.js.map