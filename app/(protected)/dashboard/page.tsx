
import { Suspense } from "react";
import { DashboardSkeleton } from "@/features/events/components/dashboard-skeleton";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

type Props = {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
};


export default function DashboardPage({
  searchParams,
}: Props) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
