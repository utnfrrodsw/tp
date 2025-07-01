import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PreferenceGetClient = {
    id: string;
    config: MercadoPagoConfig;
};
export declare type PreferenceGetData = {
    preferenceId: string;
    requestOptions?: Options;
};
