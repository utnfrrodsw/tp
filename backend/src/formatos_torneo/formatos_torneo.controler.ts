import { Request, NextFunction, Response } from 'express';
import {Formatos_torneoRepository} from './formatos_torneo.Repository.js';
import { formatos_torneo } from './formatos_torneo.entity.js';

const repository = new Formatos_torneoRepository()

function sanitizeFormatoInput(req: Request, res: Response , next: NextFunction){
    req.body.sanitizedInput = {
        cant_grupos: req.body.cant_grupos,
        cant_equipos_x_grupo: req.body.cant_equipos_x_grupo,
        cant_clasificados_x_grupo: req.body.cant_clasificados_x_grupo,
        id: req.body.id

      }

      Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key]
      }})

    next()
}

async function findAll(req: Request ,res: Response){
  return res.json({data: await repository.findAll()});
}


async function findOne(req: Request,res: Response ){
  const id = req.params.id
  const formato_torneo = await repository.findOne({id})
  if (!formato_torneo) {
      res.status(404).send({message:'ID incorrecto, no existe ningun formato de torneo con el ID indicado' });
  } else {
  return res.json({data: formato_torneo})
  }
}

async function add(req: Request,res: Response){
    const input = req.body.sanitizedInput

    const nuevoFormato = new formatos_torneo (input.cant_grupos, input.cant_equipos_x_grupo, input.cant_clasificados_x_grupo, input.id)
    const formato_nuevo = await repository.add(nuevoFormato)
    return res.status(201).send({message: 'Formato de torneo caragado correctamente', data: formato_nuevo })
  }

async function update(req: Request,res: Response){
  req.body.sanitizedInput.id = req.params.id
  const formato = await repository.update(req.body.sanitizedInput.id, req.body.sanitizedInput)

    if (!formato) {
      return res.status(404).send({ message: 'Formato de torneo no encontrado' })
    }else{

    return res.status(200).send({ message: 'Formato de torneo actualizado correctamente', data: formato})
}}

async function remove(req: Request,res: Response){
  const id = req.params.id
  const formato_torneo = await repository.delete({id})

if (!formato_torneo) {
  return res.status(404).send({ message: 'Formato de torneo no encontrado' })
} else {
  return res.status(200).send({ message: 'Formato de torneo eliminado correctamente' })
}}

export {sanitizeFormatoInput, findAll, findOne, add, remove, update}
