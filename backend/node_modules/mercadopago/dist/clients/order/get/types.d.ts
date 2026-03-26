import { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type OrderGetData = {
    id: string;
    requestOptions?: Options;
};
export declare type OrderGetClient = {
    config: MercadoPagoConfig;
    id: string;
};
