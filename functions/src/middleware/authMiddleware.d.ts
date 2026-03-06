import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map