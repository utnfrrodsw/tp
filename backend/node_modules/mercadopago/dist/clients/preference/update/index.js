"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
const restClient_1 = require("../../../utils/restClient");
function update({ id, updatePreferenceRequest, config }) {
    return restClient_1.RestClient.fetch(`/checkout/preferences/${id}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(updatePreferenceRequest) }, config.options));
}
