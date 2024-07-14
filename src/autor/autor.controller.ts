import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Autor } from "./autor.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    misLibros: req.body.libros, // Revisar
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscaAutores(req: Request, res: Response) {
  try {
    const autores = await em.find(Autor, {}, { populate: ["misLibros"] });
    res
      .status(200)
      .json({ message: "Los autores encontrados son:", data: autores });
  } catch (error: any) {
    res.status(500).json({ message: error.message }); // Mensaje dejado para el desarollo.
  }
}

async function buscaAutor(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = await em.findOneOrFail(Autor, { id });
    res.status(200).json({ message: "Autor encontrado", data: autor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaAutor(req: Request, res: Response) {
  try {
    const autor = em.create(Autor, req.body.inputOK);
    await em.flush();
    res.status(201).json({ message: "Autor creado", data: autor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function actualizarAutor(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    em.assign(autor, req.body.inputOK);
    await em.flush();
    res.status(200).json({ message: "Autor actualizado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaAutor(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    await em.removeAndFlush(autor);
    res.status(200).send({ message: "Autor borrado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export {
  sanitizeInput,
  buscaAutores,
  buscaAutor,
  altaAutor,
  actualizarAutor,
  bajaAutor,
};
