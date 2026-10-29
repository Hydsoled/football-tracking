import { z } from "zod";

export const createEventSchema = z
  .object({
    stadium: z.string().trim().min(2).max(200),

    startsAt: z.iso.datetime({ offset: true }),
    endsAt: z.iso.datetime({ offset: true }),

    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Invalid price")
      .transform(Number)
      .pipe(z.number().min(0).max(999999.99)),

    ownerHasBall: z.boolean(),
    mainSlots: z.coerce.number().int().min(1).max(100),
    reserveSlots: z.coerce.number().int().min(0).max(100),
  })
  .refine(
    data =>
      new Date(data.endsAt).getTime() >
      new Date(data.startsAt).getTime(),
    {
      message: "End time must be after start time",
      path: ["endsAt"],
    }
  )
  .refine(
    data => new Date(data.startsAt).getTime() > Date.now(),
    {
      message: "Start time must be in the future",
      path: ["startsAt"],
    }
  );

export type CreateEventInput = z.output<
  typeof createEventSchema
>;

// Reusable rules for event fields.
export const eventFieldsSchema = z.object({
  stadium: z.string().trim().min(2).max(200),

  startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .transform(Number)
    .pipe(z.number().min(0).max(999999.99)),

  ownerHasBall: z.boolean(),
  mainSlots: z.coerce.number().int().min(1).max(100),
  reserveSlots: z.coerce.number().int().min(0).max(100),
});

export const updateEventSchema = eventFieldsSchema
  .extend({
    eventId: z.uuid(),
  })
  .refine(
    data =>
      Date.parse(data.endsAt) > Date.parse(data.startsAt),
    {
      path: ["endsAt"],
      message: "End time must be after start time",
    }
  )
  .refine(
    data => Date.parse(data.endsAt) > Date.now(),
    {
      path: ["endsAt"],
      message: "The event must not already be completed",
    }
  );

export type UpdateEventInput =
  z.output<typeof updateEventSchema>;