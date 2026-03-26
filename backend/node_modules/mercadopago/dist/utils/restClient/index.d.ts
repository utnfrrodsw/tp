import { RequestInit } from 'node-fetch';
import type { Options } from '../../types';
interface RestClientConfig extends Options {
    queryParams?: Record<string, string | number>;
    retries?: number;
}
declare class RestClient {
    private static generateIdempotencyKey;
    static appendQueryParamsToUrl(url: string, queryParams?: Record<string, string | number>): string;
    private static retryWithExponentialBackoff;
    static fetch<T>(endpoint: string, config?: RestClientConfig & RequestInit): Promise<T>;
}
export { RestClient };
