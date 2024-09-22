import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Animal } from './animal.entity.js';
import { t } from '@mikro-orm/core';


const em = orm.em

async function findAll( req: Request, res: Response ){
  try {
    const characterClasses = await em.find(Animal, {})
    res
      .status(200)
      .json({ message: 'found all animal', data: Animal })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne( req: Request, res: Response ){
  try {
    const id = Number.parseInt(req.params.id)
    const animal = await em.findOneOrFail(Animal, { id })
    res
      .status(200)
      .json({ message: 'found animal', data: animal })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    const characterClass = em.create(Animal, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'animal created', data: Animal })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const animal = em.getReference(Animal, id)
    em.assign(animal, req.body)
    await em.flush()
    res.status(200).json({ message: 'animal updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const animal = em.getReference(Animal, id)
    await em.removeAndFlush(animal)
    res.status(200).send({ message: 'animal class deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { findAll, findOne, add, update, remove }



