import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  text: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
});

export const replyTicketSchema = z.object({
  text: z.string().min(1, "Reply text cannot be empty"),
});

export const directMessageSchema = z.object({
  receiver_id: z.string().uuid("Invalid receiver ID"),
  text: z.string().min(1, "Message cannot be empty"),
});
