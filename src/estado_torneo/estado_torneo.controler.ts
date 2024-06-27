import { Request, Response, NextFunction } from 'express'
import { estado_torneoRepository } from './estado_torneo.repository.js'
import { estado_torneo} from './estado_torneo.entity.js'

const repository = new estado_torneoRepository()

function sanitizedEstadoInput(req: Request, res: Response, next: NextFunction) {
req.body.sanitizedInput = {
    id: req.body.id,
    nombre_estado: req.body.nombre_estado,
}


Object.keys(req.body.sanitizedInput).forEach((key) => {
if (req.body.sanitizedInput[key] === undefined) {
delete req.body.sanitizedInput[key]
}
})

next()

}



function findAll(req: Request, res: Response) {
res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
const id = req.params.id
const estado_torneo = repository.findOne({ id })
if (!estado_torneo) {
return res.status(404).send({ message: 'No se encontro el estado' })
}
res.json({ data: estado_torneo })
}


function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const nuevoEstadoInput = new estado_torneo (
    input.id,
    input.nombre_estado
    )

    const nuevo_estado = repository.add(nuevoEstadoInput)
    return res.status(201).send({ message: 'Se creo el estado del torneo', data: nuevo_estado })
}


function update(req: Request, res: Response) {
req.body.sanitizedInput.id = req.params.id
const estado = repository.update(req.body.sanitizedInput)

if (!estado) {
return res.status(404).send({ message: 'no se encontro el estado indicado' })
}

return res.status(200).send({ message: 'el estado se actualizo correctamente', data: estado_torneo })
}


function remove(req: Request, res: Response) {
const id = req.params.id
const estado_torneo = repository.delete({ id })

if (!estado_torneo) {
res.status(404).send({ message: 'no se encontro el estado indicado' })
} else {
res.status(200).send({ message: 'el estado se borro correctamente' })
}
}

export { sanitizedEstadoInput, findAll, findOne, add, update, remove }