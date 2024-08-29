import { Request, Response, NextFunction } from 'express';
/*import { BreedRepository } from './breed.repository.js';*/


/*const breedRepository = new BreedRepository();*/

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

export { findAll, findOne, add, update, remove, sanitizeBreedInput }


  /*

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

export {  sanitizeBreedInput, findOne, add, update, remove, findAll }*/