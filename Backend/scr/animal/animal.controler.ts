import { Request, Response, NextFunction } from 'express';
import { AnimalRepository } from './animal.repository.js';
import { Animal } from './animal.entity.js';

const animalRepository = new AnimalRepository();
function sanitizeAnimalInput(req: Request, res: Response, next:NextFunction)
{
  req.body.sanitizedAnimal = {
    name: req.body.name,
    rescue_date: req.body.rescue_date,
    birth_date: req.body.birth_date,
    id: req.body.id
  }

  Object.keys(req.body.sanitizedAnimal).forEach((key) => {
    if (req.body.sanitizedAnimal[key] === undefined) {
      delete req.body.sanitizedAnimal[key]
    }
  })

  next()
}

function findAll( req: Request, res: Response ){
  res.json({data: animalRepository.findAll()});
}

function findOne( req: Request, res: Response ){
  const id = req.params.id;
  const animal = animalRepository.findOne({id});
  if(!animal){
    return res.status(404).send({message:'Incorrect ID, no animal with that ID ', id })
  }
  res.json(animal)
}

function add( req: Request, res: Response ){
  const input = req.body.sanitizedAnimal

  const animalsInput = new Animal (input.name, input.rescue_date, input.birth_date, input.id)
  const animal = animalRepository.add(animalsInput)
  return res.status(201).send({message: 'new animal create', data: animal })
}

function update(req: Request, res: Response){
  req.body.sanitizedAnimal.id = req.params.id
  const animal = animalRepository.update('1', req.body.sanitizedAnimal)
  if (!animal) {
    return res.status(404).send({message:'animal not found'})
  }
  return res.status(200).send({message: 'correct animal update', data:  animal})
}

function remove( req: Request, res: Response ){
  const id = req.params.id;
  const animal = animalRepository.delete({id})
  if(!animal){
    return res.status(404).send({message:'Incorrect remove, no animal with that ID ', id })
  }
  return res.status(200).send({message: 'animal deleted', data:  animal})
}

export { findAll, findOne, add, update, remove, sanitizeAnimalInput }
