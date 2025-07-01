export declare class AppConfig {
    static readonly DEFAULT_TIMEOUT = 10000;
    static readonly DEFAULT_RETRIES = 2;
    static readonly BASE_DELAY_MS = 1000;
    static readonly BASE_URL = "https://api.mercadopago.com";
    static readonly PRODUCT_ID = "bc32b6ntrpp001u8nhkg";
    static SDK_VERSION: string;
    static readonly Headers: {
        AUTHORIZATION: string;
        CONTENT_TYPE: string;
        USER_AGENT: string;
        IDEMPOTENCY_KEY: string;
        PRODUCT_ID: string;
        TRACKING_ID: string;
        CORPORATION_ID: string;
        INTEGRATOR_ID: string;
        PLATFORM_ID: string;
        MELI_SESSION_ID: string;
        EXPAND_RESPONDE_NODES: string;
        CARD_VALIDATION: string;
        TEST_TOKEN: string;
    };
    static getNodeVersion(): string;
    static getNodeArchitecture(): string;
    static getNodePlatform(): string;
    static getTrackingId(): string;
    static getUserAgent(): string;
}
