import { Request, Response, NextFunction } from 'express'
import { ProviderRepository } from './provider.repository.js'
import { Provider } from './provider.entity.js'

const repository = new ProviderRepository()

function sanitizeProviderInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    businessName: req.body.businessName,
    email: req.body.email,
    phoneNum: req.body.phoneNum,
    address: req.body.address,
    cuit: req.body.cuit,
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
  const provider = repository.findOne({ id })
  if (!provider) {
    return res.status(404).send({ message: 'Provider not found' })
  }
  res.json({ data: provider })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const providerInput = new Provider(
    input.businessName,
    input.email,
    input.phoneNum,
    input.address,
    input.cuit,
  )

  const provider = repository.add(providerInput)
  return res.status(201).send({ message: 'Provider created', data: provider })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const provider = repository.update(req.body.sanitizedInput)

  if (!provider) {
    return res.status(404).send({ message: 'Provider not found' })
  }

  return res.status(200).send({ message: 'Provider updated successfully', data: provider })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const provider = repository.delete({ id })

  if (!provider) {
    res.status(404).send({ message: 'Provider not found' })
  } else {
    res.status(200).send({ message: 'Provider deleted successfully' })
  }
}

export { sanitizeProviderInput, findAll, findOne, add, update, remove }