import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { CustomerRequestBody } from '../commonTypes';
import type { Options } from '../../../types';
export declare type CustomerUpdateData = {
    customerId: string;
    body: CustomerRequestBody;
    requestOptions?: Options;
};
export declare type CustomerUpdateClient = {
    customerId: string;
    body: CustomerRequestBody;
    config: MercadoPagoConfig;
};
