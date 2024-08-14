"use strict";
/*import { Request, Response, NextFunction } from 'express';
import { UserRepository } from './user.repository.js';
import { User } from './user.entity.js';

const repository = new UserRepository();

function sanitizeUserInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    tuitionNumber: req.body.tuitionNumber,
    
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const user = repository.findOne({ id });
  if (!user) {
    return res.status(404).send({ message: 'user not found' });
  }
  res.json({ data: user });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const userInput = new User(
    input.id,
    input.firstName,
    input.lastName,
    input.email,
    input.password,
    input.age,
    input.tuitionNumber
  );

  const user = repository.add(userInput);
  return res
    .status(201)
    .send({ message: 'User created', data: user });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const user = repository.update(req.body.sanitizedInput);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  return res
    .status(200).send({ message: 'User updated successfully', data: user });
}

function remove(req: Request, res: Response) {
  const id = req.params.id;
  const user = repository.delete({ id });

  if (!user) {
    res.status(404).send({ message: 'User not found' });
  } else {
    res.status(200).send({ message: 'User deleted successfully' });
  }
}

export { sanitizeUserInput, findAll, findOne, add, update, remove };*/
//# sourceMappingURL=user.controller.js.map