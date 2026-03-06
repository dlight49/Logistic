import { Request, Response } from 'express';
export declare const createTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyTickets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllTickets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTicketById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const replyToTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const closeTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tickets.controller.d.ts.map