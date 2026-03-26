"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = capture;
const restClient_1 = require("../../../utils/restClient");
function capture({ id, config }) {
    return restClient_1.RestClient.fetch(`/v1/orders/${id}/capture`, Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        } }, config.options));
}
