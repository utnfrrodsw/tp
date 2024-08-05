import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Libro } from "./libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { DateType } from "@mikro-orm/core";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    isbn: req.body.isbn,
    misAutores: req.body.misAutores, // Revisar
    miEditorial: req.body.miEditorial, //Revisar
    cantEjemplares: req.body.cantEjemplares,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

function sanitizeLibro(libro: Libro) {
  return {
    id: libro.id,
    titulo: libro.titulo,
    descripcion: libro.descripcion,
    isbn: libro.isbn,
    misAutores: libro.misAutores.map((autor) => autor.id),
    miEditorial: libro.miEditorial.id,
    misEjemplares: libro.misEjemplares.map((ejemplar) => ({
      idEjemplar: ejemplar.id,
    })),
  };
}

const em = orm.em;

async function buscaLibros(req: Request, res: Response) {
  try {
    const autores = await em.find(
      Libro,
      {},
      { populate: ["misAutores", "miEditorial", "misEjemplares"] }
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
      { populate: ["misAutores", "miEditorial", "misEjemplares"] }
    );
    res.status(200).json({ message: "Libro encontrado", data: libro });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaLibro(req: Request, res: Response) {
  try {
    const { cantEjemplares, ...libroData } = req.body.inputOK;
    const libro = em.create(Libro, libroData);

    for (let i = 0; i < cantEjemplares; i++) {
      const idEjemplar = libro.getCodigoEjemplarActual();
      em.create(Ejemplar, {
        id: idEjemplar,
        miLibro: libro,
      });
    }

    await em.flush();

    const libroFiltrado = sanitizeLibro(libro);
    // Evita que devuelva toda la informacion del ejemplar en el response,osea, evita que devuelva el libro del ejemplar (Debido a que estan completamente cargados en memoria).

    res.status(201).json({ message: "Libro creado", data: libroFiltrado });
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
    res.status(200).json({ message: "Libro eliminado" });
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      res.status(409).json({
        message: "No se puede eliminar un libro que posea ejemplares",
      });
    } else res.status(500).json({ message: error.message });
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
