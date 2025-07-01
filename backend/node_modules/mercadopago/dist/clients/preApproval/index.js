"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreApproval = void 0;
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
const search_1 = __importDefault(require("./search"));
const update_1 = __importDefault(require("./update"));
class PreApproval {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/create.ts Usage Example  }.
   */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/get.ts Usage Example  }.
   */
    get({ id, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ id, config: this.config });
    }
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/search.ts Usage Example  }.
   */
    search(preApprovalSearchData = {}) {
        const { options, requestOptions } = preApprovalSearchData;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, search_1.default)({ options, config: this.config });
    }
    /**
   * Mercado Pago Update.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preApproval/update.ts Usage Example  }.
   */
    update({ id, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ id, body, config: this.config });
    }
}
exports.PreApproval = PreApproval;
