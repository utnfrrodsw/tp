import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PaymentRefundCreateData } from './create/types';
import type { PaymentRefundGetData } from './get/types';
import type { PaymentRefundListData } from './list/types';
import type { RefundResponse } from './commonTypes';
import type { PaymentRefundTotalData } from './total/types';
/**
 * Mercado Pago Refund.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class PaymentRefund {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Get Refund.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/paymentRefund/get.ts Usage Example  }.
   */
    get({ payment_id, refund_id, requestOptions }: PaymentRefundGetData): Promise<RefundResponse>;
    /**
   * Mercado Pago Create Refund.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/paymentRefund/create.ts Usage Example  }.
   */
    create({ payment_id, body, requestOptions }: PaymentRefundCreateData): Promise<RefundResponse>;
    /**
   * Mercado Pago Create Refund.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/paymentRefund/create.ts Usage Example  }.
   */
    total({ payment_id, requestOptions }: PaymentRefundTotalData): Promise<RefundResponse>;
    /**
   * Mercado Pago Get Refund List.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/paymentRefund/list.ts Usage Example  }.
   */
    list({ payment_id, requestOptions }: PaymentRefundListData): Promise<Array<RefundResponse>>;
}
