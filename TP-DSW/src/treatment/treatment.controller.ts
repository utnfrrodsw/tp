import { Request, Response, NextFunction } from 'express';
import { Treatment } from './treatment.entity.js';
import { TreatmentRepository } from './treatment.repository.js';

const repository = new TreatmentRepository();

function sanitizeTreatmentInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description
  };

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
    const id = req.params.id
    const treatment = repository.findOne({id})
    if (!treatment){
      return res.status(404).send({ message: 'Treatment not found' })
    }
    res.json ({data: treatment})
  }
  
  function add (req: Request, res: Response) {
      const input = req.body.sanitizedInput;
  
      const specialtyInput = new Treatment (
          input.id,
          input.name,
          input.description,
      );
  
      const treatment = repository.add(specialtyInput);
      return res.status(201).send({ message: 'Treatment created successfully', data: treatment});
  }
  
  function update(req: Request, res: Response) {
      req.body.sanitizedInput.id = req.params.id
      const treatment = repository.update(req.body.sanitizedInput)
    
      if (!treatment) {
        return res.status(404).send({ message: 'Treatment not found' })
      }
    
      return res.status(200).send({ message: 'Treatment updated successfully', data: treatment })
    }
  
    function remove (req: Request, res: Response) {
      const id = req.params.id;
      const treatment = repository.delete({ id });
  
      if (treatment === undefined) {
          res.status(404).send({message : "Treatment not found"})
      }
      else {
          res.status(200).send({message : "Treatment deleted"})
      }
    }
  
  
  export { sanitizeTreatmentInput, findAll, findOne, add, update, remove};