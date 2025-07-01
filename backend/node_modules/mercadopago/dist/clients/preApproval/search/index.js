"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = search;
const restClient_1 = require("../../../utils/restClient");
function search({ options, config }) {
    return restClient_1.RestClient.fetch('/preapproval/search', Object.assign({ headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, queryParams: Object.assign({}, options) }, config.options));
}
