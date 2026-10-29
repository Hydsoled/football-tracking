import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  status: z
    .enum(["upcoming", "completed"])
    .catch("upcoming"),

  page: z.coerce.number().int().min(1).max(10000).catch(1),
});

export type DashboardFilters = z.infer<
  typeof dashboardFiltersSchema
>;

export const DASHBOARD_PAGE_SIZE = 6;