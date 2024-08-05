import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Ejemplar } from "./ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {};

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarEjemplares(req: Request, res: Response) {
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

async function buscarEjemplar(req: Request, res: Response) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, idLibro);
    const idEjemplarRecibida = Number.parseInt(req.params.idEjemplar);

    const ejemplar = await em.findOneOrFail(Ejemplar, {
      miLibro: libro,
      id: idEjemplarRecibida,
    });
    res.status(200).json({
      message: "Ejemplar encontrado",
      data: ejemplar,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaEjemplarManual(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(Libro, id);

    const idEjemplar = libro.getCodigoEjemplarActual();

    const ejemplar = em.create(Ejemplar, {
      id: idEjemplar,
      miLibro: libro,
    });
    await em.flush();
    res.status(201).json({ message: "Ejemplar creado", data: ejemplar });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// No tiene sentido un actualizarEjemplar, quizas la fecha pero no estoy seguro en el caso de un altaManual erronéa. Por revisar.

async function bajaEjemplar(req: Request, res: Response) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const idEjemplarRecibida = Number.parseInt(req.params.idEjemplar);
    const ejemplar = em.getReference(Ejemplar, [idEjemplarRecibida, idLibro]);
    await em.removeAndFlush(ejemplar);

    res.status(200).send({ message: "Ejemplar borrado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaEjemplares(req: Request, res: Response) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, idLibro);
    await em.nativeDelete(Ejemplar, { miLibro: libro });

    res.status(200).send({ message: "Ejemplares borrados" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  buscarEjemplares,
  altaEjemplarManual,
  sanitizeInput,
  buscarEjemplar,
  bajaEjemplar,
  bajaEjemplares,
};
