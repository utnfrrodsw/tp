import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PointGetPaymentIntentListClient = {
    options?: GetPaymentIntentList;
    config: MercadoPagoConfig;
};
export declare type GetPaymentIntentListRequest = {
    options?: GetPaymentIntentList;
};
export declare type GetPaymentIntentList = {
    startDate: string;
    endDate: string;
};
export declare type PointGetPaymentIntentListData = {
    body?: GetPaymentIntentListRequest;
    requestOptions?: Options;
};
