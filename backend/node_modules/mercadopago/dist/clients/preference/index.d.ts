import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { PreferenceGetData } from './get/types';
import type { PreferenceUpdateData } from './update/types';
import type { PreferenceSearchData, PreferenceSearchResponse } from './search/types';
import type { PreferenceResponse } from './commonTypes';
import type { PreferenceCreateData } from './create/types';
/**
 * Mercado Pago Preference.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
export declare class Preference {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preference/get.ts Usage Example  }.
   */
    get({ preferenceId, requestOptions }: PreferenceGetData): Promise<PreferenceResponse>;
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preference/create.ts Usage Example  }.
   */
    create({ body, requestOptions }: PreferenceCreateData): Promise<PreferenceResponse>;
    /**
   * Mercado Pago Update.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preference/update.ts Usage Example  }.
   */
    update({ id, updatePreferenceRequest, requestOptions }: PreferenceUpdateData): Promise<PreferenceResponse>;
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preference/search.ts Usage Example  }.
   */
    search(preferenceSearchData?: PreferenceSearchData): Promise<PreferenceSearchResponse>;
}
