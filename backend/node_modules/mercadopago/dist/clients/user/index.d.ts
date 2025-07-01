import type { UserGetData, UserResponse } from './get/types';
import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
/**
 * Mercado Pago User.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class User {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago User.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/user/get/get.ts Usage Example  }.
   */
    get(userGetData?: UserGetData): Promise<UserResponse>;
}
