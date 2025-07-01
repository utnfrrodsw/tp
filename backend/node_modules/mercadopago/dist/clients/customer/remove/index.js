"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = remove;
const restClient_1 = require("../../../utils/restClient");
function remove({ customerId, config }) {
    return restClient_1.RestClient.fetch(`/v1/customers/${customerId}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, method: 'DELETE' }, config.options));
}
