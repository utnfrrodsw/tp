"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = get;
const restClient_1 = require("../../../utils/restClient");
function get({ payment_id, refund_id, config }) {
    return restClient_1.RestClient.fetch(`/v1/payments/${payment_id}/refunds/${refund_id}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        } }, config.options));
}
