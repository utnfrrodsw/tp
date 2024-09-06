import { Request, Response, NextFunction } from 'express';
/*import { ShelterRepository } from './shelter.repository.js';*/
import { Shelter } from './shelter.entity.js';

/*const shelterRepository = new ShelterRepository();*/
function sanitizeShelterInput(req: Request, res: Response, next:NextFunction)
{
  req.body.sanitizedShelter = {
    name: req.body.name,
    address: req.body.address,
    max_capacity: req.body.max_capacity,
    id: req.body.id
  }

  Object.keys(req.body.sanitizedShelter).forEach((key) => {
    if (req.body.sanitizedShelter[key] === undefined) {
      delete req.body.sanitizedShelter[key]
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

export { findAll, findOne, add, update, remove, sanitizeShelterInput }


/*
function findAll( req: Request, res: Response ){
  res.json({data: shelterRepository.findAll()});
}

function findOne( req: Request, res: Response ){
  const id = req.params.id;
  const shelter = shelterRepository.findOne({id});
  if(!shelter){
    return res.status(404).send({message:'Incorrect ID, no shelter with that ID ', id })
  }
  res.json(shelter)
}

function add( req: Request, res: Response ){
  const input = req.body.sanitizedShelter

  const sheltersInput = new Shelter (input.name, input.address, input.max_capacity, input.id)
  const shelter = shelterRepository.add(sheltersInput)
  return res.status(201).send({message: 'new shelter create', data: shelter })
}

function update(req: Request, res: Response){
  req.body.sanitizedShelter.id = req.params.id
  const shelter = shelterRepository.update('1', req.body.sanitizedShelter)
  if (!shelter) {
    return res.status(404).send({message:'shelter not found'})
  }
  return res.status(200).send({message: 'correct shelter update', data:  shelter})
}

function remove( req: Request, res: Response ){
  const id = req.params.id;
  const shelter = shelterRepository.delete({id})
  if(!shelter){
    return res.status(404).send({message:'Incorrect remove, no shelter with that ID ', id })
  }
  return res.status(200).send({message: 'shelter deleted', data:  shelter})
}

export { findAll, findOne, add, update, remove, sanitizeShelterInput }*/
