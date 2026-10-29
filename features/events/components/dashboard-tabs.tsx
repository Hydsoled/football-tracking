"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EventStatus = "upcoming" | "completed";

type Props = {
  status: EventStatus;
};

export function DashboardTabs({ status }: Props) {
  const router = useRouter();

  function handleChange(value: string | number) {
    if (value !== "upcoming" && value !== "completed") {
      return;
    }

    router.push(
      `/dashboard?status=${value}&page=1`
    );
  }

  return (
    <Tabs value={status} onValueChange={handleChange}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="upcoming">
          Upcoming
        </TabsTrigger>

        <TabsTrigger value="completed">
          Completed
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}