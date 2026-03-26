"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
const restClient_1 = require("../../../utils/restClient");
function create({ body, config }) {
    const defaultRequest = Object.assign(Object.assign({}, body), { 'grant_type': 'authorization_code' });
    return restClient_1.RestClient.fetch('/oauth/token', Object.assign({ method: 'POST', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(defaultRequest) }, config.options));
}
