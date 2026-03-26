"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cancel;
const restClient_1 = require("../../../utils/restClient");
function cancel({ id, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/cancel`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        } }, config.options));
}
