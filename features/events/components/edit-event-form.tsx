
"use client";

import { useActionState, useEffect, useState } from "react";

import {
  updateEventAction,
} from "@/features/events/actions/create-event.action";

import type { EventDTO } from "@/features/events/dto/event.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return local.toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString();
}

export function EditEventForm({ event }: { event: EventDTO }) {
  const [state, action, pending] = useActionState(
    updateEventAction,
    { error: null }
  );

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Resolve browser-local time only after hydration.
  useEffect(() => {
    setStart(toLocalInput(event.startsAt));
    setEnd(toLocalInput(event.endsAt));
  }, [event.startsAt, event.endsAt]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-5">
          <input
            type="hidden"
            name="eventId"
            value={event.id}
          />

          <div className="space-y-2">
            <Label htmlFor="stadium">Stadium</Label>
            <Input
              id="stadium"
              name="stadium"
              defaultValue={event.stadium}
              minLength={2}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startsLocal">Start time</Label>
            <Input
              id="startsLocal"
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              required
            />
            <input
              type="hidden"
              name="startsAt"
              value={toIso(start)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endsLocal">End time</Label>
            <Input
              id="endsLocal"
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              required
            />
            <input
              type="hidden"
              name="endsAt"
              value={toIso(end)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (GEL)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              max="999999.99"
              defaultValue={event.price}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="ownerHasBall"
              name="ownerHasBall"
              defaultChecked={event.ownerHasBall}
            />
            <Label htmlFor="ownerHasBall">
              Owner has a ball
            </Label>
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending || !start || !end}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
