"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cancelPaymentIntent;
const restClient_1 = require("../../../utils/restClient");
function cancelPaymentIntent({ device_id, payment_intent_id, config }) {
    return restClient_1.RestClient.fetch(`/point/integration-api/devices/${device_id}/payment-intents/${payment_intent_id}`, Object.assign({ method: 'DELETE', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        } }, config.options));
}
