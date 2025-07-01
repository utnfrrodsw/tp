import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { PreferenceRequest } from '../../../clients/preference/commonTypes';
import type { Options } from '../../../types';
export declare type PreferenceCreateClient = {
    body: PreferenceRequest;
    config: MercadoPagoConfig;
};
export declare type PreferenceCreateData = {
    body: PreferenceRequest;
    requestOptions?: Options;
};
