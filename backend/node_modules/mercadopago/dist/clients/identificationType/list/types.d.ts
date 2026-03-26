import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { ApiResponse, Options } from '../../../types';
export declare type IdentificationTypeListData = {
    requestOptions?: Options;
};
export declare type IdentificationTypeGet = {
    config: MercadoPagoConfig;
};
export declare interface IdentificationTypeResponse extends ApiResponse {
    id?: string;
    name?: string;
    type?: string;
    min_length?: number;
    max_length?: number;
}
