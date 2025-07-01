"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = get;
const restClient_1 = require("../../../utils/restClient");
function get({ id, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}`, Object.assign({ method: 'GET', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        } }, config.options));
}
