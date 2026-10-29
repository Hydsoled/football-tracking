
"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteEventAction } from "@/features/events/actions/manage-event.action";

export function DeleteEventButton({
  eventId,
}: {
  eventId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);

    startTransition(async () => {
      try {
        await deleteEventAction(eventId);
      } catch {
        setError("Unable to delete this event.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Delete Event
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this event?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete the event and
              all its registrations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={pending}
              onClick={handleDelete}
            >
              {pending ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
