import { z } from 'zod';

export const CreateShipmentSchema = z.object({
    sender_name: z.string().min(1, "Sender name is required"),
    sender_city: z.string().min(1),
    sender_country: z.string().min(1),
    sender_address: z.string().min(1),
    receiver_name: z.string().min(1, "Receiver name is required"),
    receiver_city: z.string().min(1),
    receiver_country: z.string().min(1),
    receiver_address: z.string().min(1),
    receiver_phone: z.string().min(1),
    receiver_email: z.string().email(),
    weight: z.number().positive(),
    type: z.string().min(1),
    est_delivery: z.string().min(1),
    insurance_selected: z.boolean().optional()
});

export const UpdateTrackingSchema = z.object({
    status: z.string().min(1),
    location: z.string().min(1),
    notes: z.string().optional()
});

export const AssignOperatorSchema = z.object({
    operator_id: z.string().min(1)
});

export const UpdateShipmentSchema = CreateShipmentSchema.partial().extend({
    status: z.string().optional(),
    estimated_cost: z.number().optional()
});
