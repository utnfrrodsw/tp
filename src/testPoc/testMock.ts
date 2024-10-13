export class Pedido {
  idPedido: number;
  fechaCreacion: Date;
  estado: string;
  total: number;

  constructor(idPedido: number) {
    this.idPedido = idPedido;
    this.fechaCreacion = new Date();
    this.estado = "pendiente";
    this.total = 0;
  }

  fuisteCompletado() {
    return false;
  }
}

export function testPedido() {
  const pedidoTesteo = new Pedido(5);
  if (pedidoTesteo.fuisteCompletado()) {
    return { message: "El pedido fue completado (El mockeo funciono)" };
  }
  return { message: "El pedido no fue completado (El mockeo no funciono)" };
}
