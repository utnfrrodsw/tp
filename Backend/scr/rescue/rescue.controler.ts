import { Request, Response } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Rescue } from './rescue.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const rescue = await em.find(Rescue, {});
    res.status(200).json({message: 'all rescues: ', data: rescue});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try {
    const id = Number.parseInt(req.params.id)
    const rescue = await em.findOneOrFail(Rescue, { id })
    res
      .status(200)
      .json({ message: 'found character class', data: rescue })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    const rescue = em.create(Rescue, req.body)
    
    await em.flush()
    res
      .status(201)
      .json({ message: 'character class created', data: rescue })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const rescue = em.getReference(Rescue, id)
    em.assign(rescue, req.body)
    await em.flush()
    res.status(200).json({ message: 'rescue updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const rescue = em.getReference(Rescue, id)
    await em.removeAndFlush(rescue)
    res.status(200).send({ message: 'rescue deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}




export { findAll, findOne, add, update, remove}


































/*import { Request, Response, NextFunction } from 'express';
import { RescueRepository } from './rescue.repository.js';
import { Rescue } from './rescue.entity.js';

const rescueRepository = new RescueRepository();
function sanitizeRescueInput(req: Request, res: Response, next:NextFunction)
{
  req.body.sanitizedRescue = {
    rescue_date: req.body.rescue_date,
    description: req.body.description,
    comments: req.body.comments,
    id: req.body.id
  }

  Object.keys(req.body.sanitizedRescue).forEach((key) => {
    if (req.body.sanitizedRescue[key] === undefined) {
      delete req.body.sanitizedRescue[key]
    }
  })

  next()
}

async function findAll( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function findOne( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function add( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function update( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function remove( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

export { findAll, findOne, add, update, remove, sanitizeRescueInput }*/



/*
function findAll( req: Request, res: Response ){
  res.json({data: rescueRepository.findAll()});
}

function findOne( req: Request, res: Response ){
  const id = req.params.id;
  const rescue = rescueRepository.findOne({id});
  if(!rescue){
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }
  res.json(rescue)
}

function add( req: Request, res: Response ){
  const input = req.body.sanitizedRescue

  const rescuesInput = new Rescue (input.rescue_date, input.description, input.comments, input.id)
  const rescue = rescueRepository.add(rescuesInput)
  return res.status(201).send({message: 'new rescue create', data: rescue })
}

function update(req: Request, res: Response){
  req.body.sanitizedRescue.id = req.params.id
  const rescue = rescueRepository.update('1', req.body.sanitizedRescue)
  if (!rescue) {
    return res.status(404).send({message:'rescue not found'})
  }
  return res.status(200).send({message: 'rescue modificada correctamente', data:  rescue})
}

function remove( req: Request, res: Response ){
  const id = req.params.id;
  const rescue = rescueRepository.delete({id})
  if(!rescue){
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }
  return res.status(200).send({message: 'rescue deleted', data:  rescue})
}

export { findAll, findOne, add, update, remove, sanitizeRescueInput }*/
