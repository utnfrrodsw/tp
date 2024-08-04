import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Ejemplar } from "./ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    idEjemplar: req.body.idEjemplar,
    miLibro: req.params.id,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscaEjemplares(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, id);

    const ejemplares = await em.find(Ejemplar, { miLibro: libro });
    res.status(200).json({
      message: "Ejemplares del libro encontrados: ",
      data: ejemplares,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function buscaEjemplar(req: Request, res: Response) {
  res.status(500).json({ message: "Not implemented" });
}

async function altaEjemplar(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, id);
    const ejemplar = em.create(Ejemplar, req.body.inputOK);
    await em.flush();
    res.status(201).json({ message: "Ejemplar creado", data: ejemplar });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function actualizarLibro(req: Request, res: Response) {
  res.status(500).json({ message: "Not implemented" });
}

async function bajaLibro(req: Request, res: Response) {
  res.status(500).json({ message: "Not implemented" });
}

export { buscaEjemplares, altaEjemplar, sanitizeInput };
