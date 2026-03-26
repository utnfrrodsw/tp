import { Paging } from '../../../clients/commonTypes';
import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { SearchOptions } from '../../../types';
import type { CustomerResponse } from '../commonTypes';
import type { Options } from '../../../types';
export declare type CustomerSearchClient = {
    options?: CustomerSearchOptions;
    config: MercadoPagoConfig;
};
export declare interface CustomerSearchOptions extends SearchOptions {
    email?: string;
}
export declare type CustomerSearchData = {
    options?: CustomerSearchOptions;
    requestOptions?: Options;
};
export declare type CustomerSearchResultsPage = {
    results?: CustomerResponse[];
    paging?: Paging;
};
