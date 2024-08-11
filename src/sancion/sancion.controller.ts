import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Sancion } from "./sancion.entity.js";
import { Socio } from "../socio/socio.entity.js";
import { NotFoundError } from "@mikro-orm/core";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    diasHasta: req.body.diasHasta,
    diasSancion: req.body.diasSancion,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarSanciones(req: Request, res: Response) {
  try {
    const sanciones = await em.find(Sancion, {});
    return res.status(200).json({
      message: "Las sanciones encontradas son: ",
      data: sanciones,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function buscarSancion(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const sancion = await em.findOneOrFail(Sancion, id);
    return res
      .status(200)
      .json({ message: "Sancion encontrada", data: sancion });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function buscarSancionesSocio(req: Request, res: Response) {
  try {
    //No se valida el socio apropósito
    const sanciones = await em.find(Sancion, {
      miSocioSancion: req.body.idSocio,
    });

    res.status(200).json({
      message: "Las sanciones del socio encontradas son: ",
      data: sanciones,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    return res.status(500).json({ message: error.message });
  }
}
async function bajaSancion(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const sancion = em.getReference(Sancion, id);
    await em.removeAndFlush(sancion);
    return res.status(200).json({ message: "Sancion eliminada" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeInput,
  buscarSancionesSocio,
  buscarSancion,
  buscarSanciones,
  bajaSancion,
};
