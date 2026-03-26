import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import { Options } from '../../../types';
export declare type MerchantOrderGetClient = {
    merchantOrderId: string | number;
    config: MercadoPagoConfig;
};
export declare type MerchantOrderGetData = {
    merchantOrderId: string | number;
    requestOptions?: Options;
};
