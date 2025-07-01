"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDevices;
const restClient_1 = require("../../../utils/restClient");
function getDevices({ options, config }) {
    return restClient_1.RestClient.fetch('/point/integration-api/devices', Object.assign({ method: 'GET', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        }, queryParams: Object.assign({}, options) }, config.options));
}
