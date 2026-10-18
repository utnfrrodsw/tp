import type { NextFunction, Request, Response } from 'express';
import prisma from '@/database/prisma.js';
import jwt from 'jsonwebtoken';
import enviarMailResetPassword from '@/service/mailRec.service.js';
import bcrypt from 'bcrypt';
import { config } from '@/utils/config.js';
import type { AccessTokenPayload, ResetPasswordPayload } from './auth.type.js';
import enviarMailVerificador from '@/service/mail.service.js';
import { EnumRol } from "@/generated/prisma/browser.js";
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './auth.schema.js';
import type { UserService } from "@/modules/users/user.service.js";
import { User } from '../users/user.entity.js';

interface DecodedToken {
    userName: string;
}

export class AuthController {
    constructor(private service: UserService) {}

    public validateAccountController = async (req: Request, res: Response) => {
        const token = req.params.token;

        if (typeof token !== 'string') {
            return res.status(400).json({
                success: false,
                message: "El token proporcionado no es válido."
            });
        }

        const result = await this.validateAccount(token);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    };

    private validateAccount = async (token: string) => {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

            if (!decoded || !decoded.userName) {
                throw new Error("Token inválido o no contiene el ID de usuario");
            }

            const userN = decoded.userName;

            const usuarioActualizado = await prisma.user.update({
                where: { userName: userN },
                data: { status: true },
            });

            console.log(`Usuario con Nombre ${userN} validado correctamente.`);
            return {
                success: true,
                message: "Cuenta validada con éxito",
                usuario: usuarioActualizado
            };
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Error interno al validar la cuenta";

            console.error("Error al validar la cuenta:", message);

            return {
                success: false,
                message
            };
        }
    };

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        const { username, password }: LoginDto = req.body;
        try {
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

            if (!user.validationStatus) {
                res.status(403).json({ message: 'Su cuenta se encuentra activa, espere la validacion del administrador para poder iniciar sesión.' });
                return;
            }

            const token = jwt.sign(
                { id: user.id_user, userName: user.userName, rol: user.rol } as AccessTokenPayload,
                config.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: config.NODE_ENV === 'production', // Solo en producción
                sameSite: 'lax',
                maxAge: 3600000, // 1 hora
            }).json({ message: 'Login successful' });

        } catch (error) {
            next(error);
        }
    };

    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email }: ForgotPasswordDto = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            const resetToken = jwt.sign(
                { id_user: user.id_user, userName: user.userName } as ResetPasswordPayload,
                config.JWT_SECRET + user.password_hash,
                { expiresIn: '1h' }
            );
            await enviarMailResetPassword(email, resetToken);

            res.status(200).json({ message: 'Correo de recuperación enviado' });
        } catch (error) {
            next(error);
        }
    };

    public resetPassword = async (req: Request, res: Response, _next: NextFunction) => {
        const token = String(req.params.token);
        const { password }: ResetPasswordDto = req.body;

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        if (password.length > 72) {
            return res.status(400).json({ error: 'La contraseña es demasiado larga' });
        }

        try {
            const decoded = jwt.decode(token) as ResetPasswordPayload;

            if (!decoded?.id_user) {
                return res.status(400).json({ error: 'Token inválido' });
            }

            const user = await prisma.user.findUnique({
                where: { id_user: decoded.id_user }
            });
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

            jwt.verify(token, config.JWT_SECRET + user.password_hash);

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


    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password, urlPicture }: RegisterDto = req.body;

            // El primer usuario registrado en el sistema queda como admin
            // y auto-validado; el resto entra como "tecnico" pendiente de
            // validación por parte de un administrador.
            const userCount = await prisma.user.count();
            const role = userCount === 0 ? EnumRol.admin : EnumRol.tecnico;
            const adminValidation = role === EnumRol.admin;

            const hashedPassword = await bcrypt.hash(password, 10);

            // NOTA: ajustá este constructor a la firma real de tu entidad
            // User si difiere (por ejemplo, si no acepta urlPicture como
            // último parámetro).
            const user = new User(
                username,
                email,
                hashedPassword,
                role,
                false,           // status: inactivo hasta validar el email
                adminValidation, // validationStatus
                urlPicture
            );

            await this.service.create(user);

            const tokenVerificacion = jwt.sign(
                { userName: username },
                config.JWT_SECRET,
                { expiresIn: '24h' }
            );
            await enviarMailVerificador(email, tokenVerificacion);

            res.json({
                message: 'Usuario registrado exitosamente, valida tu cuenta a través del enlace enviado a tu correo electrónico'
            });
        } catch (error) {
            next(error);
        }
    };

    public getMe = async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: {
                id_user: req.user?.id
            },
            select: {
                id_user: true,
                userName: true,
                email: true,
                rol: true,
                urlPicture: true,
                status: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.json(user);
    };

    public logout = async (req: Request, res: Response) => {
        res.clearCookie('access_token').json({ message: 'Logout successful' });
    };
}