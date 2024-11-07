import { Request, Response, NextFunction } from 'express'
import { Tipo_participante } from './tipo_participante.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeTipo_participanteInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        posicion: req.body.posicion,
        participantes: req.body.participantes,
        id: req.body.id
    }

    //Acá irían las validaciones de datos...

Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key]
    }})
    next()
}

async function findAll(req: Request, res: Response) {
    try{
        const tipos_participante = await em.find(Tipo_participante, {}, {populate: ['participantes']})
        res.status(200).json({message: 'found all tipos_participante', data: tipos_participante})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const tipo_participante = await em.findOneOrFail(Tipo_participante, {id},{populate: ['participantes']})
        res.status(200).json({message: 'found tipo_participante', data: tipo_participante})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function add(req: Request, res: Response) {
    try{
        const tipo_participante = em.create(Tipo_participante, req.body)
        await em.flush()
        res.status(200).json({message: 'tipo_participante created', data: tipo_participante})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const tipo_participante = em.findOneOrFail(Tipo_participante, id)
        em.assign(Tipo_participante, req.body)
        await em.flush()
        res.status(200).json({message: 'tipo_participante updated', data: tipo_participante})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const tipo_participante = em.getReference(Tipo_participante, id)
        await em.removeAndFlush(tipo_participante)
        res.status(200).json({message: 'tipo_participante removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

export { sanitizeTipo_participanteInput, findAll, findOne, add, update, remove }