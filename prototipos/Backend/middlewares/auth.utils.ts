import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key"; // clave segura

export const generateToken = (user: { id: string; tipo: string }) => {
    return jwt.sign({ userId: user.id, tipo: user.tipo }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; tipo: string };
    } catch (error) {
        throw new Error("Token inválido o expirado.");
    }
};