
import { connection } from "next/server";
import Link from "next/link";

import { requireUser } from "@/features/auth/data/auth.queries";
import { LogoutButton } from "@/features/auth/components/logout-button";

import { getPaginatedDashboardEvents } from "@/features/events/data/dashboard-queries";
import { dashboardFiltersSchema } from "@/features/events/schemas/dashboard.schema";

import { DashboardTabs } from "@/features/events/components/dashboard-tabs";
import { DashboardEventList } from "@/features/events/components/dashboard-event-list";

import { buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
};

export async function DashboardContent({
  searchParams,
}: Props) {
  // Required for request-time values with Cache Components.
  await connection();

  // searchParams must be read inside Suspense.
  const params = await searchParams;

  const filters = dashboardFiltersSchema.parse(params);

  const user = await requireUser();

  const result = await getPaginatedDashboardEvents(filters);

  if (
    result.totalPages > 0 &&
    filters.page > result.totalPages
  ) {
    redirect(
      `/dashboard?status=${filters.status}&page=${result.totalPages}`
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            Football Events
          </h1>

          <p className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/events/new"
            className={buttonVariants()}
          >
            Create Event
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="space-y-6">
        <DashboardTabs status={filters.status} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">
              {filters.status === "upcoming"
                ? "Upcoming Events"
                : "Completed Events"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {result.total} events found
            </p>
          </div>
        </div>

        <DashboardEventList
          result={result}
          status={filters.status}
        />
      </section>
    </main>
  );
}