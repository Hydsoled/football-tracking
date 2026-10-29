"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";

export type SlotActionState = {
  error: string | null;
  success: boolean;
};

const schema = z.object({
  eventId: z.uuid(),
  mainSlots: z.coerce.number().int().min(1).max(100),
  reserveSlots: z.coerce.number().int().min(0).max(100),
});

export async function updateSlotsAction(
  _previous: SlotActionState,
  formData: FormData
): Promise<SlotActionState> {
  const parsed = schema.safeParse({
    eventId: formData.get("eventId"),
    mainSlots: formData.get("mainSlots"),
    reserveSlots: formData.get("reserveSlots"),
  });

  if (!parsed.success) {
    return { error: "Invalid slot capacities", success: false };
  }

  await requireUser();

  const supabase = await createClient();

  const { error } = await supabase.rpc("set_event_slots", {
    p_event_id: parsed.data.eventId,
    p_main_slots: parsed.data.mainSlots,
    p_reserve_slots: parsed.data.reserveSlots,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath(`/events/${parsed.data.eventId}`);
  revalidatePath("/dashboard");

  return { error: null, success: true };
}