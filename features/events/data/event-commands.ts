import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";
import type { CreateEventInput, UpdateEventInput } from "@/features/events/schemas/event.schema";

export async function createEvent(
  input: CreateEventInput
): Promise<string> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      owner_id: user.id,
      stadium: input.stadium,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      price: input.price,
      owner_has_ball: input.ownerHasBall,
    })
    .select("id")
    .single();

  console.log(error);

  if (error || !data) {
    throw new Error("Unable to create event");
  }

  return data.id;
}

export async function updateEvent(input: UpdateEventInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .update({
      stadium: input.stadium,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      price: input.price,
      owner_has_ball: input.ownerHasBall,
    })
    .eq("id", input.eventId)
    .eq("owner_id", user.id)
    .gt("ends_at", new Date().toISOString())
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Failed to update event");
  }

  if (!data) {
    throw new Error(
      "Event not found, completed, or you are not the owner"
    );
  }
}

export async function deleteEvent(eventId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .gt("ends_at", new Date().toISOString())
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Failed to delete event");
  }

  if (!data) {
    throw new Error(
      "Event not found, completed, or you are not the owner"
    );
  }
}