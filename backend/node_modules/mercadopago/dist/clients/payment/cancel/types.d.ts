import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import { Options } from '../../../types';
export declare type PaymentCancelData = {
    id: string | number;
    requestOptions?: Options;
};
export declare interface PaymentCancelClient extends PaymentCancelData {
    config: MercadoPagoConfig;
}
