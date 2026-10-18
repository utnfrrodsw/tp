import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { config } from '@/utils/config.js';
// El error de body-parser (express.json) no viene tipado como una clase propia,
// así que extendemos el shape que realmente trae en runtime.
interface BodyParserError extends Error {
    status?: number;
    statusCode?: number;
    type?: string; // 'entity.parse.failed' cuando el JSON está mal formado
    expose?: boolean;
}

export const errorHandler: ErrorRequestHandler = (
    err: BodyParserError,
    _req: Request,
    res: Response,
    _next: NextFunction ) => {

    console.error(err);
    // Invalid JSON in the body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {

        return res.status(400).send({message: "Invalid JSON", error: err.message }); // Bad request
    }


    const status = err.status ?? err.statusCode ?? 500;
    res.status(status).json({
        message: 'Internal server error',
        error:
            config.NODE_ENV === 'production'
                ? undefined
                : err.message,
    });
};