import { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type OrderProcessData = {
    id: string;
    requestOptions?: Options;
};
export declare type OrderProcessClient = {
    config: MercadoPagoConfig;
    id: string;
};
