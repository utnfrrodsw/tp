"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = process;
const restClient_1 = require("../../../utils/restClient");
function process({ id, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/process`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        } }, config.options));
}
