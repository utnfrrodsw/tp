"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cancel;
const restClient_1 = require("../../../utils/restClient");
function cancel({ id, config }) {
    const cancelBody = {
        status: 'cancelled'
    };
    return restClient_1.RestClient.fetch(`/v1/payments/${id}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(cancelBody) }, config.options));
}
