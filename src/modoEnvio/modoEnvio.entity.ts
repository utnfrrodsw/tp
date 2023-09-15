import crypto from 'node:crypto'

export class modoEnvio {
    constructor(
      public nombre: string,
      public precio: number,
      public id = crypto.randomUUID()
    ) {}
  }
