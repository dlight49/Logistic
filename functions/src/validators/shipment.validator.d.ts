import { z } from 'zod';
export declare const CreateShipmentSchema: z.ZodObject<{
    sender_name: z.ZodString;
    sender_city: z.ZodString;
    sender_country: z.ZodString;
    sender_address: z.ZodString;
    receiver_name: z.ZodString;
    receiver_city: z.ZodString;
    receiver_country: z.ZodString;
    receiver_address: z.ZodString;
    receiver_phone: z.ZodString;
    receiver_email: z.ZodString;
    weight: z.ZodNumber;
    type: z.ZodString;
    est_delivery: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sender_country: string;
    receiver_country: string;
    type: string;
    sender_name: string;
    sender_city: string;
    sender_address: string;
    receiver_name: string;
    receiver_city: string;
    receiver_address: string;
    receiver_phone: string;
    receiver_email: string;
    weight: number;
    est_delivery: string;
}, {
    sender_country: string;
    receiver_country: string;
    type: string;
    sender_name: string;
    sender_city: string;
    sender_address: string;
    receiver_name: string;
    receiver_city: string;
    receiver_address: string;
    receiver_phone: string;
    receiver_email: string;
    weight: number;
    est_delivery: string;
}>;
export declare const UpdateTrackingSchema: z.ZodObject<{
    status: z.ZodString;
    location: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    location: string;
    notes?: string | undefined;
}, {
    status: string;
    location: string;
    notes?: string | undefined;
}>;
export declare const AssignOperatorSchema: z.ZodObject<{
    operator_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    operator_id: string;
}, {
    operator_id: string;
}>;
//# sourceMappingURL=shipment.validator.d.ts.map