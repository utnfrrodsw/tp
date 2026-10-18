import type { AccessTokenPayload } from "@/modules/auths/auth.type.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      validated: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export { };