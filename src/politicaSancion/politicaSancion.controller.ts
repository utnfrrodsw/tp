import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaSancion } from "./politicaSancion.entity.js";
import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function buscarPoliticasSancion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const politicas = await em.find(PoliticaSancion, {});
    return res.status(200).json({
      message: "Las politicas de sanción encontradas son: ",
      data: politicas,
    });
  } catch (error: any) {
    next(error);
  }
}

async function buscarPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = await em.findOneOrFail(PoliticaSancion, id);
    return res
      .status(200)
      .json({ message: "Politica encontrada", data: politica });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Politica de sanción no encontrada" });
    }
    next(error);
  }
}

async function altaPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const politica = em.create(PoliticaSancion, req.body);
    await em.flush();
    return res
      .status(201)
      .json({ message: "Politica de sanción creada", data: politica });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message:
          "Ya existe una politica de sanción con esa cantidad de dias hasta",
      });
    }
    next(error);
  }
}

async function actualizarPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    em.assign(politica, req.body);
    await em.flush();
    return res.status(200).json({ message: "Politica de sanción actualizada" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaPoliticaSancion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    await em.removeAndFlush(politica);
    return res.status(200).json({ message: "Libro eliminado" });
  } catch (error: any) {
    next(error);
  }
}

export {
  buscarPoliticasSancion,
  buscarPoliticaSancion,
  altaPoliticaSancion,
  actualizarPoliticaSancion,
  bajaPoliticaSancion,
};
