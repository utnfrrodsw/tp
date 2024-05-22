import { Request, Response, NextFunction } from "express";
import { AutorRepositorio } from "./autor.repository.js";
import { Autor } from "./autor.entity.js";

const repository = new AutorRepositorio();

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

function buscaAutores(req: Request, res: Response) {
  return res.json({ data: repository.findAll() });
}

function buscaAutor(req: Request, res: Response) {
  const autor = repository.findOne({ id: req.params.id });
  if (!autor) {
    return res.status(404).send({ message: "Autor no encontrado" });
  }
  return res.json({ data: autor });
}

function altaAutor(req: Request, res: Response) {
  const input = req.body.inputOK;
  const autorPost = new Autor(input.nombre, input.apellido);
  const autorGuardado = repository.add(autorPost);
  return res
    .status(201)
    .send({ message: "Autor cargado", data: autorGuardado });
}

function actualizarAutor(req: Request, res: Response) {
  req.body.inputOK.idAutor = req.params.id;
  const autorUpdated = repository.update(req.body.inputOK);

  if (!autorUpdated) {
    return res
      .status(404)
      .send({ message: "No existe el id del autor ingresado." });
  }
  return res
    .status(200)
    .send({ message: "Autor actualizado", data: autorUpdated });
}

function bajaAutor(req: Request, res: Response) {
  const autorBorrado = repository.delete({ id: req.params.id });

  if (!autorBorrado) {
    return res.status(404).send({ message: "Autor no encontrado." });
  }
  return res
    .status(200)
    .send({ message: "Autor eliminado", data: autorBorrado });
}

export {
  sanitizeInput,
  buscaAutores,
  buscaAutor,
  altaAutor,
  actualizarAutor,
  bajaAutor,
};
