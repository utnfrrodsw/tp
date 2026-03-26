import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PaymentRefundListData = {
    payment_id: string | number;
    requestOptions?: Options;
};
export declare type PaymentRefundListClient = {
    payment_id: string | number;
    config: MercadoPagoConfig;
};
