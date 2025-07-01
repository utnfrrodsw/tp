"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = remove;
const restClient_1 = require("../../../utils/restClient");
function remove({ customerId, cardId, config }) {
    return restClient_1.RestClient.fetch(`/v1/customers/${customerId}/cards/${cardId}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, method: 'DELETE' }, config.options));
}
