"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const cancelPaymentIntent_1 = __importDefault(require("./cancelPaymentIntent"));
const changeDeviceOperatingMode_1 = __importDefault(require("./changeDeviceOperatingMode"));
const createPaymentIntent_1 = __importDefault(require("./createPaymentIntent"));
const getDevices_1 = __importDefault(require("./getDevices"));
const getPaymentIntentList_1 = __importDefault(require("./getPaymentIntentList"));
const getPaymentIntentStatus_1 = __importDefault(require("./getPaymentIntentStatus"));
const searchPaymentIntent_1 = __importDefault(require("./searchPaymentIntent"));
/**
 * Mercado Pago Point.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class Point {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Create Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/createPaymentIntent.ts Usage Example }.
   */
    createPaymentIntent({ device_id, request, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, createPaymentIntent_1.default)({ device_id, request, config: this.config });
    }
    /**
   * Mercado Pago Search Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/searchPaymentIntent.ts Usage Example }.
   */
    searchPaymentIntent({ payment_intent_id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, searchPaymentIntent_1.default)({ payment_intent_id: payment_intent_id, config: this.config });
    }
    /**
   * Mercado Pago Cancel Payment Intent.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/cancelPaymentIntent.ts Usage Example }.
   */
    cancelPaymentIntent({ device_id, payment_intent_id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, cancelPaymentIntent_1.default)({ device_id, payment_intent_id, config: this.config });
    }
    /**
   * Mercado Pago Get Payment Intent List.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getPaymentIntentList.ts Usage Example }.
   */
    getPaymentIntentList(pointGetPaymentIntentListOptions = {}) {
        const { body, requestOptions } = pointGetPaymentIntentListOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, getPaymentIntentList_1.default)({ options: body === null || body === void 0 ? void 0 : body.options, config: this.config });
    }
    /**
   * Mercado Pago Get Payment Intent Status.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getPaymentIntentStatus.ts Usage Example }.
   */
    getPaymentIntentStatus({ payment_intent_id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, getPaymentIntentStatus_1.default)({ payment_intent_id, config: this.config });
    }
    /**
   * Mercado Pago Get Devices.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/getDevices.ts Usage Example }.
   */
    getDevices({ request, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, getDevices_1.default)({ options: request === null || request === void 0 ? void 0 : request.options, config: this.config });
    }
    /**
   * Mercado Pago Change Device Operating Mode.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/point/changeDeviceOperatingMode.ts Usage Example }.
   */
    changeDeviceOperatingMode({ device_id, request, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, changeDeviceOperatingMode_1.default)({ device_id, request, config: this.config });
    }
}
exports.Point = Point;
