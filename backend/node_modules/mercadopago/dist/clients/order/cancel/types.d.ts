import { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type OrderCancelData = {
    id: string;
    requestOptions?: Options;
};
export declare type OrderCancelClient = {
    config: MercadoPagoConfig;
    id: string;
};
