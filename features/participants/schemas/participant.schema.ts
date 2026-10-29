import { z } from "zod";

export const joinEventSchema = z.object({
  eventId: z.uuid(),
  hasBall: z.boolean(),
});

export const leaveEventSchema = z.object({
  eventId: z.uuid(),
});

export const updatePaymentSchema = z.object({
  eventId: z.uuid(),
  userId: z.uuid(),
  isPaid: z.boolean(),
});