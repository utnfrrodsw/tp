import { Request, Response } from 'express';
import prisma from "../database/prisma.js";
import jwt from 'jsonwebtoken';
import enviarMailResetPassword from '../service/mailRec.service.js';
import bcrypt from 'bcrypt';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        const resetToken = jwt.sign({ id_user: user.id_user, username: user.userName }, process.env.JWT_SECRET + user.password_hash, { expiresIn: '1h' });
        await enviarMailResetPassword(email, resetToken);

        if (!user) {
            res.status(404).json({ error: 'Usuario no registrado con ese email' });
            return;
        }
        res.status(200).json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
export const resetPassword = async (req: Request, res: Response) => { // ← sacá el : Promise<void>
  const token = String(req.params.token);
  const { password } = req.body;

  try {
    const decoded = jwt.decode(token) as any; // ← as any en lugar del tipo específico

    if (!decoded?.id_user) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const user = await prisma.user.findUnique({
      where: { id_user: decoded.id_user }
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    jwt.verify(token, (process.env.JWT_SECRET! + user.password_hash) as string); // ← as string

    const newHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id_user: decoded.id_user },
      data: { password_hash: newHash }
    });

    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (e) {
    console.error('Error en resetPassword:', e);
    res.status(400).json({ error: 'El enlace es inválido o ya expiró' });
  }
};