import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PointSearchPaymentIntentClient = {
    payment_intent_id: string;
    config: MercadoPagoConfig;
};
export declare type PointSearchPaymentIntentData = {
    payment_intent_id: string;
    requestOptions?: Options;
};
