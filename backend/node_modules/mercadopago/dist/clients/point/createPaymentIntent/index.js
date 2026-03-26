"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPaymentIntent;
const restClient_1 = require("../../../utils/restClient");
function createPaymentIntent({ device_id, request, config }) {
    return restClient_1.RestClient.fetch(`/point/integration-api/devices/${device_id}/payment-intents`, Object.assign({ method: 'POST', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(request) }, config.options));
}
