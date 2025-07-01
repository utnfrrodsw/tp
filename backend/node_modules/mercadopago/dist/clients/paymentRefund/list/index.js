"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = list;
const restClient_1 = require("../../../utils/restClient");
function list({ payment_id, config }) {
    return restClient_1.RestClient.fetch(`/v1/payments/${payment_id}/refunds/`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        } }, config.options));
}
