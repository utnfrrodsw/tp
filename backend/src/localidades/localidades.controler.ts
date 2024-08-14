import { Request, Response, NextFunction } from "express";
import { LocalidadesRepository } from "./localidades.repository.js";
import { Localidad } from "./localidades.entity.js";

const repository = new LocalidadesRepository()

function sanitizarLocalidadInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarLoc = {
        nombre_localidad: req.body.nombre_localidad,
        id: req.body.id
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarLoc).forEach(key =>{
        if(req.body.sanitizarLoc[key]===undefined){
            delete req.body.sanitizarLoc[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    return res.json({data: await repository.findAll()})
}

async function findOne(req: Request,res: Response){
    const id = req.params.id
    const localidad = await repository.findOne({id})
    if(!localidad){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
    return res.json({data: localidad})
    }
}

async function add(req: Request,res: Response){
    const input = req.body.sanitizarLoc
    
    const localidadInput = new Localidad (input.nombre_localidad, input.id)
    
    const localidad = await repository.add(localidadInput)
    return res.status(201).send({message: 'Localidad caragada correctamente', data: localidad })
}

async function update(req: Request,res: Response){
    req.body.sanitizarLoc.id = req.params.id
    const localidad = await repository.update(req.params.id, req.body.sanitizarLoc)
    
    if(!localidad){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
        return res.status(200).send({message: 'Localidad modificada correctamente', data: localidad})
}}

async function remove(req: Request,res: Response){
    const id = req.params.id
    const localidad = await repository.delete({id})

    if(!localidad){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
    return res.status(200).send({message: 'Localidad borrada correctamente'})
}}

export {sanitizarLocalidadInput, findAll, findOne, add, update, remove}