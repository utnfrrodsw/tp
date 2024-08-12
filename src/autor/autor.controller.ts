import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Autor } from "./autor.entity.js";
import { errorDominio } from "../shared/DB/errors.js";
import { NotFoundError } from "@mikro-orm/core";
import { error } from "console";

const em = orm.em;

async function buscaAutores(req: Request, res: Response, next: NextFunction) {
  try {
    const autores = await em.find(Autor, {}, { populate: ["misLibros"] });
    return res
      .status(200)
      .json({ message: "Los autores encontrados son:", data: autores });
  } catch (error: any) {
    next(error);
  }
}

async function buscaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = await em.findOneOrFail(
      Autor,
      { id },
      { populate: ["misLibros"] }
    );
    return res.status(200).json({ message: "Autor encontrado", data: autor });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Autor inexistente" });
    }
    next(error);
  }
}

async function altaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const autor = em.create(Autor, req.body);
    await em.flush();
    return res.status(201).json({ message: "Autor creado", data: autor });
  } catch (error: any) {
    next(error);
  }
}

async function actualizarAutor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    em.assign(autor, req.body);
    await em.flush();
    return res.status(200).json({ message: "Autor actualizado" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaAutor(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const autor = em.getReference(Autor, id);
    await em.removeAndFlush(autor);
    return res.status(200).send({ message: "Autor borrado" });
  } catch (error: any) {
    if (error instanceof errorDominio) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
}

export { buscaAutores, buscaAutor, altaAutor, actualizarAutor, bajaAutor };
