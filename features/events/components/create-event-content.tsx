import { requireUser } from "@/features/auth/data/auth.queries";
import { CreateEventForm } from "@/features/events/components/create-event-form";
import { connection } from "next/server";

export async function CreateEventContent() {
  await connection()
  await requireUser();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <CreateEventForm />
    </main>
  );
}