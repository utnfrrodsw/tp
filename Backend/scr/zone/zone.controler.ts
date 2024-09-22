import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Zone } from './zone.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const zone = await em.find(Zone, {}, {populate:['shelters']});
    res.status(200).json({ message: 'all zones: ', data: zone });
  }catch (error: any){
    res.status(500).json({ message: error.message });
  }
}

async function findOne( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const zone = await em.find(Zone, { id: id }, {populate:['shelters']});
    res.status(200).json({ message: 'zone data: ', data: zone });
  }catch (error: any){
    res.status(500).json({ message: error.message });
  }
}

async function add( req: Request, res: Response ){
  try{
    const zone = em.create(Zone, req.body.sanitizedZone);
    await em.flush();
    res.status(201).json({ message: 'zone created', data: zone });
  }catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function update( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const zone = em.getReference(Zone, id);
    em.assign(zone, req.body.sanitizedZone);
    await em.flush();
    res.status(200).json({ message: 'zone updated', data: zone });
  }catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const zone = em.getReference(Zone, id);
    em.removeAndFlush(zone);
    res.status(200).json({ message: 'zone deleted', data: zone });
  }catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

function sanitizeZoneInput(req: Request, res: Response, next:NextFunction){
  req.body.sanitizedZone = {
    name: req.body.name,
    shelters: req.body.shelters
  }
    Object.keys(req.body.sanitizedZone).forEach((key) => {
    if (req.body.sanitizedZone[key] === undefined) {
      delete req.body.sanitizedZone[key]
    }
  })

  next()
}

export { findAll, findOne, add, update, remove, sanitizeZoneInput }
