import type { MercadoPagoConfig } from '../../mercadoPagoConfig';
import type { CustomerGetRemoveData, CustomerResponse } from './commonTypes';
import type { CustomerUpdateData } from './update/types';
import type { CustomerSearchData, CustomerSearchResultsPage } from './search/types';
import type { CustomerCardResponse, CustomerCardGetRemoveData } from '../customerCard/commonTypes';
import type { CustomerCardListData } from '../customerCard/list/types';
import type { CustomerCreateData } from './create/types';
import type { CustomerCardCreateData } from '../customerCard/create/types';
/**
 * Mercado Pago Customer.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/customers/_customers/post Documentation }.
 */
export declare class Customer {
    private config;
    private customerCard;
    constructor(mercadoPagoConfig: MercadoPagoConfig);
    /**
     * Mercado Pago Customer create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/create.ts Usage Example  }.
     */
    create({ body, requestOptions }: CustomerCreateData): Promise<CustomerResponse>;
    /**
     * Mercado Pago customer get.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/get.ts Usage Example  }.
     */
    get({ customerId, requestOptions }: CustomerGetRemoveData): Promise<CustomerResponse>;
    /**
     * Mercado Pago customer remove.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/remove.ts Usage Example  }.
     */
    remove({ customerId, requestOptions }: CustomerGetRemoveData): Promise<CustomerResponse>;
    /**
     * Mercado Pago customer update.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/update.ts Usage Example  }.
     */
    update({ customerId, body, requestOptions }: CustomerUpdateData): Promise<CustomerResponse>;
    /**
     * Mercado Pago customer search.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/search.ts Usage Example  }.
     */
    search(CustomerSearchOptions?: CustomerSearchData): Promise<CustomerSearchResultsPage>;
    /**
     * Mercado Pago create card for customer.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/createCard.ts Usage Example  }.
     */
    createCard({ customerId, body, requestOptions }: CustomerCardCreateData): Promise<CustomerCardResponse>;
    /**
     * Mercado Pago  get customer's card.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/getCard.ts Usage Example  }.
     */
    getCard({ customerId, cardId, requestOptions }: CustomerCardGetRemoveData): Promise<CustomerCardResponse>;
    /**
     * Mercado Pago remove customer's card .
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/removeCard.ts Usage Example  }.
     */
    removeCard({ customerId, cardId, requestOptions }: CustomerCardGetRemoveData): Promise<CustomerCardResponse>;
    /**
     * Mercado Pago  list customer's cards .
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/listCards.ts Usage Example  }.
     */
    listCards({ customerId, requestOptions }: CustomerCardListData): Promise<CustomerCardResponse[]>;
}
