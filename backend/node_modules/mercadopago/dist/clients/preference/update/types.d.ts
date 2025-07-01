import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { PreferenceRequest } from '../../../clients/preference/commonTypes';
import type { Options } from '../../../types';
export declare type PreferenceId = {
    preferenceId: string;
};
export declare type PreferenceUpdateClient = {
    id: string;
    updatePreferenceRequest: PreferenceRequest;
    config: MercadoPagoConfig;
};
export declare type PreferenceUpdateData = {
    id: string;
    updatePreferenceRequest: PreferenceRequest;
    requestOptions?: Options;
};
