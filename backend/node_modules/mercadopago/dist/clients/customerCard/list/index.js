"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = list;
const restClient_1 = require("../../../utils/restClient");
function list({ customerId, config }) {
    return restClient_1.RestClient.fetch(`/v1/customers/${customerId}/cards`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        } }, config.options));
}
