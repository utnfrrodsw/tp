import crypto from 'node:crypto'


export class Localidad {
  constructor(
    public NombreLocalidad: string,
    public IdLocalidad = crypto.randomUUID()
  ) {}
}