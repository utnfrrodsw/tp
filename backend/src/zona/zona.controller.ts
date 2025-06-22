import { Request, Response, NextFunction } from 'express'
import {Zona} from './zona.entity.js'
import { request } from 'http'
import { orm } from '../shared/db/orm.js'

const em = orm.em;
function sanitizeZonaInput(req: Request, res: Response, next:NextFunction){

    req.body.sanitizedInput = {
        descripcionZona: req.body.descripcionZona
    }
    next()
}


async function findAll(req: Request, res: Response){
    try{
        const zona = await em.find(Zona, {})
        res.status(200).json({message: 'find all zonas exitoso', data:Zona})
    }catch(error:any){
        res.status(500).json({message: error.message})
    }
}
async function findOne(req: Request, res: Response){
   try{
       // const codZona = Number.parseInt(req.params.id);
        const zona = await em.findOneOrFail(Zona,{/*codZona*/})
        res
            .status(200)
            .json({message: "found zon",data:zona})
   }catch(error:any){
        res.status(500).json({message:error.message})
   }
}
async function add(req: Request, res: Response){
    try{
       const zona = em.create(Zona, req.body.sanitizedInput);
       await em.flush()
       res.status(201).json({message:'zona creada',data:zona})
    }catch(error:any){
        res.status(500).json({message:error.message})
    }
}
async function update(req: Request, res: Response){
    // try{
    //     //id
    //     const zona = em.getReference(Zona,/*id*/)
    //     em.assign(zona, req.body.sanitizedInput)
    //     await em.flush()
    //     res
    //         .status(200)
    //         .json({message: "zona actualizada"})
    // }catch(error:any){res.status(500).json({message:error.message})}
}
async function remove(req: Request, res: Response){
    //  try{
    //     //id
    //     const zona = em.getReference(Zona, /*id*/)
    //     await em.removeAndFlush(zona);
    //     res.status(200).send({message:'zona borrada'})
    // }catch(error:any){res.status(500).json({message:error.message})}
}
export { findAll, findOne, add, update, remove, sanitizeZonaInput}