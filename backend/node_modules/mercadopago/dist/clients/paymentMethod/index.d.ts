import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PaymentMethodResponse } from './get/types';
import type { Options } from '../../types';
/**
 * Mercado Pago PaymentMethods.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class PaymentMethod {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/paymentmethod/get.ts Usage Example  }.
   */
    get(paymentMethodsGetOptions?: {
        requestOptions?: Options;
    }): Promise<PaymentMethodResponse[]>;
}
