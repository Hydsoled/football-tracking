import {
  leaveEventAction,
  removeParticipantAction,
  updatePaymentAction,
} from "@/features/participants/actions/participant.actions";

import type { ParticipantDTO } from "@/features/participants/dto/participant.dto";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  eventId: string;
  participants: ParticipantDTO[];
  currentUserId: string;
  ownerId: string;
};

export function ParticipantList({
  eventId,
  participants,
  currentUserId,
  ownerId,
}: Props) {
  const isOwner = currentUserId === ownerId;

  if (participants.length === 0) {
    return <p>No players have registered yet.</p>;
  }

  const mainPlayers = participants.filter(
    participant => participant.slotType === "main"
  );

  const reserves = participants.filter(
    participant => participant.slotType === "reserve"
  );

  return (
    <div className="space-y-3">
      {participants.map(participant => (
        <Card key={participant.userId}>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">
                  {participant.firstName}{" "}
                  {participant.lastName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {participant.hasBall
                    ? "Bringing a ball"
                    : "No ball"}
                </p>
              </div>

              <Badge
                variant={
                  participant.isPaid
                    ? "default"
                    : "secondary"
                }
              >
                {participant.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>

            {isOwner && (
              <form action={updatePaymentAction}>
                <input
                  type="hidden"
                  name="eventId"
                  value={eventId}
                />

                <input
                  type="hidden"
                  name="userId"
                  value={participant.userId}
                />

                <input
                  type="hidden"
                  name="isPaid"
                  value={String(!participant.isPaid)}
                />

                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                >
                  {participant.isPaid
                    ? "Mark unpaid"
                    : "Mark paid"}
                </Button>
              </form>
              
            )}

            {isOwner && (
              <form action={removeParticipantAction}>
                <input
                  type="hidden"
                  name="eventId"
                  value={eventId}
                />

                <input
                  type="hidden"
                  name="userId"
                  value={participant.userId}
                />

                <Button type="submit" variant="destructive" size="sm">
                  Remove player
                </Button>
              </form>
            )}

            {participant.userId === currentUserId && (
              <form action={leaveEventAction}>
                <input
                  type="hidden"
                  name="eventId"
                  value={eventId}
                />

                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                >
                  Leave event
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}