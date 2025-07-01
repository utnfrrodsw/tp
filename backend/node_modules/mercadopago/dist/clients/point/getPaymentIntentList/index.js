"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPaymentIntentList;
const restClient_1 = require("../../../utils/restClient");
function getPaymentIntentList({ options, config }) {
    return restClient_1.RestClient.fetch('/point/integration-api/payment-intents/events', Object.assign({ method: 'GET', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        }, queryParams: Object.assign({}, options) }, config.options));
}
