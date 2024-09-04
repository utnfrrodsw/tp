import { Request, Response, NextFunction } from "express";
import { EquiposRepository } from "./equipo.repository.js";
import { Equipo } from "./equipo.entity.js";

const repository = new EquiposRepository()

function sanitizarEquipoInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarEq = {

        jugador1: req.body.jugador1,
        jugador2: req.body.jugador2,
        jugador3: req.body.jugador3,
        jugador4: req.body.jugador4,
        jugador5: req.body.jugador5,
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
    return res.json({data: await repository.findAll()})
}

async function findOne(req: Request,res: Response){
    const id = req.params.id
    const equipo = await repository.findOne({id})
    if(!equipo){
        return res.status(404).send({message:'ID incorrecto, no existe ninguna equipo con el ID indicado' })
    }else{
    return res.json({data: equipo})
    }
}

async function add(req: Request,res: Response){
    const input = req.body.sanitizarEq
    
    const equipoInput = new Equipo ( 
        input.jugador1, 
        input.jugador2, 
        input.jugador3, 
        input.jugador4, 
        input.jugador5, 
        input.torneo,
        input.id)
    
    const equipo = await repository.add(equipoInput)
    return res.status(201).send({message: 'Equipo caragado correctamente', data: equipo })
}

async function update(req: Request,res: Response){
    req.body.sanitizarEq.id = req.params.id
    const equipo = await repository.update(req.params.id, req.body.sanitizarEq)
    
    if(!equipo){
        return res.status(404).send({message:'ID incorrecto, no existe ningún equipo con el ID indicado' })
    }else{
        return res.status(200).send({message: 'Equipo modificado correctamente', data: equipo})
}}

async function remove(req: Request,res: Response){
    const id = req.params.id
    const equipo = await repository.delete({id})

    if(!equipo){
        return res.status(404).send({message:'ID incorrecto, no existe ningún equipo con el ID indicado' })
    }else{
    return res.status(200).send({message: 'Equipo borrado correctamente'})
}}

export {sanitizarEquipoInput, findAll, findOne, add, update, remove}