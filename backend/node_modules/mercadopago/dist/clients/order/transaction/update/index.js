"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateTransaction;
const restClient_1 = require("../../../../utils/restClient");
function updateTransaction({ id, transactionId, body, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/transactions/${transactionId}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body) }, config.options));
}
