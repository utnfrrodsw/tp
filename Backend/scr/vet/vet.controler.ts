import { Request, Response, NextFunction} from 'express';
import { orm } from '../zshare/db/orm.js';
import { Vet } from './vet.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const vet = await em.find(Vet, {}, {populate:['shelters']});
    res.status(200).json({message: 'all vets: ', data: vet});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try {
    const id = Number.parseInt(req.params.id)
    const vet = await em.findOneOrFail(Vet, { id })
    res
      .status(200)
      .json({ message: 'found character class', data: vet })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const vet = em.create(Vet, req.body.sanitizedVet)
    await em.flush()
    res.status(201).json({ message: 'vet created', data: vet })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const vet = em.getReference(Vet, id)
    em.assign(vet, req.body.sanitizedVet)
    await em.flush()
    res.status(200).json({ message: 'vet updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const vet = em.getReference(Vet, id)
    await em.removeAndFlush(vet)
    res.status(200).send({ message: 'vet deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function sanitizeVet(req: Request, res: Response, next:NextFunction){

  req.body.sanitizedVet = {
    name: req.body.name,
    address: req.body.address,
    shlters: req.body.shelters
  }
    Object.keys(req.body.sanitizedVet).forEach((key) => {
    if (req.body.sanitizedVet[key] === undefined) {
      delete req.body.sanitizedVet[key]
    }
  })

  next()
}

export {sanitizeVet, findAll, findOne, add, update, remove }