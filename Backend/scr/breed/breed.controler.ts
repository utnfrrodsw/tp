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
  try {
    const id = Number.parseInt(req.params.id)
    const breed = await em.findOneOrFail(Breed, { id })
    res
      .status(200)
      .json({ message: 'found character class', data: breed })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    const breed = em.create(Breed, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'character class created', data: breed })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const breed = em.getReference(Breed, id)
    em.assign(breed, req.body)
    await em.flush()
    res.status(200).json({ message: 'breed updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const breed = em.getReference(Breed, id)
    await em.removeAndFlush(breed)
    res.status(200).send({ message: 'character class deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}




export { findAll, findOne, add, update, remove}
