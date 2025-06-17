import { Request, Response, NextFunction } from 'express'
import {Usuario} from './usuario.entity'
import { request } from 'http'
import { orm } from '../shared/db/orm.js'
const em = orm.em

function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    // turno 
    // tarea
  }
  Object.keys(req.body.sanitizeUsuarioInput).forEach((key) => {
    if (req.body.sanitizeUsuarioInput[key] === undefined) {
      delete req.body.sanitizeUsuarioInput[key]
    }
  })
  next()
}

async function findall(req: Request, res: Response) {
  try{
    const usuarios = await em.find(
      Usuario,
      {},
      //{ populate: ['turnos', 'tareas'] }
    )
    res.status(200).json({message: 'found all characters', data: usuarios})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(
      Usuario,
      { id },
      //{ populate: ['turnos', 'tareas'] }
    )
    res.status(200).json({message: 'found one character', data: usuario})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try{
    const nuevoUsuario = em.create(
      Usuario,
      req.body.sanitizeInput,
    )
    await em.flush()
    res.status(201).json({message: 'created new character', data: nuevoUsuario})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}
async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ActualizarUsuario = await em.findOneOrFail(
    Usuario,
    { id }
  )
    em.assign(ActualizarUsuario, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'updated character', data: ActualizarUsuario})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(
      Usuario,
      { id }
    )
    await em.removeAndFlush(usuario)
    res.status(200).json({message: 'deleted character', data: usuario})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}

export {sanitizeUsuarioInput, findall, findone, add, update, remove}
