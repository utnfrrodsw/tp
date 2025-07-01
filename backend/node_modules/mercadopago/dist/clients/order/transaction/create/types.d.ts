import { MercadoPagoConfig } from '../../../../mercadoPagoConfig';
import type { Options } from '../../../../types';
import { PaymentRequest } from '../../commonTypes';
export declare type OrderCreateTransactionClient = {
    id: string;
    body: OrderCreateTransactionRequest;
    config: MercadoPagoConfig;
};
export declare type OrderCreateTransactionData = {
    id: string;
    body: OrderCreateTransactionRequest;
    requestOptions?: Options;
};
export declare type OrderCreateTransactionRequest = {
    payments?: PaymentRequest[];
};
