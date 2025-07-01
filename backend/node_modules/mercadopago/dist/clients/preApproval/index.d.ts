import type { PreApprovalCreateData } from './create/types';
import type { PreApprovalGetData } from './get/types';
import type { PreApprovalResponse } from './commonTypes';
import type { PreApprovalSearchData, PreApprovalSearchResponse } from './search/types';
import type { PreApprovalUpdateData, PreApprovalUpdateResponse } from './update/types';
import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
export declare class PreApproval {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/create.ts Usage Example  }.
   */
    create({ body, requestOptions }: PreApprovalCreateData): Promise<PreApprovalResponse>;
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/get.ts Usage Example  }.
   */
    get({ id, requestOptions }: PreApprovalGetData): Promise<PreApprovalResponse>;
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/search.ts Usage Example  }.
   */
    search(preApprovalSearchData?: PreApprovalSearchData): Promise<PreApprovalSearchResponse>;
    /**
   * Mercado Pago Update.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/update.ts Usage Example  }.
   */
    update({ id, body, requestOptions }: PreApprovalUpdateData): Promise<PreApprovalUpdateResponse>;
}
