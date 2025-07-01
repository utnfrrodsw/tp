import type { Options } from '../../../types';
import type { MercadoPagoConfig } from '../../../mercadoPagoConfig';
import type { PreApprovalRequest } from '../../../clients/preApproval/commonTypes';
export declare type PreApprovalCreateData = {
    body: PreApprovalRequest;
    requestOptions?: Options;
};
export declare type PreApprovalCreateClient = {
    body: PreApprovalRequest;
    config: MercadoPagoConfig;
};
