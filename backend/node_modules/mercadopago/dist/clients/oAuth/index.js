"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth = void 0;
const create_1 = __importDefault(require("./create"));
const refresh_1 = __importDefault(require("./refresh"));
const getAuthorizationURL_1 = __importDefault(require("./getAuthorizationURL"));
/**
 * Mercado Pago OAuth.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/oauth/_oauth_token/post Documentation }.
 */
class OAuth {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
     * Mercado Pago OAuth Create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/create.ts Usage Example  }.
     */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
     * Mercado Pago OAuth Refresh.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/refresh.ts Usage Example  }.
     */
    refresh({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, refresh_1.default)({ body, config: this.config });
    }
    /**
     * Mercado Pago OAuth getAuthorizationURL.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/oauth/getAuthorizationURL.ts Usage Example  }.
     */
    getAuthorizationURL({ options }) {
        return (0, getAuthorizationURL_1.default)({ options });
    }
}
exports.OAuth = OAuth;
