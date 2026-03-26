"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const get_1 = __importDefault(require("./get"));
const create_1 = __importDefault(require("./create"));
const remove_1 = __importDefault(require("./remove"));
const update_1 = __importDefault(require("./update"));
const search_1 = __importDefault(require("./search"));
const customerCard_1 = require("../../clients/customerCard");
/**
 * Mercado Pago Customer.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/customers/_customers/post Documentation }.
 */
class Customer {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
        this.customerCard = new customerCard_1.CustomerCard(mercadoPagoConfig);
    }
    /**
     * Mercado Pago Customer create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/create.ts Usage Example  }.
     */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
     * Mercado Pago customer get.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/get.ts Usage Example  }.
     */
    get({ customerId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ customerId, config: this.config });
    }
    /**
     * Mercado Pago customer remove.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/remove.ts Usage Example  }.
     */
    remove({ customerId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, remove_1.default)({ customerId, config: this.config });
    }
    /**
     * Mercado Pago customer update.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/update.ts Usage Example  }.
     */
    update({ customerId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ customerId: customerId, body, config: this.config });
    }
    /**
     * Mercado Pago customer search.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/search.ts Usage Example  }.
     */
    search(CustomerSearchOptions = {}) {
        const { options, requestOptions } = CustomerSearchOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, search_1.default)({ options, config: this.config });
    }
    /**
     * Mercado Pago create card for customer.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/createCard.ts Usage Example  }.
     */
    createCard({ customerId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return this.customerCard.create({ customerId, body });
    }
    /**
     * Mercado Pago  get customer's card.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/getCard.ts Usage Example  }.
     */
    getCard({ customerId, cardId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return this.customerCard.get({ customerId, cardId });
    }
    /**
     * Mercado Pago remove customer's card .
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/removeCard.ts Usage Example  }.
     */
    removeCard({ customerId, cardId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return this.customerCard.remove({ customerId, cardId: cardId });
    }
    /**
     * Mercado Pago  list customer's cards .
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/listCards.ts Usage Example  }.
     */
    listCards({ customerId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return this.customerCard.list({ customerId });
    }
}
exports.Customer = Customer;
