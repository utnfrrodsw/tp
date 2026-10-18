import type { User } from '@/features/users/types';

// ==========================================
// ENUMS
// ==========================================


export const EnumRol = {
  admin: "admin",
  tecnico: "tecnico",
} as const;
export type EnumRol = (typeof EnumRol)[keyof typeof EnumRol];

export const EnumEquipmentType = {
  celular: "celular",
  computadora: "computadora",
  tablet: "tablet",
  consola: "consola",
  televisor: "televisor",
  notebook: "notebook",
  impresora: "impresora",
  otro: "otro",
} as const;
export type EnumEquipmentType = (typeof EnumEquipmentType)[keyof typeof EnumEquipmentType];

export const EnumOrderStatus = {
  recibido: "recibido",
  diagnostico: "diagnostico",
  presupuestado: "presupuestado",
  aprobado: "aprobado",
  reparacion: "reparacion",
  listo: "listo",
  entregado: "entregado",
  cancelado: "cancelado",
} as const;
export type EnumOrderStatus = (typeof EnumOrderStatus)[keyof typeof EnumOrderStatus];

export const EnumBudgetStatus = {
  pendiente: "pendiente",
  aprobado: "aprobado",
  rechazado: "rechazado",
} as const;
export type EnumBudgetStatus = (typeof EnumBudgetStatus)[keyof typeof EnumBudgetStatus];

export const EnumPaymentMethod = {
  DEBITO: "DEBITO",
  MP: "MP",
  EFECTIVO: "EFECTIVO",
  CREDITO: "CREDITO",
} as const;
export type EnumPaymentMethod = (typeof EnumPaymentMethod)[keyof typeof EnumPaymentMethod];

export const EnumPaymentType = {
  Descuento: "Descuento",
  Recargo: "Recargo",
} as const;
export type EnumPaymentType = (typeof EnumPaymentType)[keyof typeof EnumPaymentType];

export const EnumFailureStatus = {
  resuelta: "resuelta",
  diagnosticada: "diagnosticada",
} as const;
export type EnumFailureStatus = (typeof EnumFailureStatus)[keyof typeof EnumFailureStatus];

export const EnumTypeAddedCost = {
  Repuesto: 'repuesto',
  ProcedimientoEspecial :'procedimientoEspecial',
  Garantia:'garantia',
  ReparacionExpress:'reparacionExpress',
  LimpiezaPuestaAPunto: 'limpiezaPuestaAPunto',
  ServiciosSoftware: 'serviciosSoftware',
} as const
export type EnumTypeAddedCost = (typeof EnumTypeAddedCost)[keyof typeof EnumTypeAddedCost]


// ==========================================
// MODELS (DOMINIO/ENTIDADES)
// ==========================================



export interface Client_Type {
  id_client_type: string;
  clientTypeName: string;
  amountForCategoryUp: number;
  clients?: Client[];
}

export interface Client {
  id_client: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  cuit: string;
  dateOfRegistration: Date;
  status: boolean;
  id_client_type: string;
  client_type?: Client_Type;
  equipments?: Equipment[];
}

export interface Failure_Type {
  id_failure_type: string;
  failureDescription: string;
  estimatedImport: number;
  failures?: Failure[];
}

export interface Failure {
  id_failure: string;
  id_failure_type: string;
  failureType?: Failure_Type;
  id_order: string;
  order?: Order;
  description: string;
  dateOfFailure: Date;
  status: EnumFailureStatus;
}

export interface Equipment {
  id_equipment: string;
  tipo_equipment: EnumEquipmentType;
  brand: string;
  model: string;
  observations?: string | null;
  id_client: string;
  client?: Client;
  failures?: Failure[];
  orders?: Order[];
}

export interface Order {
  id_order: string;
  nroOrder: number;
  id_equipment: string;
  equipment?: Equipment;
  id_user?: string | null;
  user?: User | null;
  status: EnumOrderStatus;
  observations?: string | null;
  equipmentPhotoUrl?: string | null;
  dateOfEntry: Date;
  estimatedDate?: Date | null | string;
  deliveryDate?: Date | null | string;
  totalCharged?: number | null;
  statusHistory?: Status_History[];
  failures?: Failure[];
  budget?: Budget | null;
}

export interface Status_History {
  id_status_history: string;
  id_order: string;
  order?: Order;
  status: EnumOrderStatus;
  id_user: string;
  user?: User;
  dateOfChange: Date;
  comment?: string | null;
}

export interface Budget {
  id_budget: string;
  nroBudget: number;
  id_order: string;
  order?: Order;
  laborCost: number;
  discount: number;
  status: EnumBudgetStatus;
  budgetDate: Date;
  payments?: Payment[];
  addedCosts: AddedCost[];
  clientSuggestion?: string | null;
}

export interface Payment_Type {
  id_payment_type: string;
  paymentTypeName: string;
  paymentMethod: EnumPaymentMethod;
  type_of_payment: EnumPaymentType;
  percentage: number;
  payments?: Payment[];
}

export interface Payment {
  id_payment: string;
  id_payment_type: string;
  paymentType?: Payment_Type;
  id_budget: string;
  budget?: Budget;
  dateOfPayment: Date;
  amount: number;
}

export interface AddedCost{
  id_addedCost: string;
  id_budget: string;
  budget: Budget;
  type_addedCost: EnumTypeAddedCost;
  addedCostDescription: string;
  addedCostAmount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}