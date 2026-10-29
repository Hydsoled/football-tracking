
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/features/auth/data/auth.queries";
import { getEventById } from "@/features/events/data/event-queries";

import { getEventParticipants } from "@/features/participants/data/participant-queries";
import { JoinEventForm } from "@/features/participants/components/join-event-form";
import { ParticipantList } from "@/features/participants/components/participant-list";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { DeleteEventButton } from "@/features/events/components/delete-event-button";
import { ManageSlotsForm } from "./manage-slots-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function EventDetailsContent({ params }: Props) {
  await connection();

  const user = await requireUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const participants = await getEventParticipants(id);

  const isRegistered = participants.some(
    participant => participant.userId === user.id
  );

  const isCompleted =
    new Date(event.endsAt).getTime() <= Date.now();

  const totalPaid = participants.filter(
    participant => participant.isPaid
  ).length;

  const isOwner = event.ownerId === user.id;

  const mainPlayers = participants.filter(
    participant => participant.slotType === "main"
  );

  const reserves = participants.filter(
    participant => participant.slotType === "reserve"
  );

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl">
              {event.stadium}
            </CardTitle>

            <Badge variant="secondary">
              {isCompleted ? "Completed" : "Upcoming"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>
            Start:{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Tbilisi",
            }).format(new Date(event.startsAt))}
          </p>

          <p>
            End:{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Tbilisi",
            }).format(new Date(event.endsAt))}
          </p>

          <p>
            Price: {event.price.toFixed(2)} GEL
          </p>

          <p>
            Owner has a ball:{" "}
            {event.ownerHasBall ? "Yes" : "No"}
          </p>

          <p>Registered players: {participants.length}</p>
          <p>Paid players: {totalPaid}</p>
          <p>Main players: {mainPlayers.length}</p>
          <p>Reserve players: {reserves.length}</p>
        </CardContent>
      </Card>

      {!isCompleted && !isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle>Join this event</CardTitle>
          </CardHeader>

          <CardContent>
            <JoinEventForm eventId={event.id} />
          </CardContent>
        </Card>
      )}

      {isOwner && !isCompleted && (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/events/${event.id}/edit`}
            className={buttonVariants({ variant: "outline" })}
          >
            Edit Event
          </Link>

          <DeleteEventButton eventId={event.id} />
        </div>
      )}

      {isOwner && !isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Player Slots</CardTitle>
          </CardHeader>

          <CardContent>
            <ManageSlotsForm
              eventId={event.id}
              mainSlots={event.mainSlots}
              reserveSlots={event.reserveSlots}
            />
          </CardContent>
        </Card>
      )}

      {isRegistered && (
        <p className="text-sm text-green-600">
          You're registered for this event.
        </p>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Main Players</h2>

          <Badge variant="secondary">
            {mainPlayers.length}/{event.mainSlots}
          </Badge>
        </div>

        <ParticipantList
          eventId={event.id}
          participants={mainPlayers}
          currentUserId={user.id}
          ownerId={event.ownerId}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reserve Queue</h2>

          <Badge variant="secondary">
            {reserves.length}/{event.reserveSlots}
          </Badge>
        </div>

        {reserves.length > 0 ? (
          <ParticipantList
            eventId={event.id}
            participants={reserves}
            currentUserId={user.id}
            ownerId={event.ownerId}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No reserve players yet.
          </p>
        )}
      </section>
    </main>
  );
}