"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = capture;
const restClient_1 = require("../../../utils/restClient");
function capture({ id, transaction_amount, config }) {
    const captureBody = {
        capture: true,
        transaction_amount
    };
    return restClient_1.RestClient.fetch(`/v1/payments/${id}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(captureBody) }, config.options));
}
