import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { PreApprovalPlanRequest } from '../../../clients/preApprovalPlan/commonTypes';
import type { Options } from '../../../types';
export declare type PreApprovalPlanCreateClient = {
    body: PreApprovalPlanRequest;
    config: MercadoPagoConfig;
};
export declare type PreApprovalPlanCreateData = {
    body: PreApprovalPlanRequest;
    requestOptions?: Options;
};
