import { z } from "zod";
import validator from "validator";
const { isISBN } = validator;

const libroAltaSchema = z
  .object({
    titulo: z.string().max(100),
    descripcion: z.string().max(500),
    isbn: z.string().refine((isbn) => isISBN(isbn)), // ISBN 10 y 13.
    misAutores: z.array(z.number().int().gt(0)),
    miEditorial: z.number().int().gt(0),
    cantEjemplares: z.number().int().gt(-1).optional(),
  })
  .strict();

const libroPutSchema = z
  .object({
    titulo: z.string(),
    descripcion: z.string(),
    isbn: z.string().refine((isbn) => isISBN(isbn)),
    misAutores: z.array(z.number().int().gt(0)),
    miEditorial: z.number().int().gt(0),
  })
  .strict();

const libroPatchSchema = z
  .object({
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    isbn: z
      .string()
      .refine((isbn) => isISBN(isbn))
      .optional(), // ISBN 10 y 13.
    misAutores: z.array(z.number().int().gt(0)).optional(),
    miEditorial: z.number().int().gt(0).optional(),
  })
  .strict();

export { libroAltaSchema, libroPatchSchema, libroPutSchema };
