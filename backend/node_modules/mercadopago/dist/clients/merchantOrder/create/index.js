"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
const restClient_1 = require("../../../utils/restClient");
function create({ body, config }) {
    return restClient_1.RestClient.fetch('/merchant_orders', Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`
        }, body: JSON.stringify(body), method: 'POST' }, config.options));
}
