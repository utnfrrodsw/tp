import { Request, NextFunction, Response } from 'express';
import { Formatos_torneo } from './formatos_torneo.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em

function sanitizeFormatoInput(req: Request, res: Response , next: NextFunction){
    req.body.sanitizedInput = {
        cant_grupos: req.body.cant_grupos,
        cant_equipos_x_grupo: req.body.cant_equipos_x_grupo,
        cant_clasificados_x_grupo: req.body.cant_clasificados_x_grupo,
        id: req.body.id,
        torneos: req.body.torneos

      }

      Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key]
      }})

    next()
}

async function findAll(req: Request ,res: Response){
  try{
    const formatos_torneo = await em.find(Formatos_torneo, {}, {populate: ['torneos']})
    res.status(200).json({message: 'found all formatos_torneo', data: formatos_torneo})
  }catch (error: any){
      res.status(500).json({message: error.message})
  }
}

async function findOne(req: Request,res: Response ){
  try{
    const id = Number.parseInt(req.params.id)
    const formato_torneo = await em.findOneOrFail(Formatos_torneo, {id},{populate: ['torneos']})
    res.status(200).json({message: 'found formato_torneo', data: formato_torneo})
}catch (error: any){
    res.status(500).json({message: error.message})
}
}

async function add(req: Request,res: Response){
  try{
    const formato_torneo = em.create(Formatos_torneo, req.body)
    await em.flush()
    res.status(200).json({message: 'formato_torneo created', data: formato_torneo})
}catch (error: any){
    res.status(500).json({message: error.message})
}
  }

async function update(req: Request,res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const formato_torneo = em.findOneOrFail(Formatos_torneo, id)
    em.assign(Formatos_torneo, req.body)
    await em.flush()
    res.status(200).json({message: 'formato_torneo updated', data: formato_torneo})
}catch (error: any){
    res.status(500).json({message: error.message})
}
}

async function remove(req: Request,res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const formato_torneo = em.getReference(Formatos_torneo, id)
    await em.removeAndFlush(formato_torneo)
    res.status(200).json({message: 'formato_torneo removed'})
}catch (error: any){
    res.status(500).json({message: error.message})
}
}

export {sanitizeFormatoInput, findAll, findOne, add, remove, update}
