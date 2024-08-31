/*import { Request, Response, NextFunction } from 'express';
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
*/