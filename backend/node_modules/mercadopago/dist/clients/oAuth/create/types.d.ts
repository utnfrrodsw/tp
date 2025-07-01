import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type OAuthCreateClient = {
    body: OAuthRequest;
    config: MercadoPagoConfig;
};
export declare type OAuthRequest = {
    client_secret?: string;
    client_id?: string;
    code?: string;
    redirect_uri?: string;
};
export declare type OAuthCreateData = {
    body: OAuthRequest;
    requestOptions?: Options;
};
