"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = refund;
const restClient_1 = require("../../../utils/restClient");
function refund({ id, body, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/refund`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body) }, config.options));
}
