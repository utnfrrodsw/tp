import type { BaseQuery } from '@/types/pagination';
import type { EnumOrderStatus } from '@/types/types';

export interface StatusHistory {
  id_status_history: string;
  id_order: string;
  id_user: string;
  status: EnumOrderStatus;
  dateOfChange: string;
  comment?: string | null;
  user?: { userName: string; urlPicture?: string };
}

export interface RegisterStatusDto {
  id_order: string;
  id_user: string; // el schema lo exige, aunque el controller usa el del token
  status: EnumOrderStatus;
  comment?: string;
  notifyClient?: boolean;
}

export interface StatusQuery extends BaseQuery {
  sortBy?: 'dateOfChange' | 'status';
}
