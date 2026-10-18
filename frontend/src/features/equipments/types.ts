import type { BaseQuery } from '@/types/pagination';
import type { EnumEquipmentType } from '@/types/types';

export interface Equipment {
  id_equipment: string;
  tipo_equipment: EnumEquipmentType;
  brand: string;
  model: string;
  observations?: string | null;
  id_client: string;
}

export interface CreateEquipmentDto {
  tipo_equipment: EnumEquipmentType;
  brand: string;
  model: string;
  observations?: string | null;
  id_client: string;
}
export type UpdateEquipmentDto = Partial<CreateEquipmentDto>;

export interface EquipmentsQuery extends BaseQuery {
  sortBy?: 'tipo_equipment' | 'brand' | 'model' | 'id_client' | 'id_equipment' | 'observations';
}
