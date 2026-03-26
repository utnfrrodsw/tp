import { MercadoPagoConfig } from '../../../../mercadoPagoConfig';
import type { Options } from '../../../../types';
export declare type OrderDeleteTransactionClient = {
    id: string;
    transactionId: string;
    config: MercadoPagoConfig;
};
export declare type OrderDeleteTransactionData = {
    id: string;
    transactionId: string;
    requestOptions?: Options;
};
