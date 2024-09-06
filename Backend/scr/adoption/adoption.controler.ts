import { Request, Response, NextFunction } from 'express';
/*import { AdoptionRepository } from './adoption.repository.js';*/
import { Adoption } from './adoption.entity.js';

/*const adoptionrepository = new AdoptionRepository();*/

function sanitizeAdoptionInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedadoption = {
    comments: req.body.comments,
    id_animal: req.body.id_animal,
    id_person: req.body.id_person,
    adoption_date: req.body.adoption_date,
    id: req.body.id,
  }
    Object.keys(req.body.sanitizedAnimal).forEach((key) => {
    if (req.body.sanitizedAnimal[key] === undefined) {
      delete req.body.sanitizedAnimal[key]
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

export { findAll, findOne, add, update, remove, sanitizeAdoptionInput }

  


/*
function findAll(req: Request,res: Response ){
  res.json({data: adoptionrepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const adoption = adoptionrepository.findOne({id});
  if(!adoption){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(adoption)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedadoption

  const peopleInput = new Adoption (input.comments,input.id_animal,input.id_person,input.adoption_date,input.id)
  const adoption = adoptionrepository.add(peopleInput)
  return res.status(201).send({message: 'new adoption create', data: Adoption })
}


function update (req: Request,res: Response ){
  req.body.sanitizedadoption.id = req.params.id
  const adoption = adoptionrepository.update('1', req.body.sanitizedadoption) 
  if (!adoption) {
    return res.status(404).send({message:'adoption not found' })
  }
  return res.status(200).send({message: 'adoption changed suscessfully', data:  Adoption })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const adoption = adoptionrepository.delete({id})
  if(!adoption){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'adoption deleted suscessfully' })
  }
}

export {  sanitizeAdoptionInput, findOne, add, update, remove, findAll }*/