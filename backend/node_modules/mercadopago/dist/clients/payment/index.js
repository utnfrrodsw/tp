"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const capture_1 = __importDefault(require("./capture"));
const search_1 = __importDefault(require("./search"));
const cancel_1 = __importDefault(require("./cancel"));
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
/**
 * Mercado Pago Payment.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class Payment {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/search.ts Usage Example  }.
   */
    search(paymentSearchOptions = {}) {
        const { options, requestOptions } = paymentSearchOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, search_1.default)({ options, config: this.config });
    }
    /**
   * Mercado Pago Cancel.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/cancel.ts Usage Example  }.
   */
    cancel({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, cancel_1.default)({ id, config: this.config });
    }
    /**
   * Mercado Pago Capture.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/capture.ts Usage Example  }.
   */
    capture({ id, transaction_amount, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, capture_1.default)({ id, transaction_amount, config: this.config });
    }
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/create.ts Usage Example  }.
   */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/payment/get.ts Usage Example  }.
   */
    get({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ id, config: this.config });
    }
}
exports.Payment = Payment;
