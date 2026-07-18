export type EnumRol = 'admin' | 'tecnico';

export type EnumEquipmentType = 'celular' | 'computadora' | 'tablet' | 'consola' | 'otro';

export type EnumOrderStatus =
  | 'recibido'
  | 'diagnostico'
  | 'presupuestado'
  | 'aprobado'
  | 'reparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado';

export type EnumBudgetStatus = 'pendiente' | 'aprobado' | 'rechazado';

export type EnumPaymentMethod = 'DEBITO' | 'MP' | 'EFECTIVO' | 'CREDITO';

export type EnumFailureStatus = 'resuelta' | 'diagnosticada';

export interface UserProfile {
  id_user:       number;
  userName:      string;
  email:         string;
  password_hash: string;
  rol:           EnumRol;
  status:        boolean;
  urlPicture:    string;
}

export interface Category_Client {
  id_category_client:  number;
  categoryClientName:  string;
  amountForCategoryUp: string;
}

export interface Client {
  id_client:          number;
  clientName:         string;
  clientEmail:        string;
  clientPhone:        string;
  dniCuit:            string;
  dateOfRegistration: string;   // ISO string en el front
  status:             boolean;
  id_category_client: number;
  category_client?:   Category_Client;
  equipments?:        Equipment[];
}

export interface Failure_Type {
  id_failure_type:    number;
  failureDescription: string;
  estimatedImport:    number;
}

export interface Failure {
  id_failure:      number;
  id_failure_type: number;
  id_equipment:    number;
  description:     string;
  dateOfFailure:   string;
  status:          EnumFailureStatus;
  failureType?:    Failure_Type;
}

export interface Equipment {
  id_equipment:   number;
  equipmentName:  string;
  tipo_equipment: EnumEquipmentType;
  observations:   string;
  id_client:      number;
  client?:        Client;
  failures?:      Failure[];
  orders?:        Order[];
}

export interface Order {
  id_order:            number;
  id_equipment:        number;
  id_user:             number | null;
  status:              EnumOrderStatus;
  failureReported:     string;
  technicianDiagnosis: string | null;
  dateOfEntry:         string;
  estimatedDate:       string | null;
  deliveryDate:        string | null;
  totalCharged:        number | null;
  equipment?:          Equipment;
  user?:               UserProfile;
  statusHistory?:      Status_History[];
  budget?:             Budget;
}

export interface Status_History {
  id_status_history: number;
  id_order:          number;
  previousStatus:    string;
  newStatus:         string;
  id_user:           number;
  dateOfChange:      string;
  comment:           string | null;
  user?:             UserProfile;
}

export interface Budget {
  id_budget:      number;
  id_order:       number;
  laborCost:      number;
  discount:       number;
  estimatedTotal: number;
  status:         EnumBudgetStatus;
  payments?:      Payment[];
}

export interface Payment_Type {
  id_payment_type: number;
  discountRate:    number;
  surchargeRate:   number;
  paymentMethod:   EnumPaymentMethod;
}

export interface Payment {
  id_payment:      number;
  id_payment_type: number;
  id_budget:       number;
  dateOfPayment:   string;
  amount:          number;
  paymentType?:    Payment_Type;
}