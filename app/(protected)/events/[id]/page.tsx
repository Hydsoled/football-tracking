import { Suspense } from "react";
import { EventDetailsContent } from "@/features/events/components/event-details-content";
import { EventDetailsSkeleton } from "@/features/events/components/event-details-skeleton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({
  params,
}: Props) {

  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}

