import type { CustomerCardCardholder } from '../../../clients/commonTypes';
import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type CustomerCardUpdateClient = {
    customerId: string;
    cardId: string;
    body: CustomerCardUpdateBody;
    config: MercadoPagoConfig;
};
export declare type CustomerCardUpdateBody = {
    expiration_month?: number;
    expiration_year?: number;
    cardholder?: CustomerCardCardholder;
    token?: string;
};
export declare type CustomerCardUpdateData = {
    customerId: string;
    cardId: string;
    body: CustomerCardUpdateBody;
    requestOptions?: Options;
};
