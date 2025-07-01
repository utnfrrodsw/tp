import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PreApprovalPlanGetData } from './get/types';
import type { UpdatePreApprovalPlanUpdateData } from './update/types';
import type { PreApprovalPlanSearchResponse, PreApprovalPlanSearchData } from './search/types';
import type { PreApprovalPlanResponse } from './commonTypes';
import type { PreApprovalPlanCreateData } from './create/types';
/**
 * Mercado Pago PreApprovalPlan.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class PreApprovalPlan {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/create.ts Usage Example  }.
   */
    create({ body, requestOptions }: PreApprovalPlanCreateData): Promise<PreApprovalPlanResponse>;
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/get.ts Usage Example  }.
   */
    get({ preApprovalPlanId, requestOptions }: PreApprovalPlanGetData): Promise<PreApprovalPlanResponse>;
    /**
   * Mercado Pago Update.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/update.ts Usage Example  }.
   */
    update({ id, updatePreApprovalPlanRequest, requestOptions }: UpdatePreApprovalPlanUpdateData): Promise<PreApprovalPlanResponse>;
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/search.ts Usage Example  }.
   */
    search(preApprovalPlanSearchData?: PreApprovalPlanSearchData): Promise<PreApprovalPlanSearchResponse>;
}
