export interface CreatePaymentPreferenceDto {
  usuarioId: number;
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface CreatePlanProPreferenceDto {
  usuarioId: number;
  // Origen del sitio (por ejemplo http://localhost:5173) para armar las urls de vuelta
  origin: string;
}

export interface ConfirmarPlanProDto {
  usuarioId: number;
  paymentId: string;
}
