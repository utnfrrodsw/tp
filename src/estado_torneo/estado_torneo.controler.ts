import { Request, Response, NextFunction } from 'express'
import { estado_torneoRepository } from './estado_torneo.repository.js'
import { estado_torneo} from './estado_torneo.entity.js'

const repository = new estado_torneoRepository()

function sanitizedEstadoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        id: req.body.id,
        nombre_estado: req.body.nombre_estado,
    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
    }})
    next()
}



async function findAll(req: Request, res: Response) {
    res.json({ data: await repository.findAll() })
}


async function findOne(req: Request, res: Response) {
    const id = req.params.id
    const estado_torneo = await repository.findOne({ id })
    if (!estado_torneo) {
        res.status(404).send({ message: 'No se encontro el estado' })
    }else{
    res.json({ data: estado_torneo })
    }
}


async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const nuevoEstadoInput = new estado_torneo (
    input.id,
    input.nombre_estado
    )

    const nuevo_estado = await repository.add(nuevoEstadoInput)
    res.status(201).send({ message: 'Se creo el estado del torneo', data: nuevo_estado })
}


async function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id
    const estado = await repository.update(req.body.sanitizedInput)

    if (!estado) {
    res.status(404).send({ message: 'no se encontro el estado indicado' })
    }else{
    res.status(200).send({ message: 'el estado se actualizo correctamente', data: estado_torneo })
    }
}


async function remove(req: Request, res: Response) {
    const id = req.params.id
    const estado_torneo = await repository.delete({ id })

    if (!estado_torneo) {
        res.status(404).send({ message: 'no se encontro el estado indicado' })
    } else {
    res.status(200).send({ message: 'el estado se borro correctamente' })
    }
}

export { sanitizedEstadoInput, findAll, findOne, add, update, remove }