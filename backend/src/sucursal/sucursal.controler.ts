import { Request, Response, NextFunction } from "express";
import { SucursalesRepository } from "./sucursal.repository.js";
import { Sucursal } from "./sucursal.entity.js";

const repository = new SucursalesRepository()

function sanitizarSucursalInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarSuc = {
        nombre_sucursal: req.body.nombre_sucursal,
        localidad: req.body.localidad,
        id: req.body.id
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarSuc).forEach(key =>{
        if(req.body.sanitizarSuc[key]===undefined){
            delete req.body.sanitizarSuc[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    return res.json({data: await repository.findAll()})
}

async function findOne(req: Request,res: Response){
    const id = req.params.id
    const sucursal = await repository.findOne({id})
    if(!sucursal){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna sucursal con el ID indicado' })
    }else{
    return res.json({data: sucursal})
    }
}

async function add(req: Request,res: Response){
    const input = req.body.sanitizarSuc
    
    const sucursalInput = new Sucursal (input.nombre_sucursal, input.localidad, input.id)
    
    const sucursal = await repository.add(sucursalInput)
    return res.status(201).send({message: 'Sucursal caragada correctamente', data: sucursal })
}

async function update(req: Request,res: Response){
    req.body.sanitizarSuc.id = req.params.id
    const sucursal = await repository.update(req.params.id, req.body.sanitizarSuc)
    
    if(!sucursal){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna sucursal con el ID indicado' })
    }else{
        return res.status(200).send({message: 'Sucursal modificada correctamente', data: sucursal})
}}

async function remove(req: Request,res: Response){
    const id = req.params.id
    const sucursal = await repository.delete({id})

    if(!sucursal){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna sucursal con el ID indicado' })
    }else{
    return res.status(200).send({message: 'Sucursal borrada correctamente'})
}}

export {sanitizarSucursalInput, findAll, findOne, add, update, remove}