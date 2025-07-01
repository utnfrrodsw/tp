import type { InvoiceResponse } from './commonTypes';
import type { InvoiceGetData } from './get/types';
import type { InvoiceSearchData, InvoiceSearchResponse } from './search/types';
import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
export declare class Invoice {
    private config;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/invoice/get.ts Usage Example  }.
   */
    get({ id, requestOptions }: InvoiceGetData): Promise<InvoiceResponse>;
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/invoice/search.ts Usage Example  }.
   */
    search(ivoicesSearchOptions?: InvoiceSearchData): Promise<InvoiceSearchResponse>;
}
