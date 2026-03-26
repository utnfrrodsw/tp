"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAuthorizationURL;
const restClient_1 = require("../../../utils/restClient");
function getAuthorizationURL({ options }) {
    const defaultOptions = Object.assign(Object.assign({}, options), { response_type: 'code', platform_id: 'mp' });
    const AUTH_HOST = 'https://auth.mercadopago.com/authorization';
    return restClient_1.RestClient.appendQueryParamsToUrl(AUTH_HOST, defaultOptions);
}
