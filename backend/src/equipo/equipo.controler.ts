import { Request, Response, NextFunction } from "express";
import { Equipo } from "./equipo.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizarEquipoInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarEq = {

        participantes: req.body.participantes,
        partidos: req.body.partidos,
        torneo: req.body.torneo,
        id: req.body.id

    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarEq).forEach(key =>{
        if(req.body.sanitizarEq[key]===undefined){
            delete req.body.sanitizarEq[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    try{
        const equipos = await em.find(Equipo, {}, {populate: ['participantes','partidos','torneo']})
        res.status(200).json({message: 'found all equipos', data: equipos})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const equipo = await em.findOneOrFail(Equipo, {id},{populate: ['participantes','partidos','torneo']})
        res.status(200).json({message: 'found equipo', data: equipo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request,res: Response){
    try{
        const equipo = em.create(Equipo, req.body)
        await em.flush()
        res.status(200).json({message: 'equipo created', data: equipo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const equipo = await em.findOneOrFail(Equipo, id)
        em.assign(equipo, req.body)
        await em.flush()
        res.status(200).json({message: 'equipo updated', data: equipo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const equipo = em.getReference(Equipo, id)
        await em.removeAndFlush(equipo)
        res.status(200).json({message: 'equipo removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

export {sanitizarEquipoInput, findAll, findOne, add, update, remove}