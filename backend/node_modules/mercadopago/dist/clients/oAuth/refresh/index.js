"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = refresh;
const restClient_1 = require("../../../utils/restClient");
function refresh({ body, config }) {
    const defaultRequest = Object.assign(Object.assign({}, body), { 'grant_type': 'refresh_token' });
    return restClient_1.RestClient.fetch('/oauth/token', Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(defaultRequest) }, config.options));
}
