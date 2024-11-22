import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaBiblioteca } from "./politicaBiblioteca.entity.js";
import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function buscarPoliticaBiblioteca(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const politica = await em.findOneOrFail(PoliticaBiblioteca, {
      id: 1,
    });
    return res.status(200).json({
      message: "La politica de biblioteca actual es: ",
      data: politica,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res
        .status(500)
        .json({ message: "Politica de biblioteca inaccesible" });
    }
    next(error);
  }
}

async function altaPoliticaBiblioteca(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Funcion para desarrollo, migrar en producción.
  try {
    const politica = em.create(PoliticaBiblioteca, req.body);

    await em.flush();
    return res
      .status(201)
      .json({ message: "Politica de biblioteca creada", data: politica });
  } catch (error: any) {
    next(error);
  }
}

async function actualizarPoliticaBiblioteca(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const politica = em.getReference(PoliticaBiblioteca, 1);
    em.assign(politica, req.body);
    await em.flush();
    return res
      .status(200)
      .json({ message: "Politica de biblioteca actualizada" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaPoliticaBiblioteca(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Funcion para desarollo.
  return res.status(500).json({ message: "Not implemented" });
}
export {
  buscarPoliticaBiblioteca,
  altaPoliticaBiblioteca,
  actualizarPoliticaBiblioteca,
  bajaPoliticaBiblioteca,
};
