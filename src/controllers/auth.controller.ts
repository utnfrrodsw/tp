import { Request, Response } from 'express';
import { Usuario } from '../entities/usuario.entity';
import { initORM } from '../shared/db/orm'; // Asegúrate de importar 'initORM'

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const ormInstance = await initORM(); // Esperamos a que se resuelva la promesa
    console.log('Conectado a la base de datos');
    
    const usuario = ormInstance.em.create(Usuario, { email, username, password });
    await ormInstance.em.persistAndFlush(usuario);
    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const ormInstance = await initORM(); // Esperamos a que se resuelva la promesa
    const usuario = await ormInstance.em.findOne(Usuario, { email, password });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};
