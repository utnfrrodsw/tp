import { Request, Response, NextFunction } from 'express'
import { modoEnvioRepository } from './modoEnvio.repository.js'
import { modoEnvio } from './modoEnvio.entity.js'

const repository = new modoEnvioRepository()

function sanitizeModoEnvioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    precio: req.body.precio,
  }
  //more checks here

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
  const modoEnvio = repository.findOne({ id })
  if (!modoEnvio) {
    return res.status(404).send({ message: 'modoEnvio not found' })
  }
  res.json({ data: modoEnvio })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const modoEnvioInput = new modoEnvio(input.nombre, input.precio)

  const ModoEnvio = repository.add(modoEnvioInput)
  return res.status(201).send({ message: 'Modo Envio created', data: modoEnvio })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const modoEnvio = repository.update(req.body.sanitizedInput)

  if (!modoEnvio) {
    return res.status(404).send({ message: 'Modo Envio not found' })
  }

  return res.status(200).send({ message: 'Modo Envio updated successfully', data: modoEnvio })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const modoEnvio = repository.delete({ id })

  if (!modoEnvio) {
    res.status(404).send({ message: 'Modo Envio not found' })
  } else {
    res.status(200).send({ message: 'Modo Envio deleted successfully' })
  }
}

export { sanitizeModoEnvioInput, findAll, add, findOne, update, remove }
