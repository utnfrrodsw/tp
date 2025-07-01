import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { CustomerRequestBody } from '../commonTypes';
import { Options } from '../../../types';
export declare type CustomerCreateData = {
    body: CustomerRequestBody;
    requestOptions?: Options;
};
export declare type CustomerCreateClient = {
    body: CustomerRequestBody;
    config: MercadoPagoConfig;
};
