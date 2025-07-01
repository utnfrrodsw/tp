import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Paging } from '../../../clients/commonTypes';
import type { InvoiceResponse } from '../../../clients/invoice/commonTypes';
import type { Options, SearchOptions } from '../../../types';
export declare type InvoiceSearchData = {
    options?: InvoiceSearchOptions;
    requestOptions?: Options;
};
export declare type InvoiceSearchClient = {
    options?: InvoiceSearchOptions;
    config: MercadoPagoConfig;
};
export declare interface InvoiceSearchOptions extends SearchOptions {
    id?: number;
    preapproval_id?: string;
    payment_id?: number;
    payer_id?: number;
    offset?: number;
    limit?: number;
}
export declare type InvoiceSearchResponse = {
    paging?: Paging;
    results?: Array<InvoiceResponse>;
};
