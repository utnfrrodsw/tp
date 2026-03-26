import { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { OAuthCreateData } from './create/types';
import type { OAuthGetAuthorizationURLData } from './getAuthorizationURL/types';
import type { OAuthRefreshData } from './refresh/types';
import type { OAuthResponse } from './commonTypes';
/**
 * Mercado Pago OAuth.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/oauth/_oauth_token/post Documentation }.
 */
export declare class OAuth {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
     * Mercado Pago OAuth Create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/create.ts Usage Example  }.
     */
    create({ body, requestOptions }: OAuthCreateData): Promise<OAuthResponse>;
    /**
     * Mercado Pago OAuth Refresh.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/refresh.ts Usage Example  }.
     */
    refresh({ body, requestOptions }: OAuthRefreshData): Promise<OAuthResponse>;
    /**
     * Mercado Pago OAuth getAuthorizationURL.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/getAuthorizationURL.ts Usage Example  }.
     */
    getAuthorizationURL({ options }: OAuthGetAuthorizationURLData): string;
}
