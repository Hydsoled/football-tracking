
import Link from "next/link";
import {
  CalendarDays,
  Users,
  MapPin,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";

import type { DashboardEventDTO } from "../dto/dashboard-event.dto";

type Props = {
  event: DashboardEventDTO;
  status: "upcoming" | "completed";
};

const formatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tbilisi",
});

export function DashboardEventCard({
  event,
  status,
}: Props) {
  const paidPercentage =
    event.participantCount === 0
      ? 0
      : (event.paidCount / event.participantCount) * 100;

  const collected =
    event.paidCount * event.price;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            {event.stadium}
          </CardTitle>

          <Badge variant="secondary">
            {status === "upcoming"
              ? "Upcoming"
              : "Completed"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" />
          <span>
            {formatter.format(new Date(event.startsAt))}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-xs">Players</span>
            </div>

            <p className="text-xl font-semibold">
              {event.participantCount}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="size-4" />
              <span className="text-xs">Price / player</span>
            </div>

            <p className="text-xl font-semibold">
              {event.price.toFixed(2)} GEL
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment progress</span>
            <span>
              {event.paidCount}/{event.participantCount}
            </span>
          </div>

          <Progress value={paidPercentage} />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{event.unpaidCount} unpaid</span>
            <span>
              {collected.toFixed(2)} GEL recorded
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span>
            {event.ownerHasBall
              ? "Owner has a ball"
              : "Owner has no ball"}
          </span>
        </div>

        <Link
          href={`/events/${event.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "mt-auto w-full",
          })}
        >
          View Event
        </Link>
      </CardContent>
    </Card>
  );
}
