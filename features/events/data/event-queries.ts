import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";
import {
  toEventDTO,
  type EventDTO,
} from "@/features/events/dto/event.dto";

type EventGroups = {
  upcoming: EventDTO[];
  completed: EventDTO[];
};

const eventColumns = `
  id,
  stadium,
  starts_at,
  ends_at,
  price,
  owner_has_ball,
  owner_id,
  main_slots,
  reserve_slots
`;

export async function getDashboardEvents(): Promise<EventGroups> {
  await requireUser();

  const supabase = await createClient();
  const now = new Date().toISOString();

  const [upcomingResult, completedResult] =
    await Promise.all([
      supabase
        .from("events")
        .select(eventColumns)
        .gt("ends_at", now)
        .order("starts_at", { ascending: true }),

      supabase
        .from("events")
        .select(eventColumns)
        .lte("ends_at", now)
        .order("ends_at", { ascending: false }),
    ]);

  if (upcomingResult.error || completedResult.error) {
    throw new Error("Unable to load events");
  }

  return {
    upcoming: (upcomingResult.data ?? []).map(
      toEventDTO
    ),
    completed: (completedResult.data ?? []).map(
      toEventDTO
    ),
  };
}

export async function getEventById(
  eventId: string
): Promise<EventDTO | null> {
  await requireUser();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(eventColumns)
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load event");
  }

  return data ? toEventDTO(data) : null;
}