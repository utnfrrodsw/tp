import { Request, Response, NextFunction } from "express";
import { LocalidadesRepository } from "./localidades.repository.js";
import { Localidad } from "./localidades.entity.js";

const repository = new LocalidadesRepository()

function sanitizarLocalidadInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarLoc = {
        nombre_localidad: req.body.nombre_localidad,
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarLoc).forEach(key =>{
        if(req.body.sanitizarLoc[key]===undefined){
            delete req.body.sanitizarLoc[key]
    }})
    next()
}

function findAll(req: Request,res: Response){
    res.json({data: repository.findAll()})
}

function findOne(req: Request,res: Response){
    const id = req.params.id
    const localidad = repository.findOne({id})
    if(!localidad){
        res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
    res.json({data: localidad})
    }}

function add(req: Request,res: Response){
    const input = req.body.sanitizarLoc
    
    const localidadInput = new Localidad (input.nombre_localidad)
    
    const localidad = repository.add(localidadInput)
    res.status(201).send({message: 'Localidad caragada correctamente', data: localidad })
}

function update(req: Request,res: Response){
    req.body.sanitizarLoc.id = req.params.id
    const localidad = repository.update(req.body.sanitizarLoc)

    if(!localidad){
        res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
    res.status(200).send({message: 'Localidad modificada correctamente', data: localidad})
}}

function remove(req: Request,res: Response){
    const id = req.params.id
    const localidad = repository.delete({id})

    if(!localidad){
        res.status(404).send({message:'ID incorrecto, no existe ninguna localidad con el ID indicado' })
    }else{
    res.status(200).send({message: 'Localidad borrada correctamente'})
}}

export {sanitizarLocalidadInput, findAll, findOne, add, update, remove}