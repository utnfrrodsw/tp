"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = total;
const restClient_1 = require("../../../utils/restClient");
function total({ payment_id, config }) {
    return restClient_1.RestClient.fetch(`/v1/payments/${payment_id}/refunds`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify({}) }, config.options));
}
