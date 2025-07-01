import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options, SearchOptions } from '../../../types';
export declare type PointGetDevicesClient = {
    options?: GetDevicesSearch;
    config: MercadoPagoConfig;
};
export declare type GetDevicesRequest = {
    options?: GetDevicesSearch;
};
export declare interface GetDevicesSearch extends SearchOptions {
    store_id: string;
    pos_id: string;
}
export declare type PointGetDevicesData = {
    request: GetDevicesRequest;
    requestOptions?: Options;
};
