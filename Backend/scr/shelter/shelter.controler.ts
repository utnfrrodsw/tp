import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Shelter } from './shelter.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const shelter = await em.find(Shelter, {});
    res.status(200).json({message: 'all shelters: ', data: shelter});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = await em.findOneOrFail(Shelter, { id })
    res
      .status(200)
      .json({ message: 'found shelter', data: shelter })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}





async function add(req: Request, res: Response) {
  try {
    const shelter = em.create(Shelter, req.body)
    await em.flush()
    res.status(201).json({ message: 'Shelter created', data: shelter })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
/*async function add(req: Request, res: Response) {
  try {
    const shelterData = { ...req.body };
    console.log("shelter data: " + shelterData)
    console.log("rescues: " + shelterData.rescues)
    console.log("comparacion null: " + shelterData.rescues === null)
    console.log("comparacion undefined: " + shelterData.rescues === undefined)

    if (shelterData.rescues === null || typeof shelterData.rescues === 'undefined') {
      shelterData.rescues = [];
    }
    const shelter = em.create(Shelter, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'shelter created', data: shelter })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
*/
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = em.getReference(Shelter, id)
    em.assign(shelter, req.body)
    await em.flush()
    res.status(200).json({ message: 'shelter updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = em.getReference(Shelter, id)
    await em.removeAndFlush(shelter)
    res.status(200).send({ message: 'character class deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { findAll, findOne, add, update, remove}
