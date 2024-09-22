import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Editorial } from "./editorial.entity.js";

import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function buscarEditoriales(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const editoriales = await em.find(Editorial, {});
    return res
      .status(200)
      .json({ message: "Las editoriales encontradas son:", data: editoriales });
  } catch (error: any) {
    next(error);
  }
}

async function buscarEditorial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = await em.findOneOrFail(
      Editorial,
      { id },
      { populate: ["misLibros"] }
    );
    return res
      .status(200)
      .json({ message: "Editorial encontrada", data: editorial });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Editorial inexistente" });
    }
    next(error);
  }
}

async function altaEditorial(req: Request, res: Response, next: NextFunction) {
  try {
    const editorial = em.create(Editorial, req.body);
    await em.flush();
    return res
      .status(201)
      .json({ message: "Editorial creada", data: editorial });
  } catch (error: any) {
    next(error);
  }
}

async function actualizarEditorial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = em.getReference(Editorial, id);
    em.assign(editorial, req.body);
    await em.flush();
    return res.status(200).json({ message: "Editorial actualizada" });
  } catch (error: any) {
    next(error);
  }
}

async function bajaEditorial(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = em.getReference(Editorial, id);
    await em.removeAndFlush(editorial);
    return res.status(200).send({ message: "Editorial borrada" });
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "No se puede eliminar una editorial que posea libros",
      });
    }
    next(error);
  }
}
export {
  buscarEditoriales,
  buscarEditorial,
  altaEditorial,
  actualizarEditorial,
  bajaEditorial,
};
