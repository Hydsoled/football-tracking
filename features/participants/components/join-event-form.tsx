"use client";

import { useActionState } from "react";

import { joinEventAction } from "@/features/participants/actions/participant.actions";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  eventId: string;
};

export function JoinEventForm({ eventId }: Props) {
  const [state, action, pending] = useActionState(
    joinEventAction,
    { error: null, success: false }
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />

      <div className="flex items-center gap-2">
        <Checkbox id="hasBall" name="hasBall" />
        <Label htmlFor="hasBall">
          I'll bring a ball
        </Label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="text-sm text-green-600">
          You joined this event successfully.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Joining..." : "Join Event"}
      </Button>
    </form>
  );
}