import { Request, Response, NextFunction } from "express";
import { Localidad } from "./localidades.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizarLocalidadInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarLoc = {
        nombre_localidad: req.body.nombre_localidad,
        id: req.body.id,
        sucursales: req.body.sucursales
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarLoc).forEach(key =>{
        if(req.body.sanitizarLoc[key]===undefined){
            delete req.body.sanitizarLoc[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    try{
        const localidades = await em.find(Localidad, {}, {populate: ['sucursales']})
        res.status(200).json({message: 'found all localidades', data: localidades})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const localidad = await em.findOneOrFail(Localidad, {id},{populate: ['sucursales']})
        res.status(200).json({message: 'found localidad', data: localidad})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request,res: Response){
    try{
        const localidad = em.create(Localidad, req.body)
        await em.flush()
        res.status(200).json({message: 'localidad created', data: localidad})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const localidad = await em.findOneOrFail(Localidad, id)
        em.assign(localidad, req.body)
        await em.flush()
        res.status(200).json({message: 'localidad updated', data: localidad})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const localidad = em.getReference(Localidad, id)
        await em.removeAndFlush(localidad)
        res.status(200).json({message: 'localidad removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


export {sanitizarLocalidadInput, findAll, findOne, add, update, remove}