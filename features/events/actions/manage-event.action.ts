
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateEventSchema } from "../schemas/event.schema";
import { updateEvent, deleteEvent } from "../data/event-commands";

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
