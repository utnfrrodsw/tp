import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { Options } from '../../../types';
export declare type PreApprovalPlanGetClient = {
    id: string;
    config: MercadoPagoConfig;
};
export declare type PreApprovalPlanGetData = {
    preApprovalPlanId: string;
    requestOptions?: Options;
};
