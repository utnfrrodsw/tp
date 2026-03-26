"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
const restClient_1 = require("../../../utils/restClient");
function update({ id, updatePreApprovalPlanRequest, config }) {
    return restClient_1.RestClient.fetch(`/preapproval_plan/${id}`, Object.assign({ method: 'PUT', headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        }, body: JSON.stringify(updatePreApprovalPlanRequest) }, config.options));
}
