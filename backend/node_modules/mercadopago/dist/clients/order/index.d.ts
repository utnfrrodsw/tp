import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import { OrderResponse, PaymentApiResponse, TransactionsApiResponse } from './commonTypes';
import { OrderCreateData } from './create/types';
import { OrderGetData } from './get/types';
import { OrderProcessData } from './process/types';
import { OrderCaptureData } from './capture/types';
import { OrderCancelData } from './cancel/types';
import { OrderRefundData } from './refund/types';
import { OrderCreateTransactionData } from './transaction/create/types';
import { OrderUpdateTransactionData } from './transaction/update/types';
import { OrderDeleteTransactionData } from './transaction/delete/types';
import { ApiResponse } from '../../types';
/**
 * Mercado Pago Order.
 *
 * @see {@link https://mercadopago.com/developers/en/docs/order/landing Documentation }.
 */
export declare class Order {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
     * Create Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/create.ts Usage Example }.
     */
    create({ body, requestOptions }: OrderCreateData): Promise<OrderResponse>;
    /**
     * Get Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/get.ts Usage Example }.
     */
    get({ id, requestOptions }: OrderGetData): Promise<OrderResponse>;
    /**
     * Process Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/process.ts Usage Example }.
     */
    process({ id, requestOptions }: OrderProcessData): Promise<OrderResponse>;
    /**
     * Capture Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/capture.ts Usage Example }.
     */
    capture({ id, requestOptions }: OrderCaptureData): Promise<OrderResponse>;
    /**
     * Cancel Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/cancel.ts Usage Example }.
     */
    cancel({ id, requestOptions }: OrderCancelData): Promise<OrderResponse>;
    /**
     * Refund Order (total or partial).
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/refundTotal.ts Usage Example }.
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/refundPartial.ts Usage Example }.
     */
    refund({ id, body, requestOptions }: OrderRefundData): Promise<OrderResponse>;
    /**
     * Create Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/create.ts Usage Example }.
     */
    createTransaction({ id, body, requestOptions }: OrderCreateTransactionData): Promise<TransactionsApiResponse>;
    /**
     * Update Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/update.ts Usage Example }.
     */
    updateTransaction({ id, transactionId, body, requestOptions }: OrderUpdateTransactionData): Promise<PaymentApiResponse>;
    /**
     * Delete Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/delete.ts Usage Example }.
     */
    deleteTransaction({ id, transactionId, requestOptions }: OrderDeleteTransactionData): Promise<ApiResponse>;
}
