import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PaymentRefundCreateData = {
    payment_id: string | number;
    body?: CreateRefundBody;
    requestOptions?: Options;
};
export declare type CreateRefundBody = {
    amount?: number;
};
export declare type PaymentRefundCreateClient = {
    payment_id: string | number;
    body?: CreateRefundBody;
    config: MercadoPagoConfig;
};
