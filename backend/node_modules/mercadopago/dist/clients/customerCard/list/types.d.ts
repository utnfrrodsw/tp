import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type CustomerCardListClient = {
    customerId: string;
    config: MercadoPagoConfig;
};
export declare type CustomerCardListData = {
    customerId: string;
    requestOptions?: Options;
};
