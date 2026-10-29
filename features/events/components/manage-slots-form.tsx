"use client";

import { useActionState } from "react";
import { updateSlotsAction } from "@/features/events/actions/manage-slots.action";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  eventId: string;
  mainSlots: number;
  reserveSlots: number;
};

export function ManageSlotsForm({
  eventId,
  mainSlots,
  reserveSlots,
}: Props) {
  const [state, action, pending] = useActionState(
    updateSlotsAction,
    { error: null, success: false }
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mainSlots">Main slots</Label>
          <Input
            id="mainSlots"
            name="mainSlots"
            type="number"
            min={1}
            max={100}
            defaultValue={mainSlots}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reserveSlots">Reserve slots</Label>
          <Input
            id="reserveSlots"
            name="reserveSlots"
            type="number"
            min={0}
            max={100}
            defaultValue={reserveSlots}
            required
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="text-sm text-green-600">
          Slot capacities updated.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Update slots"}
      </Button>
    </form>
  );
}