"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createTransaction;
const restClient_1 = require("../../../../utils/restClient");
function createTransaction({ id, body, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/transactions`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body) }, config.options));
}
