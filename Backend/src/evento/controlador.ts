import { Request, Response, NextFunction } from "express";
import { EventoRepository } from "./repositorio.js";
import { evento } from "./evento.js";

const repository = new EventoRepository()

function sanitizedEventoInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizedInput = { 
        idEvento : req.body.idEvento,
        nombre : req.body.nombre,
        cuposGral : req.body.cuposGral,
        descripcion : req.body.descripcion,
        fecha : req.body.fecha,
        hora : req.body.hora,
    };
    //validar

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}

function findAll(req: Request,res: Response) {
    return res.json({data:repository.findAll()})
}

function findOne(req: Request,res: Response) {
    const nuevoEvento = repository.findOne({id:req.params.id}) 
    if (!nuevoEvento) {
        return res.status(404).send({message: 'evento no encontrado'})
    }
    return res.json({data: nuevoEvento})
}


function add(req: Request,res: Response) {
    const input = req.body.sanitizedInput

    const nuevoEventoInput = new evento(
        input.idEvento,
        input.nombre, 
        input.cuposGral, 
        input.descripcion, 
        input.fecha, 
        input.hora
    )
    const nuevoEvento = repository.add(nuevoEventoInput)
    return res.status(201).send({message: 'Evento creado', data: nuevoEvento})
}
    

function update(req: Request, res: Response){
    req.body.sanitizedInput.id = req.params.id
    const nuevoEvento = repository.update(req.body.sanitizedInput)
    
    if(!nuevoEvento){
        return res.status(404).send({message: 'evento no encontrado'})
    }
    return res.status(200).send({message:'Evento actualizado correctamente', data: nuevoEvento})
}


function remove(req: Request,res: Response) {
    const id = req.params.id
    const nuevoEvento = repository.delete({id})

    if(!nuevoEvento) {
        res.status(404).send({message:'Evento no encontrado'})
    }else {
        res.status(200).send({message: 'Evento borrado satisfactoriamente'})
    }
}


export {sanitizedEventoInput, findAll, findOne, add, update, remove}