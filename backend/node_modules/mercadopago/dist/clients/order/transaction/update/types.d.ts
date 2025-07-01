import { MercadoPagoConfig } from '../../../../mercadoPagoConfig';
import { PaymentRequest } from '../../commonTypes';
import { Options } from '../../../../types';
export declare type OrderUpdateTransactionClient = {
    id: string;
    transactionId: string;
    body: PaymentRequest;
    config: MercadoPagoConfig;
};
export declare type OrderUpdateTransactionData = {
    id: string;
    transactionId: string;
    body: PaymentRequest;
    requestOptions?: Options;
};
