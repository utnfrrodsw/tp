import { Request, Response, NextFunction } from 'express';
import { BreedRepository } from './breed.repository.js';
import { Breed } from './breed.entity.js';

const breedRepository = new BreedRepository();

function sanitizeBreedInput(req: Request, res: Response, next:NextFunction){
  req.body.sanitizedBreed = {
    name: req.body.name,
    description: req.body.description,
    id: req.body.id,
  }}

function findAll(req: Request,res: Response ){
  res.json({data: breedRepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const breed = breedRepository.findOne({id});
  if(!breed){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(breed)
}


function add (req: Request, res: Response){
  const input = req.body.sanitizedbreed

  const breedsInput = new Breed (input.name,input.description,input.id)
  const breed = breedRepository.add(breedsInput)
  return res.status(201).send({message: 'new breed create', data: Breed })
}


function update (req: Request,res: Response ){
  req.body.sanitizedbreed.id = req.params.id
  const breed = breedRepository.update('1', req.body.sanitizedbreed) 
  if (!breed) {
    return res.status(404).send({message:'breed not found' })
  }
  return res.status(200).send({message: 'breed changed suscessfully', data:  Breed })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const breed = breedRepository.delete({id})
  if(!breed){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'breed deleted suscessfully' })
  }
}

export {  sanitizeBreedInput, findOne, add, update, remove, findAll }