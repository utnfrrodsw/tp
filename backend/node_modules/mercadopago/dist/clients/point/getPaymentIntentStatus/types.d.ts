import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PointGetPaymentIntentStatusClient = {
    payment_intent_id: string;
    config: MercadoPagoConfig;
};
export declare type PointGetPaymentIntentStatusData = {
    payment_intent_id: string;
    requestOptions?: Options;
};
