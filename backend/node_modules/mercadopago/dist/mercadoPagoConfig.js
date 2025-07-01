"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoConfig = void 0;
/**
 * Mercado Pago SDK Node.
 *
 * @see {@link https://github.com/mercadopago/sdk-nodejs Documentation }.
 */
class MercadoPagoConfig {
    constructor(config) {
        this.accessToken = config.accessToken;
        this.options = config.options;
    }
}
exports.MercadoPagoConfig = MercadoPagoConfig;
