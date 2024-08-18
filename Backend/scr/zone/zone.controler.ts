import { Request, Response, NextFunction } from 'express';
import { ZoneRepository } from './zone.repository.js';
import { Zone } from './zone.entity.js';

const zonerepository = new ZoneRepository();

function sanitizeZoneInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedzone = {
    name: req.body.name,
    id: req.body.id
  }}

function findAll(req: Request,res: Response ){
  res.json({data: zonerepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const zone = zonerepository.findOne({id});
  if(!zone){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(zone)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedzone

  const peopleInput = new Zone (input.name,input.id)
  const zone = zonerepository.add(peopleInput)
  return res.status(201).send({message: 'new zone create', data: Zone })
}


function update (req: Request,res: Response ){
  req.body.sanitizedzone.id = req.params.id
  const zone = zonerepository.update('1', req.body.sanitizedzone) 
  if (!zone) {
    return res.status(404).send({message:'zone not found' })
  }
  return res.status(200).send({message: 'zone changed suscessfully', data:  Zone })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const zone = zonerepository.delete({id})
  if(!zone){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'zone deleted suscessfully' })
  }
}

export {  sanitizeZoneInput, findOne, add, update, remove, findAll }