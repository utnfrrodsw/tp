import { Request, Response, NextFunction } from 'express'
import { EmployeeRepository } from './employee.repository.js'
import { Employee } from './employee.entity.js'

const repository = new EmployeeRepository()

function sanitizeEmployeeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    email: req.body.email,
    phoneNum: req.body.phoneNum,
    address: req.body.address,
    salary: req.body.salary,
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
  const employee = repository.findOne({ id })
  if (!employee) {
    return res.status(404).send({ message: 'Employee not found' })
  }
  res.json({ data: employee })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const employeeInput = new Employee(
    input.name,
    input.email,
    input.phoneNum,
    input.address,
    input.salary,
  )

  const employee = repository.add(employeeInput)
  return res.status(201).send({ message: 'Employee created', data: employee })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const employee = repository.update(req.body.sanitizedInput)

  if (!employee) {
    return res.status(404).send({ message: 'Employee not found' })
  }

  return res.status(200).send({ message: 'Employee updated successfully', data: employee })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const employee = repository.delete({ id })

  if (!employee) {
    res.status(404).send({ message: 'Employee not found' })
  } else {
    res.status(200).send({ message: 'Employee deleted successfully' })
  }
}

export { sanitizeEmployeeInput, findAll, findOne, add, update, remove }