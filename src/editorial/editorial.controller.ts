import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Editorial } from "./editorial.entity.js";
import { errorDominio } from "../shared/DB/errors.js";
import { NotFoundError } from "@mikro-orm/core";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    nombre: req.body.nombre,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarEditoriales(req: Request, res: Response) {
  try {
    const editoriales = await em.find(
      Editorial,
      {},
      { populate: ["misLibros"] }
    );
    return res
      .status(200)
      .json({ message: "Las editoriales encontradas son:", data: editoriales });
  } catch (error: any) {
    return res.status(500).json({ message: error.message }); // Mensaje dejado para el desarollo.
  }
}

async function buscarEditorial(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = await em.findOneOrFail(
      Editorial,
      { id },
      { populate: ["misLibros"] }
    );
    res.status(200).json({ message: "Editorial encontrada", data: editorial });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Editorial inexistente" });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function altaEditorial(req: Request, res: Response) {
  try {
    const editorial = em.create(Editorial, req.body.inputOK);
    await em.flush();
    return res
      .status(201)
      .json({ message: "Editorial creada", data: editorial });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function actualizarEditorial(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const editorial = em.getReference(Editorial, id);
    em.assign(editorial, req.body.inputOK);
    await em.flush();
    return res.status(200).json({ message: "Editorial actualizada" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

async function bajaEditorial(req: Request, res: Response) {
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
    return res.status(500).json({ message: error.message });
  }
}
export {
  sanitizeInput,
  buscarEditoriales,
  buscarEditorial,
  altaEditorial,
  actualizarEditorial,
  bajaEditorial,
};
