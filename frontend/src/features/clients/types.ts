import type { BaseQuery } from "@/types/pagination";
import type { Equipment } from "../equipments/types";
import type { Client_Type } from "@/types/types";

export interface Client {
  id_client: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  cuit: string;
  id_client_type: string;
  dateOfRegistration: Date; 
  status: boolean;
  client_type?: Client_Type;
  equipments?: Equipment[];
}



export interface CreateClientDto {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  cuit: string;
  id_client_type?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;

export interface ClientsQuery extends BaseQuery {
  id_client_type?: string;
  dateFrom?: string;
  dateTo?: string;
}