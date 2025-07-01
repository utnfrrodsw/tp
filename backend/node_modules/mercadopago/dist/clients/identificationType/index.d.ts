import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { IdentificationTypeResponse, IdentificationTypeListData } from './list/types';
/**
 * Mercado Pago IdentificationType.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/identification_types/_identification_types/get Documentation }.
 */
export declare class IdentificationType {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Identification Types get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/identificationtype/list.ts Usage Example  }.
   */
    list(identificationTypeListOptions?: IdentificationTypeListData): Promise<IdentificationTypeResponse[]>;
}
