"use server";

import { revalidatePath } from "next/cache";

import {
  joinEventSchema,
  leaveEventSchema,
  updatePaymentSchema,
} from "@/features/participants/schemas/participant.schema";

import {
  joinEvent,
  leaveEvent,
  removeParticipant,
  updatePayment,
} from "@/features/participants/data/participant-commands";

export type ParticipantActionState = {
  error: string | null;
  success: boolean;
};

export async function joinEventAction(
  _previous: ParticipantActionState,
  formData: FormData
): Promise<ParticipantActionState> {
  const result = joinEventSchema.safeParse({
    eventId: formData.get("eventId"),
    hasBall: formData.get("hasBall") === "on",
  });

  if (!result.success) {
    return { error: "Invalid registration details", success: false };
  }

  try {
    await joinEvent(result.data);
  } catch (error) {
    return {
      error: error instanceof Error
        ? error.message
        : "Unable to join event",
      success: false,
    };
  }

  revalidatePath(`/events/${result.data.eventId}`);
  revalidatePath("/dashboard");

  return { error: null, success: true };
}

export async function leaveEventAction(
  formData: FormData
) {
  const result = leaveEventSchema.safeParse({
    eventId: formData.get("eventId"),
  });

  if (!result.success) {
    throw new Error("Invalid event ID");
  }

  await leaveEvent(result.data);

  revalidatePath(`/events/${result.data.eventId}`);
}

export async function updatePaymentAction(
  formData: FormData
) {
  const result = updatePaymentSchema.safeParse({
    eventId: formData.get("eventId"),
    userId: formData.get("userId"),
    isPaid: formData.get("isPaid") === "true",
  });

  if (!result.success) {
    throw new Error("Invalid payment request");
  }

  await updatePayment(result.data);

  revalidatePath(`/events/${result.data.eventId}`);
}

export async function removeParticipantAction(
  formData: FormData
) {
  const parsed = updatePaymentSchema.pick({
    eventId: true,
    userId: true,
  }).safeParse({
    eventId: formData.get("eventId"),
    userId: formData.get("userId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid participant");
  }

  await removeParticipant(parsed.data.eventId, parsed.data.userId);

  revalidatePath(`/events/${parsed.data.eventId}`);
  revalidatePath("/dashboard");
}