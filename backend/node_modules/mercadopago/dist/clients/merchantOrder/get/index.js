"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = get;
const restClient_1 = require("../../../utils/restClient");
function get({ merchantOrderId, config }) {
    return restClient_1.RestClient.fetch(`/merchant_orders/${merchantOrderId}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        } }, config.options));
}
