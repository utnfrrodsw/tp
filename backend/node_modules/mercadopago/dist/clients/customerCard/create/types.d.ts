import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type CustomerCardCreateClient = {
    customerId?: string;
    body?: CustomerCardBody;
    config?: MercadoPagoConfig;
};
export declare type CustomerCardBody = {
    token?: string;
};
export declare type CustomerCardCreateData = {
    customerId: string;
    body: CustomerCardBody;
    requestOptions?: Options;
};
