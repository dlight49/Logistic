"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignOperatorSchema = exports.UpdateTrackingSchema = exports.CreateShipmentSchema = void 0;
const zod_1 = require("zod");
exports.CreateShipmentSchema = zod_1.z.object({
    sender_name: zod_1.z.string().min(1, "Sender name is required"),
    sender_city: zod_1.z.string().min(1),
    sender_country: zod_1.z.string().min(1),
    sender_address: zod_1.z.string().min(1),
    receiver_name: zod_1.z.string().min(1, "Receiver name is required"),
    receiver_city: zod_1.z.string().min(1),
    receiver_country: zod_1.z.string().min(1),
    receiver_address: zod_1.z.string().min(1),
    receiver_phone: zod_1.z.string().min(1),
    receiver_email: zod_1.z.string().email(),
    weight: zod_1.z.number().positive(),
    type: zod_1.z.string().min(1),
    est_delivery: zod_1.z.string().min(1)
});
exports.UpdateTrackingSchema = zod_1.z.object({
    status: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    notes: zod_1.z.string().optional()
});
exports.AssignOperatorSchema = zod_1.z.object({
    operator_id: zod_1.z.string().min(1)
});
//# sourceMappingURL=shipment.validator.js.map