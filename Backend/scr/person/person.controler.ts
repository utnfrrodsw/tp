import { Request, Response, NextFunction } from 'express';
import { PersonRepository } from './person.repository.js';
import { Person } from './person.entity.js';

const personrepository = new PersonRepository();

function sanitizepersonInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedperson = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    tipoDoc: req.body.tipoDoc,
    nroDoc: req.body.nroDoc,
    contacto: req.body.contacto,
    fechaNacimiento: req.body.fechaNacimiento,
    domicilio: req.body.domicilio,
    nroCuit: req.body.nroCuit
  }
  Object.keys(req.body.sanitizedpersonInput).forEach((key) => {
    if (req.body.sanitizedpersonInput[key] === undefined) {
      delete req.body.sanitizedpersonInput[key]
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

export { findAll, findOne, add, update, remove, sanitizepersonInput }






/*
function findAll(req: Request,res: Response ){
  res.json({data: personrepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const person = personrepository.findOne({id});
  if(!person){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(person)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedperson

  const peopleInput = new Person (input.nombre,input.apellido,input.tipoDoc,input.nroDoc,input.contacto,input.fechaNacimiento,input.domicilio, input.nroCuil, input.id)
  const person = personrepository.add(peopleInput)
  return res.status(201).send({message: 'new person create', data: Person })
}


function update (req: Request,res: Response ){
  req.body.sanitizedperson.id = req.params.id
  const person = personrepository.update('1', req.body.sanitizedperson) 
  if (!person) {
    return res.status(404).send({message:'person not found' })
  }
  return res.status(200).send({message: 'person changed suscessfully', data:  Person })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const person = personrepository.delete({id})
  if(!person){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'person deleted suscessfully' })
  }
}

export {  sanitizepersonInput, findOne, add, update, remove, findAll }*/