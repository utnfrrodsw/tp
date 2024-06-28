import crypto from 'node:crypto';

export class Socio {
  static id: string;
  constructor(
    public nombre: string,
    public apellido: string,
    public edad: number,
    public cuota: number,
    public id = crypto.randomUUID()
  ) {}
}