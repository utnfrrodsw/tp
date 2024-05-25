export class NotFound extends Error {
  constructor(id: string) {
    super(`El recurso con id: '${id}' no fue encontrado.`);
  }
}

export class Repeated extends Error {
  constructor(recurso: string, valor: string) {
    super(
      `El ${recurso}: '${valor}' ya se encuentra ingresado en la base de datos.`
    );
  }
}
