import { Request, Response, NextFunction } from "express";
import { TorneosRepository } from "./torneo.repository.js";
import { Torneo } from "./torneo.entity.js";

const repository = new TorneosRepository()

function sanitizarTorneoInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarTor = {
        nombre_torneo: req.body.nombre_torneo,
        fecha_inico_insc: req.body.fecha_inico_insc,
        fecha_fin_insc: req.body.fecha_fin_insc,
        fecha_inicio_torneo: req.body.fecha_inicio_torneo,
        fecha_fin_torneo: req.body.fecha_fin_torneo,
        estado_tor: req.body.estado_tor,
        ganador: req.body.ganador,
        formato: req.body.formato,
        sucursal: req.body.sucursal,
        nro_adm: req.body.nro_adm,
        id: req.body.id
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarTor).forEach(key =>{
        if(req.body.sanitizarTor[key]===undefined){
            delete req.body.sanitizarTor[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    return res.json({data: await repository.findAll()})
}

async function findOne(req: Request,res: Response){
    const id = req.params.id
    const torneo = await repository.findOne({id})
    if(!torneo){
        return res.status(404).send({message:'ID incorrecto, no existe ningún torneo con el ID indicado' })
    }else{
    return res.json({data: torneo})
    }
}

async function add(req: Request,res: Response){
    const input = req.body.sanitizarTor
    
    const torneoInput = new Torneo (
        input.nombre_torneo, 
        input.fecha_inico_insc, 
        input.fecha_fin_insc, 
        input.fecha_inicio_torneo, 
        input.fecha_fin_torneo, 
        input.estado_tor, 
        input.ganador, 
        input.formato, 
        input.sucursal,
        input.nro_adm,
        input.id)
    
    const torneo = await repository.add(torneoInput)
    return res.status(201).send({message: 'Torneo caragado correctamente', data: torneo })
}

async function update(req: Request,res: Response){
    req.body.sanitizarTor.id = req.params.id
    const torneo = await repository.update(req.params.id, req.body.sanitizarTor)
    
    if(!torneo){
        return res.status(404).send({message:'ID incorrecto, no existe ningún torneo con el ID indicado' })
    }else{
        return res.status(200).send({message: 'Torneo modificado correctamente', data: torneo})
}}

async function remove(req: Request,res: Response){
    const id = req.params.id
    const torneo = await repository.delete({id})

    if(!torneo){
        return res.status(404).send({message:'ID incorrecto, no existe ningún torneo con el ID indicado' })
    }else{
    return res.status(200).send({message: 'Torneo borrado correctamente'})
}}

export {sanitizarTorneoInput, findAll, findOne, add, update, remove}