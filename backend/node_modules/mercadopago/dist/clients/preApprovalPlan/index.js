"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreApprovalPlan = void 0;
const get_1 = __importDefault(require("./get"));
const create_1 = __importDefault(require("./create"));
const update_1 = __importDefault(require("./update"));
const search_1 = __importDefault(require("./search"));
/**
 * Mercado Pago PreApprovalPlan.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class PreApprovalPlan {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/create.ts Usage Example  }.
   */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
   * Mercado Pago Get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/get.ts Usage Example  }.
   */
    get({ preApprovalPlanId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ id: preApprovalPlanId, config: this.config });
    }
    /**
   * Mercado Pago Update.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/update.ts Usage Example  }.
   */
    update({ id, updatePreApprovalPlanRequest, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ id, updatePreApprovalPlanRequest, config: this.config });
    }
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/preapprovalplan/search.ts Usage Example  }.
   */
    search(preApprovalPlanSearchData = {}) {
        const { options, requestOptions } = preApprovalPlanSearchData;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, search_1.default)({ options, config: this.config });
    }
}
exports.PreApprovalPlan = PreApprovalPlan;
