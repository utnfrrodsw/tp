import { Request, Response, NextFunction } from 'express';
import { RecordRepository } from './record.repository.js';
import { Record } from './record.entity.js';

const recordrepository = new RecordRepository();

function sanitizeRecordInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedrecord = {
    name: req.body.name,
    address: req.body.address,
    id: req.body.id,
  }}

function findAll(req: Request,res: Response ){
  res.json({data: recordrepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const record = recordrepository.findOne({id});
  if(!record){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(record)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedrecord

  const peopleInput = new Record (input.name,input.address,input.id)
  const record = recordrepository.add(peopleInput)
  return res.status(201).send({message: 'new record create', data: Record })
}


function update (req: Request,res: Response ){
  req.body.sanitizedrecord.id = req.params.id
  const record = recordrepository.update('1', req.body.sanitizedrecord) 
  if (!record) {
    return res.status(404).send({message:'record not found' })
  }
  return res.status(200).send({message: 'record changed suscessfully', data:  Record })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const record = recordrepository.delete({id})
  if(!record){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'record deleted suscessfully' })
  }
}

export {  sanitizeRecordInput, findOne, add, update, remove, findAll }