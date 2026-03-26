import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { PaymentIntentRequest } from '../commonTypes';
import type { Options } from '../../../types';
export declare type PointCreatePaymentIntentClient = {
    device_id: string;
    request: PaymentIntentRequest;
    config: MercadoPagoConfig;
};
export declare type PointCreatePaymentIntentData = {
    device_id: string;
    request: PaymentIntentRequest;
    requestOptions?: Options;
};
