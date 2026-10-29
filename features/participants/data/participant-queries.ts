import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";

import type { ParticipantDTO } from "@/features/participants/dto/participant.dto";

export async function getEventParticipants(
  eventId: string
): Promise<ParticipantDTO[]> {
  await requireUser();

  const supabase = await createClient();

  const { data: participants, error } = await supabase
    .from("event_participants")
    .select("user_id, has_ball, is_paid, joined_at, slot_type")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true })
    .order("user_id", { ascending: true });
    

  if (error) {
    throw new Error("Unable to load participants");
  }

  if (!participants?.length) {
    return [];
  }

  const userIds = participants.map(p => p.user_id);

  const { data: profiles, error: profilesError } =
    await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);

  if (profilesError) {
    throw new Error("Unable to load player profiles");
  }

  const profileMap = new Map(
    (profiles ?? []).map(profile => [profile.id, profile])
  );

  return participants.map(participant => {
    const profile = profileMap.get(participant.user_id);

    return {
      userId: participant.user_id,
      firstName: profile?.first_name || "Unknown",
      lastName: profile?.last_name || "",
      hasBall: participant.has_ball,
      isPaid: participant.is_paid,
      joinedAt: participant.joined_at,
      slotType: participant.slot_type as "main" | "reserve",
    };
  });
}