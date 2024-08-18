import { Request, Response, NextFunction } from 'express';
import { VetRepository } from './vet.repository.js';
import { Vet } from './vet.entity.js';

const vetrepository = new VetRepository();

function sanitizeVetInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedvet = {
    name: req.body.name,
    address: req.body.address,
    id: req.body.id,
  }}

function findAll(req: Request,res: Response ){
  res.json({data: vetrepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const vet = vetrepository.findOne({id});
  if(!vet){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(vet)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedvet

  const peopleInput = new Vet (input.name,input.address,input.id)
  const vet = vetrepository.add(peopleInput)
  return res.status(201).send({message: 'new vet create', data: Vet })
}


function update (req: Request,res: Response ){
  req.body.sanitizedvet.id = req.params.id
  const vet = vetrepository.update('1', req.body.sanitizedvet) 
  if (!vet) {
    return res.status(404).send({message:'vet not found' })
  }
  return res.status(200).send({message: 'vet changed suscessfully', data:  Vet })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const vet = vetrepository.delete({id})
  if(!vet){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'vet deleted suscessfully' })
  }
}

export {  sanitizeVetInput, findOne, add, update, remove, findAll }