import { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type OrderCaptureData = {
    id: string;
    requestOptions?: Options;
};
export declare type OrderCaptureClient = {
    config: MercadoPagoConfig;
    id: string;
};
