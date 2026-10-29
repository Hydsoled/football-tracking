import { DashboardEventCard } from "./dashboard-event-card";
import { DashboardPagination } from "./dashboard-pagination";

import type { DashboardResult } from "../data/dashboard-queries";

type Props = {
  result: DashboardResult;
  status: "upcoming" | "completed";
};

export function DashboardEventList({
  result,
  status,
}: Props) {
  if (result.events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="font-semibold">
          {status === "upcoming"
            ? "No upcoming events"
            : "No completed events"}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {result.total === 0
            ? "Events will appear here when available."
            : "No events found on this page."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {result.events.map(event => (
          <DashboardEventCard
            key={event.id}
            event={event}
            status={status}
          />
        ))}
      </div>

      <DashboardPagination
        page={result.page}
        totalPages={result.totalPages}
        status={status}
      />
    </div>
  );
}