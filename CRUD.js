// en el futuro serán interfaces/clases de typescript
//
const cliente = {
  idCliente: String, // UUID
  nombre: String,
  apellido: String,
  dni: String, // CP
  usuario: String, // CP
  email: String, // Validar formato
  contraseña: String, // Hash
  historialCompras: [
    {
      pedidoId: String, // Referencia a Pedido
      fecha: Date,
      monto: Number,
    },
  ],
  fondos: Number, // Saldo disponible
  puntos: Number, // Para descuentos
  direccion: String,
  teléfono: String,
};

const mueble = {
  idMueble: String, // ID único
  descripcion: String,
  tipoMaterial: String, // Relación con Material
  dimensiones: String, // "40x60x90 cm"
  categoria: String, // "Sillas", "Mesas"
  stock: Number, // Validar >= 0
  etiqueta: String, // "moderno", "rústico"
  precioUnitario: Number, // Validar > 0
};

const reseña = {
  muebleId: String, // Referencia
  clienteId: String, // Referencia
  rating: Number(1 - 5),
  comentario: String,
  fecha: Date,
};

// const pedido = {
//   estado: Enum[("pendiente", "pagado", "enviado", "entregado")],
//   total: Number,
//   descuentoMayorista: Boolean,
//   métodoPago: String,
//   direcciónEnvío: String,
// };

const lineaPedido = {
  pedidoId: String, // Relación
  muebleId: String, // Relación a Mueble
  cantidad: Number, // Validar <= stock
  subtotal: Number, // precioUnitario * cantidad
  estado: String, // "pendiente", "completado"
};

const descuento = {
  tipoDescuento: String, // "porcentaje" o "fijo"
  porcentajeDescuento: Number, // 10 = 10%
  puntosRequeridos: Number, // Puntos necesarios para canjear
  activo: Boolean,
};
