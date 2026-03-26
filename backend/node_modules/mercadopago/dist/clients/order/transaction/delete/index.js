"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteTransaction;
const restClient_1 = require("../../../../utils/restClient");
function deleteTransaction({ id, transactionId, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/transactions/${transactionId}`, Object.assign({ method: 'DELETE', headers: {
            'Authorization': `Bearer ${config.accessToken}`
        } }, config.options));
}
