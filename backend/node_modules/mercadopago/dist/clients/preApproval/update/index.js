"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
const restClient_1 = require("../../../utils/restClient");
function update({ id, body, config }) {
    return restClient_1.RestClient.fetch(`/preapproval/${id}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(body) }, config.options));
}
