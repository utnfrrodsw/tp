"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
const restClient_1 = require("../../../utils/restClient");
function create({ customerId, body, config }) {
    return restClient_1.RestClient.fetch(`/v1/customers/${customerId}/cards`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body), method: 'POST' }, config.options));
}
