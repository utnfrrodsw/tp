"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = changeDeviceOperatingMode;
const restClient_1 = require("../../../utils/restClient");
function changeDeviceOperatingMode({ device_id, request, config }) {
    return restClient_1.RestClient.fetch(`/point/integration-api/devices/${device_id}`, Object.assign({ method: 'PATCH', headers: {
            Authorization: `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(request) }, config.options));
}
