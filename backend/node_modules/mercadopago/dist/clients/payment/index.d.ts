import type { PaymentResponse } from './commonTypes';
import type { PaymentSearchData, PaymentSearch } from './search/types';
import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PaymentCreateData } from './create/types';
import type { PaymentCaptureData } from './capture/types';
import type { PaymentCancelData } from './cancel/types';
import type { PaymentGetData } from './get/types';
/**
 * Mercado Pago Payment.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class Payment {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/search.ts Usage Example  }.
   */
    search(paymentSearchOptions?: PaymentSearchData): Promise<PaymentSearch>;
    /**
   * Mercado Pago Cancel.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/cancel.ts Usage Example  }.
   */
    cancel({ id, requestOptions }: PaymentCancelData): Promise<PaymentResponse>;
    /**
   * Mercado Pago Capture.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/capture.ts Usage Example  }.
   */
    capture({ id, transaction_amount, requestOptions }: PaymentCaptureData): Promise<PaymentResponse>;
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/create.ts Usage Example  }.
   */
    create({ body, requestOptions }: PaymentCreateData): Promise<PaymentResponse>;
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/get.ts Usage Example  }.
   */
    get({ id, requestOptions }: PaymentGetData): Promise<PaymentResponse>;
}
