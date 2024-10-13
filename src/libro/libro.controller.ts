import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Libro } from "./libro.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { NotFoundError } from "@mikro-orm/core";

export function sanitizeResponseLibro(libro: Libro) {
  //Sacar el export luego, es para testeo.
  return {
    id: libro.id,
    titulo: libro.titulo,
    descripcion: libro.descripcion,
    isbn: libro.isbn,
    misAutores: libro.misAutores.map((autor) => autor.id),
    miEditorial: libro.miEditorial.id,
    misEjemplares: libro.misEjemplares.map((ejemplar) => ({
      idEjemplar: ejemplar.id,
    })),
  };
}

const em = orm.em;

async function buscaLibros(req: Request, res: Response, next: NextFunction) {
  try {
    const autores = await em.find(
      Libro,
      {},
      { populate: ["misAutores", "miEditorial", "misEjemplares"] }
    );
    return res
      .status(200)
      .json({ message: "Libros encontrados: ", data: autores });
  } catch (error: any) {
    next(error);
  }
}

async function buscaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(
      Libro,
      { id },
      { populate: ["misAutores", "miEditorial", "misEjemplares"] }
    );
    return res.status(200).json({ message: "Libro encontrado", data: libro });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Libro inexistente" });
    }
    next(error);
  }
}

async function altaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const { cantEjemplares, ...libroData } = req.body;
    const libro = em.create(Libro, libroData);

    for (let i = 0; i < cantEjemplares; i++) {
      const idEjemplar = libro.getCodigoEjemplarActual();
      em.create(Ejemplar, {
        id: idEjemplar,
        miLibro: libro,
      });
    }

    await em.flush();

    const libroFiltrado = sanitizeResponseLibro(libro);
    // Evita que devuelva toda la informacion del ejemplar en el response,osea, evita que devuelva el libro del ejemplar (Debido a que estan completamente cargados en memoria).

    return res
      .status(201)
      .json({ message: "Libro creado", data: libroFiltrado });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      if (error.message.includes("libro_mis_autores_autor_id_foreign")) {
        return res
          .status(400)
          .json({ message: "Se ingreso el id de algún autor que no existe" });
      }
      if (error.message.includes("libro_mi_editorial_id_foreign")) {
        return res
          .status(400)
          .json({ message: "El id de editorial ingresado no existe" });
      }
    }

    next(error);
  }
}

async function actualizarLibro(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);
    const libroActualizar = em.getReference(Libro, id);
    em.assign(libroActualizar, req.body);
    await em.flush();
    return res.status(200).json({ message: "Libro actualizado" });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      if (error.message.includes("libro_mis_autores_autor_id_foreign")) {
        return res
          .status(400)
          .json({ message: "Se ingreso el id de algún autor que no existe" });
      }
      if (error.message.includes("libro_mi_editorial_id_foreign")) {
        return res
          .status(400)
          .json({ message: "El id de editorial ingresado no existe" });
      }
    }
    next(error);
  }
}

async function bajaLibro(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id);
    const libro = await em.findOneOrFail(Libro, id, {
      populate: ["misEjemplares.misLp"],
    });

    //Validacion puede moverse a beforeDelete. (En ese caso, dejar un getReference aca). 12/8/2024 validacion innecesaria, previsto ser borrada o implementada en otro CU de borrado fisico.
    if (libro.fuistePrestado()) {
      return res.status(409).json({
        message:
          "No puede borrarse un libro que haya sido prestado. (Testeo: Borrar el socio que lo haya pedido)",
      });
    }

    // Fin validacion
    await em.removeAndFlush(libro);
    return res.status(200).json({ message: "Libro eliminado" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(200).json({ message: "Libro eliminado" }); // Para mantener la consistencia.
    }
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "No se puede eliminar un libro que posea ejemplares",
      });
    }
    next(error);
  }
}

export { buscaLibros, buscaLibro, altaLibro, actualizarLibro, bajaLibro };
