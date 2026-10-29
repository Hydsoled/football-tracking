import { Suspense } from "react";
import { CreateEventContent } from "@/features/events/components/create-event-content";

export default function NewEventPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <CreateEventContent />
    </Suspense>
  );
}