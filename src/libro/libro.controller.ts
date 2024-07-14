import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Libro } from "./libro.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    isbn: req.body.isbn,
    miAutor: req.body.miAutor, // Revisar
    misEditoriales: req.body.misEditoriales, //Revisar
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscaLibros(req: Request, res: Response) {
  try {
    const autores = await em.find(
      Libro,
      {},
      { populate: ["miAutor", "misEditoriales"] }
    );
    res.status(200).json({ message: "Libros encontrados: ", data: autores });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function buscaLibro(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(
      Libro,
      { id },
      { populate: ["miAutor", "misEditoriales"] }
    );
    res.status(200).json({ message: "Libro encontrado", data: libro });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaLibro(req: Request, res: Response) {
  try {
    const libro = em.create(Libro, req.body.inputOK);
    await em.flush();
    res.status(201).json({ message: "Libro creado", data: libro });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function actualizarLibro(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libroActualizar = await em.findOneOrFail(Libro, { id });
    em.assign(libroActualizar, req.body.inputOK);
    await em.flush();
    res
      .status(200)
      .json({ message: "Libro actualizado", data: libroActualizar });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaLibro(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, id);
    await em.removeAndFlush(libro);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeInput,
  buscaLibros,
  buscaLibro,
  altaLibro,
  actualizarLibro,
  bajaLibro,
};
