import type { CardTokenCreateData } from './create/types';
import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { CardTokenResponse } from './commonTypes';
/**
 * Mercado Pago CardTokens.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class CardToken {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/cardtoken/create.ts Usage Example  }.
   */
    create({ body, requestOptions }: CardTokenCreateData): Promise<CardTokenResponse>;
}
