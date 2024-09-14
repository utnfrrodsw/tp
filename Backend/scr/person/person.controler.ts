import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Person } from './person.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const person = await em.find(Person, {});
    res.status(200).json({message: 'all people: ', data: person});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const person = await em.find(Person, { id: id });
    res.status(200).json({message: 'person data: ', data: person});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function add( req: Request, res: Response ){
  try{
    const input = req.body.sanitizedPersonInput;
    const person = em.create(Person, input);
    await em.flush();
    res.status(201).json({ message: 'person created', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const input = req.body.sanitizedPersonInput;
    const person = em.getReference(Person, id);
    em.assign(person, input);
    await em.flush();
    res.status(200).json({ message: 'person updated', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const person = em.getReference(Person, id);
    em.removeAndFlush(person);
    res.status(200).json({ message: 'person deleted', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function sanitizePersonInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedPerson = {
    name: req.body.name,
    surname: req.body.surname,
    doc_nro: req.body.doc_nro,
    doc_type: req.body.doc_type,
    email: req.body.email,
    phone: req.body.phone,
    birthdate: req.body.birthdate,
    address: req.body.address,
    nroCuit: req.body.nroCuit
    }  
    Object.keys(req.body.sanitizedpersonInput).forEach((key) => {
    if (req.body.sanitizedpersonInput[key] === undefined) {
      delete req.body.sanitizedpersonInput[key]
    }
  })

  next()
}

export { findAll, findOne, add, update, remove, sanitizePersonInput }
