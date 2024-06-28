import { Request, Response, NextFunction } from 'express';
import { SocioRepository } from './socio.repository';
import { Socio } from './socio.entity';

const repository = new SocioRepository();

// Sanitiza la entrada de datos para crear un nuevo socio
function sanitizeSocioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: req.body.edad,
    cuota: req.body.cuota,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

// Obtiene todos los socios
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

// Obtiene un socio por ID
function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const socio = repository.findOne({ id });

  if (!socio) {
    return res.status(404).send({ message: 'No se encontró el socio' });
  }

  res.json({ data: socio });
}

// Crea un nuevo socio
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const socioInput = new Socio(
    input.nombre,
    input.apellido,
    input.edad,
    input.cuota,
  );

  const socio = repository.add(socioInput);
  return res.status(201).send({ message: 'Socio creado', data: socio });
}

// Actualiza un socio
function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const socio = repository.update(req.body.sanitizedInput);

  if (!socio) {
    return res.status(404).send({ message: 'No se encontró el socio' });
  }

  return res.status(200).send({ message: 'Socio actualizado exitosamente', data: socio });
}

// Elimina un socio
function remove(req: Request, res: Response) {
  const id = req.params.id;
  const socio = repository.delete({ id });

  if (!socio) {
    res.status(404).send({ message: 'No se encontró el socio' });
  } else {
    res.status(200).send({ message: 'Socio eliminado exitosamente' });
  }
}

export { sanitizeSocioInput, findAll, findOne, add, update, remove };