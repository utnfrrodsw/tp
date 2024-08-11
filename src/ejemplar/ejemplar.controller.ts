import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Ejemplar } from "./ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { NotFoundError } from "@mikro-orm/core";

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
    return res.status(200).json({
      message: "Ejemplares del libro encontrados: ",
      data: ejemplares,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
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
    return res.status(200).json({
      message: "Ejemplar encontrado",
      data: ejemplar,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
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
      fechaIncorporacion: req.body.fechaIncorporacion,
    });
    await em.flush();
    return res.status(201).json({ message: "Ejemplar creado", data: ejemplar });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function bajaEjemplar(req: Request, res: Response) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const idEjemplarRecibida = Number.parseInt(req.params.idEjemplar);
    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [idEjemplarRecibida, idLibro],
      { populate: ["misLp"] }
    );
    //Validacion puede moverse a beforeDelete. (En ese caso, dejar un getReference aca)
    if (ejemplar.fuistePrestado()) {
      return res.status(409).json({
        message:
          "No puede borrarse un ejemplar que haya sido prestado. (Testeo: Borrar el socio que lo haya pedido)",
      });
    }
    // Fin validacion

    await em.removeAndFlush(ejemplar);

    return res.status(200).send({ message: "Ejemplar borrado" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(200).send({ message: "Ejemplar borrado" });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function bajaEjemplares(req: Request, res: Response) {
  // Función optativa. Más que nada para un mal CREATE. (Por eso no está validada)
  try {
    const idLibro = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, idLibro);
    await em.nativeDelete(Ejemplar, { miLibro: libro });

    return res.status(200).send({ message: "Ejemplares borrados" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
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
