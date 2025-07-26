import { Request, Response, NextFunction } from 'express';

const asyncHandeler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) =>
        next(err))
    }
}
export { asyncHandeler }