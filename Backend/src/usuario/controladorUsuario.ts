import { Request, Response, NextFunction } from "express";
import { UserRepository } from "./repositorioUsuario";
import { User } from "./usuario";

const repository = new UserRepository()

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {

    req.body.sanitizeUserInput = {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        birthdate: req.body.birthdate,
    }
    //faltan validaciones

    Object.keys(req.body.sanitizeUserInput).forEach(key => {
        if (req.body.sanitizeUserInput[key] === undefined) {
            delete req.body.sanitizeUserInput[key]
        }
    })
    next()
}

function findAll(req: Request, res: Response) {
    return res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
    const nuevoUsuario = repository.findOne({ id: String(req.params.id) })
    if (!nuevoUsuario) {
        return res.status(404).send({ message: 'usuario no encontrado' })
    }
    return res.json(nuevoUsuario)
}


function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput
    const nuevoUsuarioInput = new User(
        input.name,
        input.email,
        input.birthdate,
        input.pass,
        input.id,
    )
    const nuevoEvento = repository.add(nuevoUsuarioInput)
    return res.status(201).send({ message: 'usuario creado', data: nuevoUsuarioInput })
}


function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id
    const nuevoUsuario = repository.update(req.body.sanitizedInput)

    if (!nuevoUsuario) {
        return res.status(404).send({ message: 'usuario no encontrado' })
    }
    return res.status(200).send({ message: 'usuario actualizado correctamente', data: nuevoUsuario })
}
//NO ANDA SI PONGO EL ID EN LA API, SI LO PONGO EN EL JSON SI


function remove(req: Request, res: Response) {
    const id = String(req.params.id)
    const nuevoUsuario = repository.delete({ id })

    if (!nuevoUsuario) {
        res.status(404).send({ message: 'usuario no encontrado' })
    } else {
        res.status(200).send({ message: 'usuario borrado satisfactoriamente' })
    }
}


export { sanitizeUserInput, findAll, findOne, add, update, remove }