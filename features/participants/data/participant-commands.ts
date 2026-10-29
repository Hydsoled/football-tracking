import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";

import type { z } from "zod";
import type {
  joinEventSchema,
  leaveEventSchema,
  updatePaymentSchema,
} from "@/features/participants/schemas/participant.schema";

type JoinInput = z.infer<typeof joinEventSchema>;
type LeaveInput = z.infer<typeof leaveEventSchema>;
type PaymentInput = z.infer<typeof updatePaymentSchema>;

export async function joinEvent(input: JoinInput) {
  const user = await requireUser();
  const supabase = await createClient();

  // Verify that the event still accepts registrations.
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, ends_at")
    .eq("id", input.eventId)
    .single();

  if (eventError || !event) {
    throw new Error("Event not found");
  }

  if (new Date(event.ends_at).getTime() <= Date.now()) {
    throw new Error("This event has already ended");
  }

  const { error } = await supabase
    .from("event_participants")
    .insert({
      event_id: input.eventId,
      user_id: user.id,
      has_ball: input.hasBall,
      is_paid: false,
    });

  if (error?.code === "23505") {
    throw new Error("You already joined this event");
  }

  if (error) {
    throw new Error("Unable to join event");
  }
}

export async function leaveEvent(input: LeaveInput) {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", input.eventId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Unable to leave event");
  }
}

export async function updatePayment(input: PaymentInput) {
  const user = await requireUser();
  const supabase = await createClient();

  // The authorization check must happen on the server.
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("owner_id")
    .eq("id", input.eventId)
    .single();

  if (eventError || !event || event.owner_id !== user.id) {
    throw new Error("Not authorized to manage payments");
  }

  const { error } = await supabase
    .from("event_participants")
    .update({ is_paid: input.isPaid })
    .eq("event_id", input.eventId)
    .eq("user_id", input.userId);

  if (error) {
    throw new Error("Unable to update payment");
  }
}

export async function removeParticipant(
  eventId: string,
  participantId: string
) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("owner_id, ends_at")
    .eq("id", eventId)
    .maybeSingle();

  if (
    eventError ||
    !event ||
    event.owner_id !== user.id
  ) {
    throw new Error("Not authorized to remove players");
  }

  if (Date.parse(event.ends_at) <= Date.now()) {
    throw new Error("Completed events cannot be modified");
  }

  const { data, error } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", participantId)
    .select("event_id")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Unable to remove participant");
  }
}