
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from "../database/prisma.js";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
            // Reemplaza el SELECT * FROM usuario WHERE nombre_usuario = ?
            const user = await prisma.user.findFirst({
                where: { userName: username }
            });

            if (!user) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
                return;
            }

            const match = await bcrypt.compare(password, user.password_hash);

            if (!match) {
                res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
                return;
            }

            if (!user.status) {
                res.status(403).json({ message: 'Usuario inactivo. Revise su email para activar su cuenta.' });
                return;
            }

            const token = jwt.sign(
                { id_user: user.id_user },
                process.env.JWT_SECRET ?? "Stack",
                { expiresIn: '1h' }
            );

            res.json({ token });

        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
    }
}