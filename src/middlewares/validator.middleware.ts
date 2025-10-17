import { NextFunction, Request, Response,  } from 'express';

const validatorSchema = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            res.status(404).json({ message: error.errors.map((err: any) => err.message) });
            return;
        }
    };
};

export { validatorSchema };
