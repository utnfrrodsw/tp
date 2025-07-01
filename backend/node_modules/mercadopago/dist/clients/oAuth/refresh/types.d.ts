import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import { Options } from '../../../types';
export declare type OAuthRefreshClient = {
    body: OAuthRefresh;
    config: MercadoPagoConfig;
};
export declare type OAuthRefresh = {
    client_secret?: string;
    client_id?: string;
    refresh_token?: string;
};
export declare type OAuthRefreshData = {
    body: OAuthRefresh;
    requestOptions?: Options;
};
