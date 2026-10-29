"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createEventSchema, updateEventSchema } from "@/features/events/schemas/event.schema";
import { createEvent, deleteEvent, updateEvent } from "@/features/events/data/event-commands";

export type CreateEventState = {
  error: string | null;
};

export async function createEventAction(
  _previousState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const parsed = createEventSchema.safeParse({
    stadium: formData.get("stadium"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    price: formData.get("price"),
    ownerHasBall: formData.get("ownerHasBall") === "on",
    mainSlots: formData.get("mainSlots"),
    reserveSlots: formData.get("reserveSlots"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Invalid event details",
    };
  }

  try {
    await createEvent(parsed.data);
  } catch {
    return {
      error: "Could not create event. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export type ManageEventState = {
  error: string | null;
};

export async function updateEventAction(
  _previous: ManageEventState,
  formData: FormData
): Promise<ManageEventState> {
  const parsed = updateEventSchema.safeParse({
    eventId: formData.get("eventId"),
    stadium: formData.get("stadium"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    price: formData.get("price"),
    ownerHasBall: formData.get("ownerHasBall") === "on",
    mainSlots: formData.get("mainSlots"),
reserveSlots: formData.get("reserveSlots"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid event",
    };
  }

  try {
    await updateEvent(parsed.data);
  } catch {
    return {
      error: "Unable to update event. Check ownership and dates.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${parsed.data.eventId}`);

  redirect(`/events/${parsed.data.eventId}`);
}

export async function deleteEventAction(
  eventId: string
): Promise<void> {
  const parsed = z.uuid().safeParse(eventId);

  if (!parsed.success) {
    throw new Error("Invalid event ID");
  }

  await deleteEvent(parsed.data);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}