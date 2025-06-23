import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { request } from 'http';
import { orm } from '../shared/db/orm.js';
const em = orm.em;

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeUsuarioInput = {
    mail: req.body.mail,
    contrasena: req.body.contrasena,
    tipoDoc: req.body.tipoDoc,
    numeroDoc: req.body.numeroDoc,
    telefono: req.body.telefono,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    direccion: req.body.direccion,
    nombreFantasia: req.body.nombreFantasia,
    descripcion: req.body.descripcion,
    foto: req.body.foto,
    turnos: req.body.turnos,
    tareas: req.body.tareas,
    servicios: req.body.servicios,
    tiposDeServicio: req.body.tiposDeServicio,
    horarios: req.body.horarios,
  };
  Object.keys(req.body.sanitizeUsuarioInput).forEach((key) => {
    if (req.body.sanitizeUsuarioInput[key] === undefined) {
      delete req.body.sanitizeUsuarioInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      Usuario,
      {},
      { populate: ['turnos', 'servicios', 'tiposDeServicio', 'horarios'] }
    );
    res.status(200).json({ message: 'found all Usuarios', data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(
      Usuario,
      { id },
      { populate: ['turnos', 'servicios'] }
    );
    res.status(200).json({ message: 'found one usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newUser = em.create(Usuario, req.body.sanitizeUsuarioInput);
    await em.flush();
    res.status(201).json({ message: 'created new usuario', data: newUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const updateUser = await em.findOneOrFail(Usuario, { id });
    em.assign(updateUser, req.body.sanitizeUsuarioInput);
    await em.flush();
    res.status(200).json({ message: 'updated usuario', data: updateUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(Usuario, { id });
    await em.removeAndFlush(user);
    res.status(200).json({ message: 'deleted usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove };
