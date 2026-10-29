
"use client";

import { useActionState, useState } from "react";

import {
  createEventAction,
} from "@/features/events/actions/create-event.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function toIsoDateTime(value: string): string {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString();
}

export function CreateEventForm() {
  const [state, formAction, pending] = useActionState(
    createEventAction,
    { error: null }
  );

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create football event</CardTitle>
        <CardDescription>
          Organize your next football match.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="stadium">Stadium</Label>
            <Input
              id="stadium"
              name="stadium"
              placeholder="Stadium name"
              minLength={2}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startLocal">
              Start date and time
            </Label>

            <Input
              id="startLocal"
              type="datetime-local"
              value={startsAt}
              onChange={event =>
                setStartsAt(event.target.value)
              }
              required
            />

            <input
              type="hidden"
              name="startsAt"
              value={toIsoDateTime(startsAt)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endLocal">
              End date and time
            </Label>

            <Input
              id="endLocal"
              type="datetime-local"
              value={endsAt}
              onChange={event =>
                setEndsAt(event.target.value)
              }
              required
            />

            <input
              type="hidden"
              name="endsAt"
              value={toIsoDateTime(endsAt)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price per player (GEL)
            </Label>

            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              max="999999.99"
              step="0.01"
              placeholder="15.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mainSlots">Main player slots</Label>
            <Input
              id="mainSlots"
              name="mainSlots"
              type="number"
              min={1}
              max={100}
              defaultValue={10}
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
              defaultValue={5}
              required
            />
          </div>
        </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="ownerHasBall"
              name="ownerHasBall"
            />

            <Label htmlFor="ownerHasBall">
              I have a ball
            </Label>
          </div>

          {state.error && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full"
          >
            {pending ? "Creating..." : "Create event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
