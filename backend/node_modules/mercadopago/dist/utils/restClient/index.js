"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
const uuid_1 = require("uuid");
const NO_CONTENT = 204;
class RestClient {
    static generateIdempotencyKey() {
        return (0, uuid_1.v4)();
    }
    static appendQueryParamsToUrl(url, queryParams) {
        if (!queryParams)
            return url;
        const searchParams = new URLSearchParams();
        for (const key in queryParams) {
            if (Object.prototype.hasOwnProperty.call(queryParams, key) && typeof queryParams[key] !== 'undefined') {
                searchParams.append(key, queryParams[key].toString());
            }
        }
        return url.includes('?') ? `${url}&${searchParams.toString()}` : `${url}?${searchParams.toString()}`;
    }
    static async retryWithExponentialBackoff(fn, retries) {
        let attempt = 1;
        const execute = async () => {
            try {
                return await fn();
            }
            catch (error) {
                if (attempt >= retries || (error.status < 500)) {
                    throw error;
                }
                const delayMs = config_1.AppConfig.BASE_DELAY_MS * 2 ** attempt;
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                attempt++;
                return execute();
            }
        };
        return execute();
    }
    static async fetch(endpoint, config) {
        const _a = config || {}, { timeout = config_1.AppConfig.DEFAULT_TIMEOUT, idempotencyKey = RestClient.generateIdempotencyKey(), queryParams, method = 'GET', retries = config_1.AppConfig.DEFAULT_RETRIES, corporationId, integratorId, plataformId, meliSessionId, expandResponseNodes, cardValidation, testToken } = _a, customConfig = __rest(_a, ["timeout", "idempotencyKey", "queryParams", "method", "retries", "corporationId", "integratorId", "plataformId", "meliSessionId", "expandResponseNodes", "cardValidation", "testToken"]);
        const url = RestClient.appendQueryParamsToUrl(`${config_1.AppConfig.BASE_URL}${endpoint}`, queryParams);
        customConfig.headers = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, customConfig.headers), { [config_1.AppConfig.Headers.CONTENT_TYPE]: 'application/json', [config_1.AppConfig.Headers.PRODUCT_ID]: config_1.AppConfig.PRODUCT_ID, [config_1.AppConfig.Headers.TRACKING_ID]: config_1.AppConfig.getTrackingId(), [config_1.AppConfig.Headers.USER_AGENT]: config_1.AppConfig.getUserAgent() }), (corporationId ? { [config_1.AppConfig.Headers.CORPORATION_ID]: corporationId } : {})), (integratorId ? { [config_1.AppConfig.Headers.INTEGRATOR_ID]: integratorId } : {})), (plataformId ? { [config_1.AppConfig.Headers.PLATFORM_ID]: plataformId } : {})), (meliSessionId ? { [config_1.AppConfig.Headers.MELI_SESSION_ID]: meliSessionId } : {})), (expandResponseNodes ? { [config_1.AppConfig.Headers.EXPAND_RESPONDE_NODES]: expandResponseNodes } : {})), (cardValidation ? { [config_1.AppConfig.Headers.CARD_VALIDATION]: cardValidation } : {})), (testToken ? { [config_1.AppConfig.Headers.TEST_TOKEN]: testToken.toString() } : {}));
        if (method && method !== 'GET') {
            customConfig.headers = Object.assign(Object.assign({}, customConfig.headers), { [config_1.AppConfig.Headers.IDEMPOTENCY_KEY]: idempotencyKey });
        }
        let response;
        const fetchFn = async () => {
            response = await (0, node_fetch_1.default)(url, Object.assign(Object.assign({}, customConfig), { method,
                timeout }));
            if (response.ok) {
                if (response.status === NO_CONTENT) {
                    return {
                        api_response: {
                            status: response.status,
                            headers: response.headers.raw(),
                        }
                    };
                }
                const data = await response.json();
                const api_response = {
                    status: response.status,
                    headers: response.headers.raw(),
                };
                data.api_response = api_response;
                return data;
            }
            else {
                throw await response.json();
            }
        };
        return await RestClient.retryWithExponentialBackoff(fetchFn, retries);
    }
}
exports.RestClient = RestClient;
