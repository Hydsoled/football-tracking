
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/data/auth.queries";

import {
  toDashboardEventDTO,
  type DashboardEventDTO,
  type DashboardEventRecord,
} from "../dto/dashboard-event.dto";

import {
  DASHBOARD_PAGE_SIZE,
  type DashboardFilters,
} from "../schemas/dashboard.schema";

export type DashboardResult = {
  events: DashboardEventDTO[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getPaginatedDashboardEvents(
  filters: DashboardFilters
): Promise<DashboardResult> {
  await requireUser();

  const supabase = await createClient();

  const now = new Date().toISOString();
  const pageSize = DASHBOARD_PAGE_SIZE;

  const offset = (filters.page - 1) * pageSize;
  const lastIndex = offset + pageSize - 1;

  let query = supabase
    .from("event_dashboard")
    .select(
      `
        id,
        owner_id,
        stadium,
        starts_at,
        ends_at,
        price,
        owner_has_ball,
        participant_count,
        paid_count
      `,
      { count: "exact" }
    );

  if (filters.status === "upcoming") {
    query = query
      .gt("ends_at", now)
      .order("starts_at", { ascending: true })
      .order("id", { ascending: true });
  } else {
    query = query
      .lte("ends_at", now)
      .order("ends_at", { ascending: false })
      .order("id", { ascending: true });
  }

  const { data, count, error } = await query.range(
    offset,
    lastIndex
  );

  if (error) {
    console.error("Dashboard query failed:", error);
    throw new Error("Unable to load dashboard events");
  }

  const events = (
    (data ?? []) as DashboardEventRecord[]
  ).map(toDashboardEventDTO);

  const total = count ?? 0;

  return {
    events,
    total,
    page: filters.page,
    totalPages: Math.ceil(total / pageSize),
  };
}
