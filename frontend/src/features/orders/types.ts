import type { BaseQuery } from '@/types/pagination';
import type { EnumOrderStatus, EnumEquipmentType } from '@/types/types';
import type { Equipment } from '@/features/equipments/types';
import type { Client } from '@/features/clients/types';
import type { Failure } from '@/features/failures/types';
import type { StatusHistory } from '@/features/status/types';
import type { Budget } from '@/features/budgets/types';

export interface Order {
  id_order: string;
  nroOrder: number;
  id_equipment: string;
  id_user?: string | null;
  status: EnumOrderStatus;
  observations?: string | null;
  equipmentPhotoUrl?: string | null;
  dateOfEntry: string;
  estimatedDate?: string | null;
  deliveryDate?: string | null;
  totalCharged?: number | string | null;
  equipment?: Equipment & { client?: Client | null };
  statusHistory?: StatusHistory[];
  failures?: Failure[];
  budget?: Budget | null;
}

export type OrderEquipmentInput =
  | { id_equipment: string }
  | {
      tipo_equipment: EnumEquipmentType;
      brand: string;
      model: string;
      observations?: string | null;
    };

export interface CreateOrderDto {
  id_client: string;
  equipment: OrderEquipmentInput;
  observations?: string | null;
  equipmentPhotoUrl?: string | null;
  estimatedDate?: string | null;
  id_user?: string | null;
  failures: { id_failure_type: string; description: string }[]; // mínimo 1
}

export interface CreateOrderResponse { message: string; order: Order }

// La forma exacta depende de OrderRepository.getStats (no la pasaste)
export type OrderStats = Record<string, number>;

export interface OrdersQuery extends BaseQuery {
  sortBy?: 'dateOfEntry' | 'estimatedDate' | 'deliveryDate' | 'totalCharged' | 'observations' | 'id_equipment';
}
