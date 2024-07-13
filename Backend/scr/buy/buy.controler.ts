import { Request, Response, NextFunction } from 'express';
import { BuyRepository } from './buy.repository.js';
import { Buy } from './buy.entity.js';

const buyrepository = new BuyRepository();
function sanitizebuyInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedbuy = {
    total: req.body.total,
    cantidad: req.body.cantidad,
    fechabuy: req.body.fechabuy,
    id: req.body.id,
  }

  Object.keys(req.body.sanitizedbuy).forEach((key) => {
    if (req.body.sanitizedbuy[key] === undefined) {
      delete req.body.sanitizedbuy[key]
    }
  })
  next()
}


function findAll(req: Request, res: Response ){
  res.json({data: buyrepository.findAll()});
}

function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const buy = buyrepository.findOne({id});
  if(!buy){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna buy con ese ID' })
  }
  res.json(buy)
}

function add (req: Request,res: Response ){
  const input = req.body.sanitizedbuy

  const buysInput = new Buy (input.total,input.cantidad,input.fechabuy,input.id)
  const buy = buyrepository.add(buysInput)
  return res.status(201).send({message: 'new buy create', data: Buy })
}

function update(req: Request,res: Response ){
  req.body.sanitizedbuy.id = req.params.id
  const buy = buyrepository.update(req.body.sanitizedbuy) 
  if (!buy) {
    return res.status(404).send({message:'buy not found' })
  }
  return res.status(200).send({message: 'buy modificada correctamente', data:  buy })
}


function remove(req: Request,res: Response ){
  const id = req.params.id;
  const buy = buyrepository.delete({id})
  if(!buy){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna buy con ese ID' })
  }
  else{
  return res.status(200).send({message: 'buy eliminada correctamente'})
}}



export { findAll, sanitizebuyInput, findOne, add, update, remove }