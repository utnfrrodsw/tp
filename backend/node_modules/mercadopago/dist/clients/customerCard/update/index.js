"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
const restClient_1 = require("../../../utils/restClient");
function update({ customerId, cardId, body, config }) {
    return restClient_1.RestClient.fetch(`/v1/customers/${customerId}/cards/${cardId}`, Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body), method: 'PUT' }, config.options));
}
