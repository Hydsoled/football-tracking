import { CalendarDays, MapPin, Volleyball } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { EventDTO } from "@/features/events/dto/event.dto";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type Props = {
  event: EventDTO;
  status: "upcoming" | "completed";
};

export function EventCard({ event, status }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{event.stadium}</CardTitle>

          <Badge variant="secondary">
            {status === "upcoming"
              ? "Upcoming"
              : "Completed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4" />
          <span>
            {new Date(event.startsAt).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4" />
          <span>{event.stadium}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Volleyball className="size-4" />
          <span>
            {event.ownerHasBall
              ? "Owner has a ball"
              : "Owner doesn't have a ball"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-semibold">
            {event.price.toFixed(2)} GEL
          </p>
        </div>

        <Link
          href={`/events/${event.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          >
          View Event
        </Link>
      </CardContent>
    </Card>
  );
}