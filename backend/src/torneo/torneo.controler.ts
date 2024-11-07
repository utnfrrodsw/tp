import { Request, Response, NextFunction } from "express";
import { Torneo } from "./torneo.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizarTorneoInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarTor = {
        nombre_torneo: req.body.nombre_torneo,
        fecha_inico_insc: req.body.fecha_inico_insc,
        fecha_fin_insc: req.body.fecha_fin_insc,
        fecha_inicio_torneo: req.body.fecha_inicio_torneo,
        fecha_fin_torneo: req.body.fecha_fin_torneo,
        estado_tor: req.body.estado_tor,
        ganador: req.body.ganador,
        id: req.body.id,
        equipos: req.body.equipos,
        partidos: req.body.partidos,
        admin: req.body.admin,
        torneo: req.body.torneo,
        estado_torneo: req.body.estado_torneo,
        formato_torneo: req.body.formato_torneo
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarTor).forEach(key =>{
        if(req.body.sanitizarTor[key]===undefined){
            delete req.body.sanitizarTor[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    try{
        const torneos = await em.find(Torneo, {}, {populate: ['equipos', 'partidos','admin','sucursal','estado_torneo','formato_torneo']})
        res.status(200).json({message: 'found all torneos', data: torneos})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const torneo = await em.findOneOrFail(Torneo, {id},{populate: ['equipos', 'partidos','admin','sucursal','estado_torneo','formato_torneo']})
        res.status(200).json({message: 'found torneo', data: torneo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request,res: Response){
    try{
        const torneo = em.create(Torneo, req.body)
        await em.flush()
        res.status(200).json({message: 'torneo created', data: torneo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const torneo = em.findOneOrFail(Torneo, id)
        em.assign(Torneo, req.body)
        await em.flush()
        res.status(200).json({message: 'torneo updated', data: torneo})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const torneo = em.getReference(Torneo, id)
        await em.removeAndFlush(torneo)
        res.status(200).json({message: 'torneo removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

export {sanitizarTorneoInput, findAll, findOne, add, update, remove}