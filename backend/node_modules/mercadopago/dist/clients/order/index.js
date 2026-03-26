"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
const process_1 = __importDefault(require("./process"));
const capture_1 = __importDefault(require("./capture"));
const cancel_1 = __importDefault(require("./cancel"));
const refund_1 = __importDefault(require("./refund"));
const create_2 = __importDefault(require("./transaction/create"));
const update_1 = __importDefault(require("./transaction/update"));
const delete_1 = __importDefault(require("./transaction/delete"));
/**
 * Mercado Pago Order.
 *
 * @see {@link https://mercadopago.com/developers/en/docs/order/landing Documentation }.
 */
class Order {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
     * Create Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/create.ts Usage Example }.
     */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
     * Get Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/get.ts Usage Example }.
     */
    get({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ id, config: this.config });
    }
    /**
     * Process Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/process.ts Usage Example }.
     */
    process({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, process_1.default)({ id, config: this.config });
    }
    /**
     * Capture Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/capture.ts Usage Example }.
     */
    capture({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, capture_1.default)({ id, config: this.config });
    }
    /**
     * Cancel Order.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/cancel.ts Usage Example }.
     */
    cancel({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, cancel_1.default)({ id, config: this.config });
    }
    /**
     * Refund Order (total or partial).
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/refundTotal.ts Usage Example }.
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/refundPartial.ts Usage Example }.
     */
    refund({ id, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, refund_1.default)({ id, body, config: this.config });
    }
    /**
     * Create Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/create.ts Usage Example }.
     */
    createTransaction({ id, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_2.default)({ id, body, config: this.config });
    }
    /**
     * Update Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/update.ts Usage Example }.
     */
    updateTransaction({ id, transactionId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ id, transactionId, body, config: this.config });
    }
    /**
     * Delete Order transaction.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/order/transaction/delete.ts Usage Example }.
     */
    deleteTransaction({ id, transactionId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, delete_1.default)({ id, transactionId, config: this.config });
    }
}
exports.Order = Order;
