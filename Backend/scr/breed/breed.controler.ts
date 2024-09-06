import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Breed } from './breed.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const breed = await em.find(Breed, {});
    res.status(200).json({message: 'all breeds: ', data: breed});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
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

function sanitizeBreedInput(req: Request, res: Response, next:NextFunction){
  req.body.sanitizedBreed = {
    name: req.body.name,
    description: req.body.description,
    id: req.body.id,
  }

    Object.keys(req.body.sanitizedBreedInput).forEach((key) => {
    if (req.body.sanitizedBreedInput[key] === undefined) {
      delete req.body.sanitizedBreedInput[key]
    }
  })
  next()
}

export { findAll, findOne, add, update, remove, sanitizeBreedInput }
