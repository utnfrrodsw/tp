import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Sancion } from "./sancion.entity.js";

import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function buscarSanciones(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sanciones = await em.find(Sancion, {});
    return res.status(200).json({
      message: "Las sanciones encontradas son: ",
      data: sanciones,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarSancion(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const sancion = await em.findOneOrFail(Sancion, id);
    return res
      .status(200)
      .json({ message: "Sancion encontrada", data: sancion });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Sanción no encontrada" });
    }
    next(error);
  }
}

async function buscarSancionesSocio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //No se valida el socio apropósito, podría revisarse más adelante para mantener consistencia.
    const sanciones = await em.find(Sancion, {
      miSocioSancion: req.body.idSocio,
    });
    return res.status(200).json({
      message: "Las sanciones del socio encontradas son: ",
      data: sanciones,
    });
  } catch (error: any) {
    next(error);
  }
}
async function bajaSancion(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const sancion = em.getReference(Sancion, id);
    await em.removeAndFlush(sancion);
    return res.status(200).json({ message: "Sancion eliminada" });
  } catch (error: any) {
    next(error);
  }
}

export { buscarSancionesSocio, buscarSancion, buscarSanciones, bajaSancion };
