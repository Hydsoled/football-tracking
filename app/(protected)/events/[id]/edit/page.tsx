import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/features/auth/data/auth.queries";
import { getEventById } from "@/features/events/data/event-queries";
import { EditEventForm } from "@/features/events/components/edit-event-form";

type Props = {
  params: Promise<{ id: string }>;
};

async function EditEventContent({ params }: Props) {
  await connection();

  const { id } = await params;
  const user = await requireUser();

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const event = await getEventById(id);

  if (!event || event.ownerId !== user.id) {
    notFound();
  }

  if (new Date(event.endsAt).getTime() <= Date.now()) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <EditEventForm event={event} />
    </main>
  );
}

export default function EditEventPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="p-6">Loading event...</p>}>
      <EditEventContent params={params} />
    </Suspense>
  );
}