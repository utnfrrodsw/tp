"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = searchPaymentIntent;
const restClient_1 = require("../../../utils/restClient");
function searchPaymentIntent({ payment_intent_id, config }) {
    return restClient_1.RestClient.fetch(`/point/integration-api/payment-intents/${payment_intent_id}`, Object.assign({ method: 'GET', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        } }, config.options));
}
