import crypto from "node:crypto";

export class Autor {
  constructor(
    public nombre: string,
    public apellido: string,
    public idAutor = crypto.randomUUID()
  ) {}
}
