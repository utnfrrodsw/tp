"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
const restClient_1 = require("../../../utils/restClient");
function update({ merchantOrderId, body, config }) {
    return restClient_1.RestClient.fetch(`/merchant_orders/${merchantOrderId}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body), method: 'PUT' }, config.options));
}
