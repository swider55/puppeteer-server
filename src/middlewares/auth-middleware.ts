import { Request, Response, NextFunction } from 'express';

const allowedIps = (process.env.ALLOWED_IPS || '').split(',');

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip;

    if (clientIp !== undefined && allowedIps.includes(clientIp)) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
};
