import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Ejemplar } from "./ejemplar.entity.js";
import { Libro } from "../libro/libro.entity.js";
import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function buscarEjemplares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, id);
    const ejemplares = await em.find(Ejemplar, { miLibro: libro });
    return res.status(200).json({
      message: "Ejemplares del libro encontrados: ",
      data: ejemplares,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarEjemplar(req: Request, res: Response, next: NextFunction) {
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
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Ejemplar o libro no encontrado." });
    }
    next(error);
  }
}

async function altaEjemplarManual(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "No existe el id del libro ingresado" });
    }
    next(error);
  }
}
async function actualizarEjemplar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idLibro = Number.parseInt(req.params.id);
    const idEjemplarRecibida = Number.parseInt(req.params.idEjemplar);
    const ejemplar = em.getReference(Ejemplar, [idEjemplarRecibida, idLibro]);

    em.assign(ejemplar, req.body);
    await em.flush();
    return res.status(200).json({ message: "Se ha actualizado el ejemplar" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaEjemplar(req: Request, res: Response, next: NextFunction) {
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
      return res.status(200).send({ message: "Ejemplar borrado" }); // 200 para mantener consistencia.
    }
    next(error);
  }
}

async function bajaEjemplares(req: Request, res: Response, next: NextFunction) {
  // Función optativa. Más que nada para un mal CREATE. (Por eso no está validada)
  try {
    const idLibro = Number.parseInt(req.params.id);
    const libro = em.getReference(Libro, idLibro);
    await em.nativeDelete(Ejemplar, { miLibro: libro });

    return res.status(200).send({ message: "Ejemplares borrados" });
  } catch (error: any) {
    next(error);
  }
}

export {
  buscarEjemplares,
  altaEjemplarManual,
  buscarEjemplar,
  bajaEjemplar,
  bajaEjemplares,
  actualizarEjemplar,
};
