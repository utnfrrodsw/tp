import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PaymentGetData = {
    id: string | number;
    requestOptions?: Options;
};
export declare interface PaymentGetClient extends PaymentGetData {
    config: MercadoPagoConfig;
}
