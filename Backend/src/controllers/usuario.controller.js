"use strict";
//import { Request, Response } from 'express';
//import jwt from 'jsonwebtoken';
//import { Usuario } from '../entities/usuario.entity';
//import { MikroORM } from '@mikro-orm/core';
//export const login = async (req: Request, res: Response) => {
//const orm = req.app.get('orm') as MikroORM;
//const { email, password } = req.body;
//if (!email || !password) {
//return res.status(400).json({ error: 'Email y contraseña son requeridos' });
//}
//const usuario = await orm.em.findOne(Usuario, { email });
//if (!usuario || !(await usuario.validatePassword(password))) {
//return res.status(401).json({ error: 'Credenciales incorrectas' });
//}
// Crear el access token (expira en 1 hora)
//const accessToken = jwt.sign(
//{ userId: usuario.id, email: usuario.email },
//process.env.JWT_SECRET as string,
//{ expiresIn: '1h' }
//);
// Crear el refresh token (expira en 7 días)
//const refreshToken = jwt.sign(
//{ userId: usuario.id, email: usuario.email },
//process.env.JWT_SECRET as string,
//{ expiresIn: '7d' }
//);
// Guardar el refresh token en la base de datos o en un almacenamiento seguro (opcional)
//usuario.refreshToken = refreshToken;  // Asumiendo que tienes un campo en la DB para este token
//await orm.em.flush();
// Enviar ambos tokens al cliente
//res.json({ accessToken, refreshToken });
//};
//export const refreshToken = async (req: Request, res: Response) => {
//const { refreshToken } = req.body;
//if (!refreshToken) {
//return res.status(400).json({ error: 'Refresh token es necesario' });
//}
//try {
// Verificar el refresh token
//const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
// Buscar el usuario que corresponde a ese refresh token
//const orm = req.app.get('orm') as MikroORM;
//const usuario = await orm.em.findOne(Usuario, { id: decoded.userId });
//if (!usuario) {
//return res.status(401).json({ error: 'Usuario no encontrado' });
//}
// Crear un nuevo access token
//const newAccessToken = jwt.sign(
//{ userId: usuario.id, email: usuario.email },
//process.env.JWT_SECRET as string,
//{ expiresIn: '1h' }
//);
// Enviar el nuevo access token al cliente
//res.json({ accessToken: newAccessToken });
//} catch (error) {
//return res.status(403).json({ error: 'Refresh token inválido o expirado' });
//}
//};
