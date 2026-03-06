import type { Request, Response } from 'express';
export declare const getShipments: (req: Request, res: Response) => Promise<void>;
export declare const getMyShipments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getShipmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createShipment: (req: Request, res: Response) => Promise<void>;
export declare const createQuote: (req: Request, res: Response) => Promise<void>;
export declare const updateShipmentTracking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLiveLocations: (req: Request, res: Response) => Promise<void>;
export declare const assignOperator: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=shipments.controller.d.ts.map