import { Request, Response, NextFunction } from 'express';
/*import { RescueRepository } from './rescue.repository.js';*/
import { Rescue } from './rescue.entity.js';

/*const rescueRepository = new RescueRepository();*/
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

export { findAll, findOne, add, update, remove, sanitizeRescueInput }



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
